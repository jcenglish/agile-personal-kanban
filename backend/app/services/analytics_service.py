from sqlalchemy.ext.asyncio import AsyncSession


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
    raise NotImplementedError("User implements")


async def get_burndown(sprint_id: str, db: AsyncSession) -> list[dict]:
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
    raise NotImplementedError("User implements")


async def get_velocity(board_id: str, db: AsyncSession, last_n: int = 5) -> list[dict]:
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
    raise NotImplementedError("User implements")
