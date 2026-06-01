import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.board import Board
    from app.models.column import Column
    from app.models.epic import Epic
    from app.models.sprint import Sprint


class Story(Base):
    __tablename__ = "stories"

    id: Mapped[str] = mapped_column(Text, primary_key=True, default=lambda: str(uuid.uuid4()))
    board_id: Mapped[str] = mapped_column(Text, ForeignKey("boards.id", ondelete="CASCADE"), nullable=False)
    sprint_id: Mapped[Optional[str]] = mapped_column(Text, ForeignKey("sprints.id", ondelete="SET NULL"), nullable=True)
    epic_id: Mapped[Optional[str]] = mapped_column(Text, ForeignKey("epics.id", ondelete="SET NULL"), nullable=True)
    column_id: Mapped[Optional[str]] = mapped_column(Text, ForeignKey("columns.id", ondelete="SET NULL"), nullable=True)
    title: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    points: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    position: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    is_urgent: Mapped[Optional[bool]] = mapped_column(Boolean, nullable=True)
    is_important: Mapped[Optional[bool]] = mapped_column(Boolean, nullable=True)
    energy_type: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), nullable=False)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    board: Mapped["Board"] = relationship("Board", back_populates="stories")
    sprint: Mapped[Optional["Sprint"]] = relationship("Sprint", back_populates="stories")
    epic: Mapped[Optional["Epic"]] = relationship("Epic", back_populates="stories")
    column: Mapped[Optional["Column"]] = relationship("Column", back_populates="stories")
