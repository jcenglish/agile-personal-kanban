import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.board import Board
from app.models.column import Column
from app.models.story import Story
from app.schemas.column import ColumnCreate, ColumnReorder, ColumnResponse, ColumnUpdate

router = APIRouter(tags=["columns"])


async def _get_column(column_id: str, db: AsyncSession) -> Column:
    result = await db.execute(select(Column).where(Column.id == column_id))
    col = result.scalar_one_or_none()
    if not col:
        raise HTTPException(status_code=404, detail=f"Column {column_id} not found")
    return col


@router.get("/boards/{board_id}/columns", response_model=list[ColumnResponse])
async def list_columns(board_id: str, db: AsyncSession = Depends(get_db)):
    board = await db.get(Board, board_id)
    if not board:
        raise HTTPException(status_code=404, detail=f"Board {board_id} not found")
    result = await db.execute(
        select(Column).where(Column.board_id == board_id).order_by(Column.position)
    )
    return result.scalars().all()


@router.post("/boards/{board_id}/columns", response_model=ColumnResponse, status_code=201)
async def create_column(board_id: str, payload: ColumnCreate, db: AsyncSession = Depends(get_db)):
    board = await db.get(Board, board_id)
    if not board:
        raise HTTPException(status_code=404, detail=f"Board {board_id} not found")
    col = Column(
        id=str(uuid.uuid4()),
        board_id=board_id,
        name=payload.name,
        position=payload.position,
        is_done_column=payload.is_done_column,
    )
    db.add(col)
    await db.commit()
    await db.refresh(col)
    return col


@router.put("/columns/{column_id}", response_model=ColumnResponse)
async def update_column(column_id: str, payload: ColumnUpdate, db: AsyncSession = Depends(get_db)):
    col = await _get_column(column_id, db)
    if payload.name is not None:
        col.name = payload.name
    if payload.is_done_column is not None:
        col.is_done_column = payload.is_done_column
    await db.commit()
    await db.refresh(col)
    return col


@router.patch("/boards/{board_id}/columns/reorder", response_model=list[ColumnResponse])
async def reorder_columns(board_id: str, payload: ColumnReorder, db: AsyncSession = Depends(get_db)):
    board = await db.get(Board, board_id)
    if not board:
        raise HTTPException(status_code=404, detail=f"Board {board_id} not found")
    for item in payload.columns:
        col = await _get_column(item.id, db)
        col.position = item.position
    await db.commit()
    result = await db.execute(
        select(Column).where(Column.board_id == board_id).order_by(Column.position)
    )
    return result.scalars().all()


@router.delete("/columns/{column_id}", status_code=204)
async def delete_column(column_id: str, db: AsyncSession = Depends(get_db)):
    col = await _get_column(column_id, db)
    stories = await db.execute(select(Story).where(Story.column_id == column_id).limit(1))
    if stories.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Cannot delete column with existing stories")
    await db.delete(col)
    await db.commit()
