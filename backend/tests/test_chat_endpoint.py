from fastapi.testclient import TestClient

from app.main import app


def test_chat_endpoint_returns_error_when_groq_key_missing(monkeypatch):
    monkeypatch.delenv("GROQ_API_KEY", raising=False)
    monkeypatch.delenv("GROQ_MODEL", raising=False)

    client = TestClient(app)
    response = client.post(
        "/chat/message",
        json={"user_query": "Hello", "session_id": "test-session"},
    )

    assert response.status_code == 500
    assert "GROQ_API_KEY" in response.json()["detail"]
