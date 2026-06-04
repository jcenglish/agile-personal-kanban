from datetime import date

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from sqlalchemy.orm import selectinload

from app.models.sprint import Sprint
from app.models.board import Board
from app.models.column import Column

# TODO: Centralize this somewhere? It's reused.
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
    if not sprint:
        raise HTTPException(status_code=404, detail=f"Sprint {sprint_id} not found")
    return sprint

async def _get_board_with_sprints(board_id: str, db: AsyncSession) -> Board:
    result = await db.execute(
        select(Board)
        .options(selectinload(Board.sprints))
        .where(Board.id == board_id)
        )
    board = result.scalar_one_or_none()
    if not board:
        raise HTTPException(status_code=404, detail=f"Board {board_id} not found")
    return board


async def start_sprint(sprint_id: str, db: AsyncSession) -> None:
    """
    Transition a sprint from 'planning' to 'active'.

    Steps:
    1. Fetch the sprint by sprint_id; raise HTTP 404 if not found.
    2. Check that no other sprint on the same board already has status='active';
       raise HTTP 409 if one exists (only one active sprint per board is allowed).
    3. Set sprint.status = 'active' and sprint.start_date = today (date.today())
       if start_date is not already set.
    4. Commit and return.

    Raises:
        HTTPException 404: sprint not found
        HTTPException 409: another sprint on this board is already active
    """
    sprint = await _get_sprint(sprint_id, db)
    if sprint.status != "planning":
        raise HTTPException(status_code=409, detail="Only planning sprints can be started")
    
    board = await _get_board_with_sprints(sprint.board_id, db)
    for s in board.sprints:
        if (s.id != sprint.id) and (s.status == "active"):
            raise HTTPException(status_code=409, detail=f"Only one active sprint per board is allowed")
    
    sprint.status = 'active'
    if sprint.start_date is None:
        sprint.start_date = date.today()
    
    await db.commit()
    await db.refresh(sprint)

# TODO: Option to carry over stories to next sprint
async def complete_sprint(sprint_id: str, db: AsyncSession) -> None:
    """
    Transition an active sprint to 'completed' and clean up unfinished stories.

    Steps:
    1. Fetch the sprint by sprint_id; raise HTTP 404 if not found.
    2. Raise HTTP 409 if sprint.status != 'active'.
    3. Set sprint.status = 'completed'.
    4. For every story in this sprint whose column_id points to a column where
       is_done_column=False (or column_id is NULL), reset: # TODO: this feels like a code smell...
         story.sprint_id = None
         story.column_id = None
         story.position  = None
       Leave stories in done columns in place (they keep their sprint_id, column_id,
       position, and completed_at).
    5. Commit and return.

    Raises:
        HTTPException 404: sprint not found
        HTTPException 409: sprint is not currently active
    """
    sprint = await _get_sprint_with_stories(sprint_id, db)

    if sprint.status != "active":
        raise HTTPException(status_code=409, detail="Only active sprints can be completed")
    
    sprint.status = "completed"

    column_ids = {s.column_id for s in sprint.stories if s.column_id}
    columns_by_id = {}
    if column_ids:
        result = await db.execute(select(Column).where(Column.id.in_(column_ids)))
        columns_by_id = {c.id: c for c in result.scalars().all()}

    for story in sprint.stories:
        col = columns_by_id.get(story.column_id) if story.column_id else None
        if col is None or col.is_done_column is False:
            story.sprint_id = None
            story.column_id = None
            story.position = None
    
    await db.commit()
    await db.refresh(sprint)
