import uuid
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, ForeignKey, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.board import Board
    from app.models.story import Story


class Column(Base):
    __tablename__ = "columns"

    id: Mapped[str] = mapped_column(Text, primary_key=True, default=lambda: str(uuid.uuid4()))
    board_id: Mapped[str] = mapped_column(Text, ForeignKey("boards.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(Text, nullable=False)
    position: Mapped[int] = mapped_column(Integer, nullable=False)
    is_done_column: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    board: Mapped["Board"] = relationship("Board", back_populates="columns")
    stories: Mapped[list["Story"]] = relationship("Story", back_populates="column")
