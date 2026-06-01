import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.board import Board
    from app.models.epic import Epic


class Template(Base):
    __tablename__ = "templates"

    id: Mapped[str] = mapped_column(Text, primary_key=True, default=lambda: str(uuid.uuid4()))
    board_id: Mapped[str] = mapped_column(Text, ForeignKey("boards.id", ondelete="CASCADE"), nullable=False)
    title: Mapped[str] = mapped_column(Text, nullable=False)
    points: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    is_urgent: Mapped[Optional[bool]] = mapped_column(Boolean, nullable=True)
    is_important: Mapped[Optional[bool]] = mapped_column(Boolean, nullable=True)
    energy_type: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    epic_id: Mapped[Optional[str]] = mapped_column(Text, ForeignKey("epics.id", ondelete="SET NULL"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), nullable=False)

    board: Mapped["Board"] = relationship("Board", back_populates="templates")
    epic: Mapped[Optional["Epic"]] = relationship("Epic", back_populates="templates")
