import uuid
from datetime import date, datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import Date, DateTime, ForeignKey, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.board import Board
    from app.models.story import Story
    from app.models.sprint_snapshot import SprintSnapshot


class Sprint(Base):
    __tablename__ = "sprints"

    id: Mapped[str] = mapped_column(Text, primary_key=True, default=lambda: str(uuid.uuid4()))
    board_id: Mapped[str] = mapped_column(Text, ForeignKey("boards.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(Text, nullable=False)
    goal: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(Text, default="planning", nullable=False)
    start_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    end_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), nullable=False)

    board: Mapped["Board"] = relationship("Board", back_populates="sprints")
    stories: Mapped[list["Story"]] = relationship("Story", back_populates="sprint")
    snapshots: Mapped[list["SprintSnapshot"]] = relationship(
        "SprintSnapshot", back_populates="sprint", cascade="all, delete-orphan"
    )
