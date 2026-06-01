import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import DateTime, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.column import Column
    from app.models.epic import Epic
    from app.models.sprint import Sprint
    from app.models.story import Story
    from app.models.template import Template


class Board(Base):
    __tablename__ = "boards"

    id: Mapped[str] = mapped_column(Text, primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), nullable=False)

    columns: Mapped[list["Column"]] = relationship(
        "Column", back_populates="board", cascade="all, delete-orphan"
    )
    epics: Mapped[list["Epic"]] = relationship(
        "Epic", back_populates="board", cascade="all, delete-orphan"
    )
    sprints: Mapped[list["Sprint"]] = relationship(
        "Sprint", back_populates="board", cascade="all, delete-orphan"
    )
    stories: Mapped[list["Story"]] = relationship(
        "Story", back_populates="board", cascade="all, delete-orphan"
    )
    templates: Mapped[list["Template"]] = relationship(
        "Template", back_populates="board", cascade="all, delete-orphan"
    )
