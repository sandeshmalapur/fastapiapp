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
        <div style={{ maxWidth: "720px", margin: "2rem auto", padding: "1rem", border: "1px solid #e5e7eb", borderRadius: "12px", background: "#fff" }}>
            <h2 style={{ marginBottom: "0.5rem" }}>AI Assistant</h2>
            <p style={{ marginTop: 0, color: "#6b7280" }}>Ask about jobs, companies, or hiring.</p>

            <div style={{ minHeight: "220px", maxHeight: "320px", overflowY: "auto", padding: "0.75rem", border: "1px solid #f3f4f6", borderRadius: "10px", background: "#fafafa" }}>
                {messages.map((message) => (
                    <div key={message.id} style={{ marginBottom: "0.7rem", display: "flex", justifyContent: message.sender === "user" ? "flex-end" : "flex-start" }}>
                        <div style={{ maxWidth: "80%", padding: "0.7rem 0.9rem", borderRadius: "12px", background: message.sender === "user" ? "#2563eb" : "#e5e7eb", color: message.sender === "user" ? "#fff" : "#111827" }}>
                            {message.text}
                        </div>
                    </div>
                ))}
                {loading ? <div style={{ color: "#6b7280" }}>Thinking...</div> : null}
            </div>

            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            void handleSend();
                        }
                    }}
                    placeholder="Type your message..."
                    style={{ flex: 1, padding: "0.7rem", borderRadius: "8px", border: "1px solid #d1d5db" }}
                />
                <button onClick={() => void handleSend()} style={{ padding: "0.7rem 1rem", borderRadius: "8px", border: "none", background: "#2563eb", color: "#fff", cursor: "pointer" }}>
                    Send
                </button>
            </div>
        </div>
    );
}

export default Chatbot;
