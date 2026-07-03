from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from models.users import User
from database import get_db
from sqlalchemy.orm import Session
from utils.token import verify_access_token


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    current_user = verify_access_token(token, db)
    return current_user

def role_required(roles:list):
    def role_decorator(current_user = Depends(get_current_user)):
        if current_user.role not in roles:
            raise HTTPException(status_code=403, detail="Access denied")
        return current_user
    return role_decorator




