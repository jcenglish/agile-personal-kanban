from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db

router = APIRouter(tags=["analytics"])


@router.post("/sprints/{sprint_id}/snapshot", status_code=201)
async def take_snapshot(sprint_id: str, db: AsyncSession = Depends(get_db)):
    """
    Record a burndown snapshot for today for the given sprint.
    Delegates to analytics_service.take_snapshot — user implements.
    """
    raise NotImplementedError("User implements")


@router.get("/sprints/{sprint_id}/burndown")
async def get_burndown(sprint_id: str, db: AsyncSession = Depends(get_db)):
    """
    Return daily burndown data for the sprint.
    Delegates to analytics_service.get_burndown — user implements.
    """
    raise NotImplementedError("User implements")


@router.get("/boards/{board_id}/velocity")
async def get_velocity(board_id: str, db: AsyncSession = Depends(get_db)):
    """
    Return velocity data for the last N completed sprints on this board.
    Delegates to analytics_service.get_velocity — user implements.
    """
    raise NotImplementedError("User implements")
