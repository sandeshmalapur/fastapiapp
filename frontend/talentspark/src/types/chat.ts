interface ChatRequest {
    user_query: string;
    session_id?: string;
}

interface ChatResponse {
    answer: string;
    session_id: string;
}export type { ChatRequest, ChatResponse };