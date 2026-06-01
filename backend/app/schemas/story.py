from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict

EnergyType = Literal["physical", "cognitive", "emotional"]


class StoryCreate(BaseModel):
    title: str
    description: Optional[str] = None
    points: Optional[int] = None
    epic_id: Optional[str] = None
    sprint_id: Optional[str] = None
    is_urgent: Optional[bool] = None
    is_important: Optional[bool] = None
    energy_type: Optional[EnergyType] = None


class StoryUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    points: Optional[int] = None
    epic_id: Optional[str] = None
    sprint_id: Optional[str] = None
    column_id: Optional[str] = None
    position: Optional[float] = None
    is_urgent: Optional[bool] = None
    is_important: Optional[bool] = None
    energy_type: Optional[EnergyType] = None


class StoryMoveRequest(BaseModel):
    column_id: str
    before_id: Optional[str] = None
    after_id: Optional[str] = None


class StoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    board_id: str
    sprint_id: Optional[str]
    epic_id: Optional[str]
    column_id: Optional[str]
    title: str
    description: Optional[str]
    points: Optional[int]
    position: Optional[float]
    is_urgent: Optional[bool]
    is_important: Optional[bool]
    energy_type: Optional[str]
    created_at: datetime
    completed_at: Optional[datetime]
