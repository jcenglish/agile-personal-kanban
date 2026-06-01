import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.board import Board
from app.models.story import Story
from app.schemas.story import StoryCreate, StoryMoveRequest, StoryResponse, StoryUpdate

router = APIRouter(tags=["stories"])


async def _get_story(story_id: str, db: AsyncSession) -> Story:
    result = await db.execute(select(Story).where(Story.id == story_id))
    story = result.scalar_one_or_none()
    if not story:
        raise HTTPException(status_code=404, detail=f"Story {story_id} not found")
    return story


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
    raise NotImplementedError("User implements")


@router.delete("/stories/{story_id}", status_code=204)
async def delete_story(story_id: str, db: AsyncSession = Depends(get_db)):
    story = await _get_story(story_id, db)
    await db.delete(story)
    await db.commit()
