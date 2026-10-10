from pydantic import BaseModel, Field
from datetime import datetime
from typing import Literal

class MentorshipRequestCreate(BaseModel):
    alumni_id: str

class MentorshipStatusUpdate(BaseModel):
    status: Literal["accepted", "rejected"]

class OptInUpdate(BaseModel):
    is_mentor: bool

class MentorshipResponse(BaseModel):
    id: str
    student_id: str
    alumni_id: str
    student_name: str | None = None
    alumni_name: str | None = None
    status: Literal["pending", "accepted", "rejected"]
    created_at: datetime
    updated_at: datetime

class MentorProfile(BaseModel):
    id: str
    name: str | None = None
    email: str
    avatar_url: str | None = None
    bio: str | None = None
    current_company: str | None = None
    current_position: str | None = None
    department: str | None = None
