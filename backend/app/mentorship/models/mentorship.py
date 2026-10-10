from datetime import datetime, timezone
from typing import Literal

from pydantic import BaseModel, Field, ConfigDict

class MentorshipRequestModel(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True
    )

    id: str | None = None
    student_id: str
    alumni_id: str
    status: Literal["pending", "accepted", "rejected"] = "pending"
    
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
