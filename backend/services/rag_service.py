import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from services.qdrant_service import search_jobs
load_dotenv()
llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.3,
)

rag_prompt=ChatPromptTemplate.from_messages([
    ("system","""You are a job search assistant. You will be provided with a user query and a list of relevant job descriptions. 
     Your task is to analyze the user query and the job descriptions, and provide a concise and informative response that helps the user in their job search.
      If the user query is not related to job search or if there are no relevant job descriptions, respond with a polite message indicating that you cannot assist with that request.
     
    Retrieved Jobs:
     {context}"""),
    ("human", '{question}')
])

rag_chain = rag_prompt | llm
def rag_job_search(question:str) ->str:
    results=search_jobs(question,top_k=5)
    if not results:
        return "I'm sorry, but I couldn't find any relevant job descriptions for your query. Please try rephrasing your question or providing more specific details."
    context="\n".join([f"-{r["title"]}: {r["description"]} (Salary: {r["salary"]},Match: {r['score']})" for r in results])

    response=rag_chain.invoke({"context":context,"question":question})
    return response.content