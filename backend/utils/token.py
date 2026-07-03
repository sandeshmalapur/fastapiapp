import os
from dotenv import load_dotenv
from jose import jwt
from datetime import datetime, timedelta
from models import users
from sqlalchemy.orm import Session
from fastapi import HTTPException

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

def create_access_token(data: dict, expires_delta: timedelta = timedelta(hours=2)):
    to_encode = data.copy()
    expire = datetime.now() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, key=SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_access_token(token: str, db: Session):
    to_decode = jwt.decode(token, key=SECRET_KEY, algorithms=[ALGORITHM])
    current_user = db.query(users.User).filter(users.User.id == to_decode.get("user_id")).first()
    if current_user is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return current_user


