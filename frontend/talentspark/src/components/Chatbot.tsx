import { useState } from "react";
import { sendChatRequest } from "../Services/Chatserice";

type Message = {
    id: number;
    sender: "user" | "bot";
    text: string;
};

function Chatbot() {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, sender: "bot", text: "Hello! I can help with jobs and companies." },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        const trimmed = input.trim();
        if (!trimmed) return;

        const userMessage: Message = { id: Date.now(), sender: "user", text: trimmed };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const response = await sendChatRequest({ user_query: trimmed });
            const botMessage: Message = {
                id: Date.now() + 1,
                sender: "bot",
                text: response.answer || "Sorry, I could not answer that.",
            };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Chat request failed:", error);
            const errorMessage: Message = {
                id: Date.now() + 2,
                sender: "bot",
                text: "The chatbot is unavailable right now.",
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chatbot">
            <h2 className="chatbot-title">AI Assistant</h2>
            <p className="chatbot-subtitle">Ask about jobs, companies, or hiring.</p>

            <div className="chatbot-window">
                {messages.map((message) => (
                    <div key={message.id} className={`chatbot-row ${message.sender}`}>
                        <div className={`chatbot-bubble ${message.sender}`}>{message.text}</div>
                    </div>
                ))}
                {loading ? <div className="chatbot-thinking">Thinking...</div> : null}
            </div>

            <div className="chatbot-input-row">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") void handleSend();
                    }}
                    placeholder="Type your message..."
                />
                <button className="chatbot-send" onClick={() => void handleSend()}>
                    Send
                </button>
            </div>
        </div>
    );
}

export default Chatbot;