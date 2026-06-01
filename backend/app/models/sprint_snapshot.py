import uuid
from datetime import date
from typing import TYPE_CHECKING

from sqlalchemy import Date, ForeignKey, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.sprint import Sprint


class SprintSnapshot(Base):
    __tablename__ = "sprint_snapshots"

    id: Mapped[str] = mapped_column(Text, primary_key=True, default=lambda: str(uuid.uuid4()))
    sprint_id: Mapped[str] = mapped_column(Text, ForeignKey("sprints.id", ondelete="CASCADE"), nullable=False)
    snapshot_date: Mapped[date] = mapped_column(Date, nullable=False)
    points_remaining: Mapped[int] = mapped_column(Integer, nullable=False)
    points_completed: Mapped[int] = mapped_column(Integer, nullable=False)

    sprint: Mapped["Sprint"] = relationship("Sprint", back_populates="snapshots")
