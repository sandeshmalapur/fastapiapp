import axios from "axios";
import type { ChatRequest, ChatResponse } from "../types/chat";

const API_BASE_URL = "http://localhost:8000";

export async function sendChatRequest(request: ChatRequest): Promise<ChatResponse> {
    const response = await axios.post(`${API_BASE_URL}/chat/message`, request);
    return response.data;
}

