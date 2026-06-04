from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.services import analytics_service
from app.schemas.analytics import BurndownResponse, VelocityResponse

router = APIRouter(tags=["analytics"])


@router.post("/sprints/{sprint_id}/snapshot", status_code=201)
async def take_snapshot(sprint_id: str, db: AsyncSession = Depends(get_db)):
    """
    Record a burndown snapshot for today for the given sprint.
    Delegates to analytics_service.take_snapshot — user implements.
    """
    await analytics_service.take_snapshot(sprint_id, db)


@router.get("/sprints/{sprint_id}/burndown", response_model=list[BurndownResponse])
async def get_burndown(sprint_id: str, db: AsyncSession = Depends(get_db)):
    """
    Return daily burndown data for the sprint.
    Delegates to analytics_service.get_burndown — user implements.
    """
    return await analytics_service.get_burndown(sprint_id, db)


@router.get("/boards/{board_id}/velocity", response_model=list[VelocityResponse])
async def get_velocity(board_id: str, last_n: int = 5, db: AsyncSession = Depends(get_db)):
    """
    Return velocity data for the last N completed sprints on this board.
    Delegates to analytics_service.get_velocity — user implements.
    """
    return await analytics_service.get_velocity(board_id, db, last_n)
