import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models.board import Board
from app.models.column import Column
from app.schemas.board import BoardCreate, BoardResponse, BoardUpdate

router = APIRouter(tags=["boards"])

DEFAULT_COLUMNS = [
    {"name": "To Do", "position": 0, "is_done_column": False},
    {"name": "In Progress", "position": 1, "is_done_column": False},
    {"name": "Review", "position": 2, "is_done_column": False},
    {"name": "Done", "position": 3, "is_done_column": True},
]


async def _get_board_with_columns(board_id: str, db: AsyncSession) -> Board:
    result = await db.execute(
        select(Board)
        .options(selectinload(Board.columns))
        .where(Board.id == board_id)
    )
    board = result.scalar_one_or_none()
    if not board:
        raise HTTPException(status_code=404, detail=f"Board {board_id} not found")
    return board


@router.get("/boards", response_model=list[BoardResponse])
async def list_boards(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Board).options(selectinload(Board.columns))
    )
    return result.scalars().all()


@router.post("/boards", response_model=BoardResponse, status_code=201)
async def create_board(payload: BoardCreate, db: AsyncSession = Depends(get_db)):
    board = Board(id=str(uuid.uuid4()), name=payload.name, description=payload.description)
    db.add(board)
    await db.flush()

    for col in DEFAULT_COLUMNS:
        db.add(Column(
            id=str(uuid.uuid4()),
            board_id=board.id,
            name=col["name"],
            position=col["position"],
            is_done_column=col["is_done_column"],
        ))

    await db.commit()
    await db.refresh(board)
    return await _get_board_with_columns(board.id, db)


@router.get("/boards/{board_id}", response_model=BoardResponse)
async def get_board(board_id: str, db: AsyncSession = Depends(get_db)):
    return await _get_board_with_columns(board_id, db)


@router.put("/boards/{board_id}", response_model=BoardResponse)
async def update_board(board_id: str, payload: BoardUpdate, db: AsyncSession = Depends(get_db)):
    board = await _get_board_with_columns(board_id, db)
    if payload.name is not None:
        board.name = payload.name
    if payload.description is not None:
        board.description = payload.description
    await db.commit()
    await db.refresh(board)
    return await _get_board_with_columns(board.id, db)


@router.delete("/boards/{board_id}", status_code=204)
async def delete_board(board_id: str, db: AsyncSession = Depends(get_db)):
    board = await _get_board_with_columns(board_id, db)
    await db.delete(board)
    await db.commit()
