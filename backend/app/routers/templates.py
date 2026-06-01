import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.board import Board
from app.models.template import Template
from app.schemas.template import TemplateCreate, TemplateResponse, TemplateUpdate

router = APIRouter(tags=["templates"])


async def _get_template(template_id: str, db: AsyncSession) -> Template:
    result = await db.execute(select(Template).where(Template.id == template_id))
    tmpl = result.scalar_one_or_none()
    if not tmpl:
        raise HTTPException(status_code=404, detail=f"Template {template_id} not found")
    return tmpl


@router.get("/boards/{board_id}/templates", response_model=list[TemplateResponse])
async def list_templates(board_id: str, db: AsyncSession = Depends(get_db)):
    board = await db.get(Board, board_id)
    if not board:
        raise HTTPException(status_code=404, detail=f"Board {board_id} not found")
    result = await db.execute(select(Template).where(Template.board_id == board_id))
    return result.scalars().all()


@router.post("/boards/{board_id}/templates", response_model=TemplateResponse, status_code=201)
async def create_template(board_id: str, payload: TemplateCreate, db: AsyncSession = Depends(get_db)):
    board = await db.get(Board, board_id)
    if not board:
        raise HTTPException(status_code=404, detail=f"Board {board_id} not found")
    tmpl = Template(
        id=str(uuid.uuid4()),
        board_id=board_id,
        title=payload.title,
        points=payload.points,
        is_urgent=payload.is_urgent,
        is_important=payload.is_important,
        energy_type=payload.energy_type,
        epic_id=payload.epic_id,
    )
    db.add(tmpl)
    await db.commit()
    await db.refresh(tmpl)
    return tmpl


@router.put("/templates/{template_id}", response_model=TemplateResponse)
async def update_template(template_id: str, payload: TemplateUpdate, db: AsyncSession = Depends(get_db)):
    tmpl = await _get_template(template_id, db)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(tmpl, field, value)
    await db.commit()
    await db.refresh(tmpl)
    return tmpl


@router.delete("/templates/{template_id}", status_code=204)
async def delete_template(template_id: str, db: AsyncSession = Depends(get_db)):
    tmpl = await _get_template(template_id, db)
    await db.delete(tmpl)
    await db.commit()


@router.post("/templates/{template_id}/instantiate")
async def instantiate_template(template_id: str, db: AsyncSession = Depends(get_db)):
    """
    Create a new Story in the backlog from this template.

    Steps:
    1. Fetch the template by template_id; raise 404 if not found.
    2. Create a new Story with:
         board_id    = template.board_id
         title       = template.title
         points      = template.points
         is_urgent   = template.is_urgent
         is_important = template.is_important
         energy_type = template.energy_type
         epic_id     = template.epic_id
         sprint_id   = None  (backlog)
         column_id   = None
         position    = None
    3. Insert and commit the new story.
    4. Return the new StoryResponse.

    Raises:
        HTTPException 404: template not found
    """
    raise NotImplementedError("User implements")
