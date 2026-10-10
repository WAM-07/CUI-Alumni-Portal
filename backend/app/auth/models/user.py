from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field, ConfigDict


class User(BaseModel):
        
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True
    )
    id: str | None = None

    email: EmailStr

    hashed_password: str

    role: Literal["admin", "alumni", "industry", "student"]

    is_verified: bool = False

    is_mentor: bool = False

    saved_posts: list[str] = Field(default_factory=list)

    created_at: datetime = Field(default_factory=datetime.utcnow)

    updated_at: datetime = Field(default_factory=datetime.utcnow)