from fastapi import APIRouter, Depends, Request
from fastapi.templating import Jinja2Templates
from app.dependencies.auth import get_current_user
from app.dependencies.db_connection import get_db_connection
from app.services.users_service import UserService
import asyncpg
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
import base64
import uuid
import os

router = APIRouter(prefix="/users", tags=["users"])
templates = Jinja2Templates(directory="app/templates")

class UserProfileUpdate(BaseModel):
    face_shape: Optional[str] = None
    personal_color: Optional[str] = None
    height: Optional[int] = None
    gender: Optional[str] = None
    body_type: Optional[str] = None
    profile_image: Optional[str] = None # Base64 string

@router.patch("/me", response_model=Dict[str, Any])
async def update_user(
    profile_update: UserProfileUpdate,
    user: dict = Depends(get_current_user),
    user_service: UserService = Depends(),
    conn: asyncpg.Connection = Depends(get_db_connection)
):
    user_id = int(user["sub"])
    update_data = profile_update.dict(exclude_unset=True)
    
    if 'profile_image' in update_data and update_data['profile_image']:
        b64_str = update_data.pop('profile_image')
        # Check if it's already a URL (if user didn't change photo)
        if b64_str.startswith('http') or b64_str.startswith('/static'):
             update_data['picture'] = b64_str
        else:
            # Save Base64 to file
            try:
                if "base64," in b64_str:
                    header, encoded = b64_str.split("base64,", 1)
                else:
                    encoded = b64_str
                
                data = base64.b64decode(encoded)
                filename = f"profile_{user_id}_{uuid.uuid4()}.png"
                upload_dir = "app/static/uploads/profiles"
                os.makedirs(upload_dir, exist_ok=True)
                file_path = os.path.join(upload_dir, filename)
                
                # Write file synchronously (for simplicity in async function, ideally run in threadpool)
                with open(file_path, "wb") as f:
                    f.write(data)
                
                update_data['picture'] = f"/static/uploads/profiles/{filename}"
            except Exception as e:
                print(f"Error saving profile image: {e}")
                # Continue without updating image if failed
                pass

    return await user_service.update_user_profile(conn, user_id, update_data)

@router.get("/me", response_model=Dict[str, Any])
async def get_current_active_user(
    user: dict = Depends(get_current_user),
    user_service: UserService = Depends(),
    conn: asyncpg.Connection = Depends(get_db_connection)
):
    """
    Retrieves the details of the currently authenticated user, including real-time stats.
    """
    return await user_service.get_user_with_stats(conn, user)


@router.get("/profile")
async def user_profile(request: Request, user: dict = Depends(get_current_user), conn: asyncpg.Connection = Depends(get_db_connection)):
    # Fetch analysis history
    history = await conn.fetch("""
        SELECT * FROM analysis_results 
        WHERE user_id = $1 
        ORDER BY created_at DESC
    """, int(user["sub"]))
    
    return templates.TemplateResponse("profile.html", {
        "request": request,
        "user": user,
        "history": history
    })

@router.get("/creations", response_model=List[Dict[str, Any]])
async def get_user_creations(
    user: dict = Depends(get_current_user),
    user_service: UserService = Depends(),
    conn: asyncpg.Connection = Depends(get_db_connection)
):
    """
    Retrieves all creations for the currently authenticated user.
    """
    user_id = int(user["sub"])
    return await user_service.get_user_creations(conn, user_id)
