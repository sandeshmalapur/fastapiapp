import os
from typing import Dict

from dotenv import load_dotenv
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.prompts import ChatPromptTemplate

load_dotenv()

try:
    from langchain_groq import ChatGroq
except ImportError:  # pragma: no cover - handled at runtime
    ChatGroq = None

try:
    from langchain_core.runnables.history import RunnableWithMessageHistory
except ImportError:  # pragma: no cover - handled at runtime
    from langchain_core.runnables import RunnableWithMessageHistory


class LangChainChatService:
    def __init__(self) -> None:
        self.store: Dict[str, ChatMessageHistory] = {}
        self._llm = None
        self._chain_with_memory = None
        self._conversation_chain = None

    def _get_llm(self):
        if self._llm is None:
            api_key = os.getenv("GROQ_API_KEY")
            if not api_key:
                raise ValueError("GROQ_API_KEY is not set. Please add your Groq API key to the environment.")

            if ChatGroq is None:
                raise ImportError("langchain-groq is not installed. Install it with pip install langchain-groq")

            self._llm = ChatGroq(
                model=os.getenv("GROQ_MODEL", "llama-3.1-8b-instant"),
                groq_api_key=api_key,
                temperature=0.2,
            )
        return self._llm

    def _build_chain(self):
        if self._chain_with_memory is None:
            prompt = ChatPromptTemplate.from_messages(
                [
                    ("system", "You are a helpful assistant. Answer clearly and concisely."),
                    ("placeholder", "{chat_history}"),
                    ("human", "{user_query}"),
                ]
            )
            self._chain_with_memory = prompt | self._get_llm()
        return self._chain_with_memory

    def get_session_history(self, session_id: str) -> ChatMessageHistory:
        if session_id not in self.store:
            self.store[session_id] = ChatMessageHistory()
        return self.store[session_id]

    def invoke(self, user_query: str, session_id: str) -> str:
        if self._conversation_chain is None:
            try:
                self._conversation_chain = RunnableWithMessageHistory(
                    runnable=self._build_chain(),
                    get_session_history=self.get_session_history,
                    input_messages_key="user_query",
                    history_messages_key="chat_history",
                )
            except TypeError:
                self._conversation_chain = RunnableWithMessageHistory(
                    runnable=self._build_chain(),
                    get_session_history=self.get_session_history,
                    input_messages_key="user_query",
                    history_message_key="chat_history",
                )

        result = self._conversation_chain.invoke(
            {"user_query": user_query},
            config={"configurable": {"session_id": session_id}},
        )
        return result.content if hasattr(result, "content") else str(result)


chat_service = LangChainChatService()
