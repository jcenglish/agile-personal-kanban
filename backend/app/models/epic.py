import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import DateTime, ForeignKey, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.board import Board
    from app.models.story import Story
    from app.models.template import Template


class Epic(Base):
    __tablename__ = "epics"

    id: Mapped[str] = mapped_column(Text, primary_key=True, default=lambda: str(uuid.uuid4()))
    board_id: Mapped[str] = mapped_column(Text, ForeignKey("boards.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(Text, nullable=False)
    color: Mapped[str] = mapped_column(Text, default="#6366f1", nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), nullable=False)

    board: Mapped["Board"] = relationship("Board", back_populates="epics")
    stories: Mapped[list["Story"]] = relationship("Story", back_populates="epic")
    templates: Mapped[list["Template"]] = relationship("Template", back_populates="epic")
