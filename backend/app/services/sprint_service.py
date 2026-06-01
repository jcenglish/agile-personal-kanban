from sqlalchemy.ext.asyncio import AsyncSession


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
    raise NotImplementedError("User implements")


async def complete_sprint(sprint_id: str, db: AsyncSession) -> None:
    """
    Transition an active sprint to 'completed' and clean up unfinished stories.

    Steps:
    1. Fetch the sprint by sprint_id; raise HTTP 404 if not found.
    2. Raise HTTP 409 if sprint.status != 'active'.
    3. Set sprint.status = 'completed'.
    4. For every story in this sprint whose column_id points to a column where
       is_done_column=False (or column_id is NULL), reset:
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
    raise NotImplementedError("User implements")
