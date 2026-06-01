import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.board import Board
from app.models.epic import Epic
from app.models.story import Story
from app.models.template import Template
from app.schemas.epic import EpicCreate, EpicResponse, EpicUpdate

router = APIRouter(tags=["epics"])


@router.get("/boards/{board_id}/epics", response_model=list[EpicResponse])
async def list_epics(board_id: str, db: AsyncSession = Depends(get_db)):
    board = await db.get(Board, board_id)
    if not board:
        raise HTTPException(status_code=404, detail=f"Board {board_id} not found")
    result = await db.execute(select(Epic).where(Epic.board_id == board_id))
    return result.scalars().all()


@router.post("/boards/{board_id}/epics", response_model=EpicResponse, status_code=201)
async def create_epic(board_id: str, payload: EpicCreate, db: AsyncSession = Depends(get_db)):
    board = await db.get(Board, board_id)
    if not board:
        raise HTTPException(status_code=404, detail=f"Board {board_id} not found")
    epic = Epic(
        id=str(uuid.uuid4()),
        board_id=board_id,
        name=payload.name,
        color=payload.color,
        description=payload.description,
    )
    db.add(epic)
    await db.commit()
    await db.refresh(epic)
    return epic


@router.put("/epics/{epic_id}", response_model=EpicResponse)
async def update_epic(epic_id: str, payload: EpicUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Epic).where(Epic.id == epic_id))
    epic = result.scalar_one_or_none()
    if not epic:
        raise HTTPException(status_code=404, detail=f"Epic {epic_id} not found")
    if payload.name is not None:
        epic.name = payload.name
    if payload.color is not None:
        epic.color = payload.color
    if payload.description is not None:
        epic.description = payload.description
    await db.commit()
    await db.refresh(epic)
    return epic


@router.delete("/epics/{epic_id}", status_code=204)
async def delete_epic(epic_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Epic).where(Epic.id == epic_id))
    epic = result.scalar_one_or_none()
    if not epic:
        raise HTTPException(status_code=404, detail=f"Epic {epic_id} not found")
    await db.execute(update(Story).where(Story.epic_id == epic_id).values(epic_id=None))
    await db.execute(update(Template).where(Template.epic_id == epic_id).values(epic_id=None))
    await db.delete(epic)
    await db.commit()
