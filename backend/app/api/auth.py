from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.services.auth import hash_password, verify_password


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


class RegisterRequest(BaseModel):
    username: str
    password: str


@router.post("/register")
def register_user(
    request: RegisterRequest,
    db: Session = Depends(get_db),
):
    username = request.username.strip()

    if not username:
        raise HTTPException(
            status_code=400,
            detail="Username is required",
        )

    if not request.password:
        raise HTTPException(
            status_code=400,
            detail="Password is required",
        )

    existing_user = (
        db.query(User)
        .filter(User.username == username)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=409,
            detail="Username already exists",
        )

    new_user = User(
        username=username,
        password_hash=hash_password(request.password),
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "Account created successfully",
        "user": {
            "id": new_user.id,
            "username": new_user.username,
        },
    }

class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/login")
def login_user(
    request: LoginRequest,
    db: Session = Depends(get_db),
):
    username = request.username.strip()

    user = (
        db.query(User)
        .filter(User.username == username)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password",
        )

    if not verify_password(
        request.password,
        user.password_hash,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password",
        )

    return {
        "message": "Login successful",
        "user": {
            "id": user.id,
            "username": user.username,
        },
    }