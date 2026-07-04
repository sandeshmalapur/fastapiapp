from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from models import company as company_model, job as job_model, users as user_model
from routers import auth, chat, company, job

app=FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
print("engine is",engine)
app.include_router(auth.router)
app.include_router(chat.router)
app.include_router(company.router)
app.include_router(job.router)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/about")
def read_about():
    return {"about":"This is about page"}

@app.get("/contact")
def contact():
    return {"contact":"This is contact page"}

