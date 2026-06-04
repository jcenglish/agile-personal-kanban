from datetime import date
from typing import Optional

from pydantic import BaseModel, ConfigDict

class BurndownResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    date: date
    ideal_remaining: int
    actual_remaining: Optional[int]

class VelocityResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    sprint_name: str
    committed_points: int
    completed_points: int