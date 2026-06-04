from datetime import date, timedelta
from typing import Sequence

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.board import Board
from app.models.sprint import Sprint
from app.models.story import Story
from app.models.column import Column
from app.models.sprint_snapshot import SprintSnapshot

async def _get_board(board_id: str, db: AsyncSession) -> Board:
    result = await db.execute(
        select(Board)
        .where(Board.id == board_id)
    )
    board = result.scalar_one_or_none()
    if not board:
        raise HTTPException(status_code=404, detail=f"Board {board_id} not found")
    return board

async def _get_completed_sprints_with_stories_and_snapshots(board_id:str, last_n:int, db:AsyncSession) -> Sequence[Sprint]:
    result = await db.execute(
        select(Sprint)
        .options(selectinload(Sprint.stories).selectinload(Story.column))
        .options(selectinload(Sprint.snapshots))
        .where((Sprint.board_id == board_id) & (Sprint.status == 'completed'))
        .order_by(Sprint.end_date.desc())
        .limit(last_n)
    )
    sprints = result.scalars().all()
    return sprints

async def _get_sprint(sprint_id: str, db: AsyncSession) -> Sprint:
    result = await db.execute(select(Sprint).where(Sprint.id == sprint_id))
    sprint = result.scalar_one_or_none()
    if not sprint:
        raise HTTPException(status_code=404, detail=f"Sprint {sprint_id} not found")
    return sprint

async def _get_sprint_with_stories(sprint_id: str, db: AsyncSession) -> Sprint:
    result = await db.execute(
        select(Sprint)
        .options(selectinload(Sprint.stories))
        .where(Sprint.id == sprint_id)
    )
    sprint = result.scalar_one_or_none()
    if sprint is None:
        raise HTTPException(status_code=404, detail=f"Sprint {sprint_id} not found")
    return sprint

async def _get_snapshot_for_today(sprint_id: str, db: AsyncSession) -> SprintSnapshot | None:
    result = await db.execute(select(SprintSnapshot).where((SprintSnapshot.sprint_id == sprint_id) & (SprintSnapshot.snapshot_date == date.today())))
    sprint_snapshot = result.scalar_one_or_none()
    
    return sprint_snapshot

async def _get_snapshots(sprint_id: str, db: AsyncSession) -> Sequence[SprintSnapshot]:
    result = await db.execute(
        select(SprintSnapshot)
        .where(SprintSnapshot.sprint_id == sprint_id)
        .order_by(SprintSnapshot.snapshot_date)
    )
    snapshots = result.scalars().all()

    return snapshots

async def take_snapshot(sprint_id: str, db: AsyncSession) -> None:
    """
    Record a burndown snapshot for today for the given sprint.

    Steps:
    1. Fetch all stories in this sprint.
    2. Sum points for stories whose column_id is a done column → points_completed.
    3. Sum points for all other stories in the sprint → points_remaining.
    4. Upsert a SprintSnapshot row for (sprint_id, today):
       - If a row for today already exists, update points_remaining and points_completed.
       - Otherwise insert a new row.
    5. Commit and return.

    Raises:
        HTTPException 404: sprint not found
    """
    sprint = await _get_sprint_with_stories(sprint_id, db)
    column_ids = {s.column_id for s in sprint.stories if s.column_id}
    columns_by_id = {}
    if column_ids:
        result = await db.execute(select(Column).where(Column.id.in_(column_ids)))
        columns_by_id = {c.id: c for c in result.scalars().all()}
    
    points_completed = 0
    points_remaining = 0

    for story in sprint.stories:
        if story.column_id and columns_by_id[story.column_id].is_done_column:
            points_completed += story.points or 0
        else:
            points_remaining += story.points or 0
    
    snapshot = await _get_snapshot_for_today(sprint_id, db)

    if snapshot is None:
        snapshot = SprintSnapshot(
            sprint_id=sprint_id,
            snapshot_date=date.today(),
            points_completed=0,
            points_remaining=0
        )
        db.add(snapshot)

    snapshot.points_completed = points_completed
    snapshot.points_remaining = points_remaining

    await db.commit()
    await db.refresh(snapshot)

