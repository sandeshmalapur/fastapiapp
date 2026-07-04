from typing import Optional

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    user_query: str = Field(..., min_length=1)
    session_id: Optional[str] = Field(default="default")


class ChatResponse(BaseModel):
    answer: str
    session_id: str