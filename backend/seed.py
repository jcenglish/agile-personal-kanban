"""
Seed script — run once to populate the database with initial data.

Usage:
    cd backend && source venv/bin/activate && python seed.py
"""
import asyncio
import uuid

from sqlalchemy import select

from app.database import AsyncSessionLocal
from app.models.board import Board
from app.models.column import Column
from app.models.sprint import Sprint
from app.models.template import Template


async def seed() -> None:
    async with AsyncSessionLocal() as db:
        existing = await db.execute(select(Board).where(Board.name == "Personal"))
        if existing.scalar_one_or_none():
            print("Seed data already exists — skipping.")
            return

        board_id = str(uuid.uuid4())
        board = Board(id=board_id, name="Personal", description="My personal Kanban board")
        db.add(board)

        columns = [
            Column(id=str(uuid.uuid4()), board_id=board_id, name="To Do", position=0, is_done_column=False),
            Column(id=str(uuid.uuid4()), board_id=board_id, name="In Progress", position=1, is_done_column=False),
            Column(id=str(uuid.uuid4()), board_id=board_id, name="Review", position=2, is_done_column=False),
            Column(id=str(uuid.uuid4()), board_id=board_id, name="Done", position=3, is_done_column=True),
        ]
        for col in columns:
            db.add(col)

        sprint = Sprint(
            id=str(uuid.uuid4()),
            board_id=board_id,
            name="Sprint 1",
            status="planning",
        )
        db.add(sprint)

        templates = [
            Template(id=str(uuid.uuid4()), board_id=board_id, title="Exercise", energy_type="physical"),
            Template(id=str(uuid.uuid4()), board_id=board_id, title="Grocery shopping", energy_type="physical"),
            Template(id=str(uuid.uuid4()), board_id=board_id, title="Laundry", energy_type="physical"),
        ]
        for tmpl in templates:
            db.add(tmpl)

        await db.commit()
        print("Seed data inserted successfully.")


if __name__ == "__main__":
    asyncio.run(seed())
