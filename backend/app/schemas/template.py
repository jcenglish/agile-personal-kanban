from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict

EnergyType = Literal["physical", "cognitive", "emotional"]


class TemplateCreate(BaseModel):
    title: str
    points: Optional[int] = None
    is_urgent: Optional[bool] = None
    is_important: Optional[bool] = None
    energy_type: Optional[EnergyType] = None
    epic_id: Optional[str] = None


class TemplateUpdate(BaseModel):
    title: Optional[str] = None
    points: Optional[int] = None
    is_urgent: Optional[bool] = None
    is_important: Optional[bool] = None
    energy_type: Optional[EnergyType] = None
    epic_id: Optional[str] = None


class TemplateResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    board_id: str
    title: str
    points: Optional[int]
    is_urgent: Optional[bool]
    is_important: Optional[bool]
    energy_type: Optional[str]
    epic_id: Optional[str]
    created_at: datetime
