from fastapi import APIRouter, HTTPException

from schemas.chat import ChatRequest, ChatResponse
from services.langchain_service import chat_service

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/message", response_model=ChatResponse)
def chat_message(payload: ChatRequest):
    try:
        answer = chat_service.invoke(payload.user_query, payload.session_id)
    except ValueError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except ImportError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    return ChatResponse(answer=answer, session_id=payload.session_id)
