import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.board import Board
from app.models.sprint import Sprint
from app.schemas.sprint import SprintCreate, SprintResponse, SprintUpdate
from app.schemas.story import StoryResponse
from app.services import sprint_service

router = APIRouter(tags=["sprints"])


async def _get_sprint(sprint_id: str, db: AsyncSession) -> Sprint:
    result = await db.execute(select(Sprint).where(Sprint.id == sprint_id))
    sprint = result.scalar_one_or_none()
    if not sprint:
        raise HTTPException(status_code=404, detail=f"Sprint {sprint_id} not found")
    return sprint


@router.get("/boards/{board_id}/sprints", response_model=list[SprintResponse])
async def list_sprints(board_id: str, db: AsyncSession = Depends(get_db)):
    board = await db.get(Board, board_id)
    if not board:
        raise HTTPException(status_code=404, detail=f"Board {board_id} not found")
    result = await db.execute(select(Sprint).where(Sprint.board_id == board_id))
    return result.scalars().all()


@router.post("/boards/{board_id}/sprints", response_model=SprintResponse, status_code=201)
async def create_sprint(board_id: str, payload: SprintCreate, db: AsyncSession = Depends(get_db)):
    board = await db.get(Board, board_id)
    if not board:
        raise HTTPException(status_code=404, detail=f"Board {board_id} not found")
    sprint = Sprint(
        id=str(uuid.uuid4()),
        board_id=board_id,
        name=payload.name,
        goal=payload.goal,
        start_date=payload.start_date,
        end_date=payload.end_date,
        status="planning",
    )
    db.add(sprint)
    await db.commit()
    await db.refresh(sprint)
    return sprint


class SprintDetail(SprintResponse):
    stories: list[StoryResponse] = []


@router.get("/sprints/{sprint_id}", response_model=SprintDetail)
async def get_sprint(sprint_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Sprint).options(selectinload(Sprint.stories)).where(Sprint.id == sprint_id)
    )
    sprint = result.scalar_one_or_none()
    if not sprint:
        raise HTTPException(status_code=404, detail=f"Sprint {sprint_id} not found")
    return sprint


@router.put("/sprints/{sprint_id}", response_model=SprintResponse)
async def update_sprint(sprint_id: str, payload: SprintUpdate, db: AsyncSession = Depends(get_db)):
    sprint = await _get_sprint(sprint_id, db)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(sprint, field, value)
    await db.commit()
    await db.refresh(sprint)
    return sprint


@router.post("/sprints/{sprint_id}/start", response_model=SprintResponse)
async def start_sprint(sprint_id: str, db: AsyncSession = Depends(get_db)):
    await sprint_service.start_sprint(sprint_id, db)
    return await _get_sprint(sprint_id, db)


@router.post("/sprints/{sprint_id}/complete", response_model=SprintResponse)
async def complete_sprint(sprint_id: str, db: AsyncSession = Depends(get_db)):
    await sprint_service.complete_sprint(sprint_id, db)
    return await _get_sprint(sprint_id, db)


@router.delete("/sprints/{sprint_id}", status_code=204)
async def delete_sprint(sprint_id: str, db: AsyncSession = Depends(get_db)):
    sprint = await _get_sprint(sprint_id, db)
    if sprint.status != "planning":
        raise HTTPException(status_code=409, detail="Only planning sprints can be deleted")
    await db.delete(sprint)
    await db.commit()
