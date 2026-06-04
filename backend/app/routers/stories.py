from typing import Sequence
import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.board import Board
from app.models.story import Story
from app.models.column import Column
from app.schemas.story import StoryCreate, StoryMoveRequest, StoryResponse, StoryUpdate

router = APIRouter(tags=["stories"])


async def _get_story(story_id: str, db: AsyncSession) -> Story:
    result = await db.execute(select(Story).where(Story.id == story_id))
    story = result.scalar_one_or_none()
    if not story:
        raise HTTPException(status_code=404, detail=f"Story {story_id} not found")
    return story

async def _get_stories_by_column(column_id: str, db: AsyncSession) -> Sequence[Story]:
    result = await db.execute(
        select(Story)
        .where(Story.column_id == column_id)
        .order_by(Story.position)
    )
    stories = result.scalars().all()

    return stories

async def _get_column(column_id: str, db: AsyncSession) -> Column:
    result = await db.execute(select(Column).where(Column.id == column_id))
    column = result.scalar_one_or_none()
    if not column:
        raise HTTPException(status_code=404, detail=f"Column {column_id} not found")
    return column

async def _get_story_position(story: Story | None) -> float:
    if story is None:
        raise HTTPException(
            status_code=400,
            detail="Story reference is required to compute position"
        )
    if story.position is None:
        raise HTTPException(
            status_code=500,
            detail=f"Story {story.id} has no stored position"
        )
    return story.position


@router.get("/boards/{board_id}/stories", response_model=list[StoryResponse])
async def list_stories(board_id: str, db: AsyncSession = Depends(get_db)):
    board = await db.get(Board, board_id)
    if not board:
        raise HTTPException(status_code=404, detail=f"Board {board_id} not found")
    result = await db.execute(select(Story).where(Story.board_id == board_id))
    return result.scalars().all()


@router.get("/boards/{board_id}/backlog", response_model=list[StoryResponse])
async def list_backlog(board_id: str, db: AsyncSession = Depends(get_db)):
    board = await db.get(Board, board_id)
    if not board:
        raise HTTPException(status_code=404, detail=f"Board {board_id} not found")
    result = await db.execute(
        select(Story).where(Story.board_id == board_id, Story.sprint_id.is_(None))
    )
    return result.scalars().all()


@router.post("/boards/{board_id}/stories", response_model=StoryResponse, status_code=201)
async def create_story(board_id: str, payload: StoryCreate, db: AsyncSession = Depends(get_db)):
    board = await db.get(Board, board_id)
    if not board:
        raise HTTPException(status_code=404, detail=f"Board {board_id} not found")
    story = Story(
        id=str(uuid.uuid4()),
        board_id=board_id,
        title=payload.title,
        description=payload.description,
        points=payload.points,
        epic_id=payload.epic_id,
        sprint_id=payload.sprint_id,
        is_urgent=payload.is_urgent,
        is_important=payload.is_important,
        energy_type=payload.energy_type,
        column_id=None,
        position=None,
    )
    db.add(story)
    await db.commit()
    await db.refresh(story)
    return story


@router.get("/stories/{story_id}", response_model=StoryResponse)
async def get_story(story_id: str, db: AsyncSession = Depends(get_db)):
    return await _get_story(story_id, db)


@router.put("/stories/{story_id}", response_model=StoryResponse)
async def update_story(story_id: str, payload: StoryUpdate, db: AsyncSession = Depends(get_db)):
    story = await _get_story(story_id, db)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(story, field, value)
    await db.commit()
    await db.refresh(story)
    return story


@router.patch("/stories/{story_id}/move", response_model=StoryResponse)
async def move_story(story_id: str, payload: StoryMoveRequest, db: AsyncSession = Depends(get_db)):
    """
    Move a story to a column, inserting it between before_id and after_id neighbors.

    Position is computed as the midpoint float between the two neighbors:
      - Inserting at start (no before): position = first_story.position / 2
      - Inserting at end (no after): position = last_story.position + 1.0
      - Into empty column: position = 1.0
      - Between two stories: position = (before.position + after.position) / 2

    Also sets story.column_id = payload.column_id.
    If the column is a done column (is_done_column=True), set story.completed_at = now().
    If moved out of a done column, clear story.completed_at.

    Implementation note: fetch before/after stories by ID, read their .position values,
    then compute and assign the new position atomically.
    """
    story = await _get_story(story_id, db)
    column = await _get_column(payload.column_id, db)
    column_stories = await _get_stories_by_column(payload.column_id, db)
    before = await _get_story(payload.before_id, db) if payload.before_id else None
    after = await _get_story(payload.after_id, db) if payload.after_id else None
    position = 0.0

    if before and before.column_id != payload.column_id:
        raise HTTPException(status_code=400, detail="before_id must belong to the target column")
    
    if after and after.column_id != payload.column_id:
        raise HTTPException(status_code=400, detail="after_id must belong to the target column")
    
    if not column_stories:
        position = 1.0
    elif payload.before_id is None:
        first_position = await _get_story_position(column_stories[0])
        position = first_position / 2.0
    elif payload.after_id is None:
        last_position = await _get_story_position(column_stories[-1])
        position = last_position + 1.0
    else:
        before_position = await _get_story_position(before)
        after_position = await _get_story_position(after)
        position = (before_position + after_position) / 2.0
    
    story.position = position
    story.column_id = payload.column_id
    story.completed_at = datetime.now() if column.is_done_column else None
    
    await db.commit()
    await db.refresh(story)
    return story


@router.delete("/stories/{story_id}", status_code=204)
async def delete_story(story_id: str, db: AsyncSession = Depends(get_db)):
    story = await _get_story(story_id, db)
    await db.delete(story)
    await db.commit()