#TODO: typeddict
async def get_burndown(sprint_id: str, db: AsyncSession) -> list[dict[str, int | date | None]]:
    """
    Return burndown data for a sprint as a list of daily data points.

    Returns a list of dicts: [{ date, ideal_remaining, actual_remaining }, ...]

    Steps:
    1. Fetch the sprint; raise 404 if not found.
    2. Determine the date range: sprint.start_date to min(today, sprint.end_date).
       If start_date is None, return [].
    3. Compute total_points = sum of points of all stories in the sprint at the
       time the sprint started (use the first snapshot's
       points_remaining + points_completed as the committed total).
    4. Ideal line: straight linear interpolation from total_points on start_date
       to 0 on end_date, one value per day.
    5. Actual line: for each date, use the matching SprintSnapshot row's
       points_remaining. For today (if no snapshot yet), compute live from stories.
    6. Return the merged list sorted by date ascending.

    Raises:
        HTTPException 404: sprint not found
    """
    sprint = await _get_sprint(sprint_id, db)
    if sprint.start_date is None:
        return []
    
    start_date = sprint.start_date
    end_date = min(date.today(), sprint.end_date) if sprint.end_date else date.today()
    days = (end_date - start_date).days 
    days = max(days, 0)
    dates = [start_date + timedelta(days=i) for i in range(days + 1)]

    snapshots = await _get_snapshots(sprint_id, db)

    if snapshots:
        total_points = snapshots[0].points_completed + snapshots[0].points_remaining
    else:
        total_points = sum(s.points or 0 for s in sprint.stories)
    
    denominator = (dates[-1] - dates[0]).days or 1
    ideal_line: dict[date, int] = {}

    for i, d in enumerate(dates):
        fraction = i / denominator if denominator > 0 else 1.0
        ideal_line[d] = int(round(total_points * (1 - fraction)))

    actual_map: dict[date, int] = {s.snapshot_date: s.points_remaining for s in snapshots}

    today = date.today()
    if today in dates and today not in actual_map:
        column_ids = {s.column_id for s in sprint.stories if s.column_id}
        columns_by_id = {}
        if column_ids:
            r = await db.execute(select(Column).where(Column.id.in_(column_ids)))
            columns_by_id = {c.id: c for c in r.scalars().all()}
        live_remaining = 0
        for s in sprint.stories:
            if s.column_id and columns_by_id[s.column_id].is_done_column:
                continue
            live_remaining += s.points or 0
        actual_map[today] = live_remaining

    out: list[dict[str, int | date | None]] = []
    for d in sorted(dates):
        out.append({
            "date": d,
            "ideal_remaining": ideal_line.get(d, 0),
            "actual_remaining": actual_map.get(d, None)
        })
    return out
        

async def get_velocity(board_id: str, db: AsyncSession, last_n: int = 5) -> list[dict[str, str |int]]:
    """
    Return velocity data for the last N completed sprints on a board.

    Returns a list of dicts: [{ sprint_name, committed_points, completed_points }, ...]

    Steps:
    1. Fetch the board; raise 404 if not found.
    2. Query completed sprints for this board, ordered by end_date DESC, limit last_n.
    3. For each sprint:
       - committed_points: use the earliest SprintSnapshot row for the sprint
         (points_remaining + points_completed = total committed at sprint start).
         If no snapshot exists, fall back to summing current story points.
       - completed_points: sum of points for stories in the sprint whose column_id
         is a done column (is_done_column=True).
    4. Return list ordered from oldest to newest (for chart left-to-right display).

    Raises:
        HTTPException 404: board not found
    """
    await _get_board(board_id, db) # TODO: This feels weird

    sprints = await _get_completed_sprints_with_stories_and_snapshots(board_id, last_n, db)
    
    out: list[dict[str, int | str]] = [] # [{ sprint_name, committed_points, completed_points }, ...]

    for sprint in sprints:
        out.append(
            {
                "sprint_name": sprint.name,
                "committed_points": (sprint.snapshots[0].points_remaining + sprint.snapshots[0].points_completed) if sprint.snapshots else sum(s.points or 0 for s in sprint.stories),
                "completed_points": sum(s.points or 0 for s in sprint.stories if s.column and s.column.is_done_column)
            }
        )

    return list(reversed(out))

