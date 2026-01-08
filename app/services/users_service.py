from app.repositories.users_repository import UserRepository
from fastapi import Depends, HTTPException
import asyncpg
from typing import List, Dict, Any, Optional
from app.auth.password_util import hash_password, verify_password

class UserService:
    def __init__(self, user_repo: UserRepository = Depends()):
        self.user_repo = user_repo

    async def get_or_create_user(self, conn: asyncpg.Connection, email: str, name: str, picture: str):
        """For Google OAuth: Finds a user or creates them if they don't exist."""
        user = await self.user_repo.get_user_by_email(conn, email)
        if not user:
            # Save Google picture to profile_image, leave picture (generation photo) empty
            user = await self.user_repo.create_user(conn, email=email, name=name, picture=None, profile_image=picture, role="MEMBER", hashed_password=None)
        return user

    async def register_new_user(self, conn: asyncpg.Connection, email: str, password: str, name: str) -> Dict[str, Any]:
        """Registers a new user with an email and password."""
        existing_user = await self.user_repo.get_user_by_email(conn, email)
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")

        hashed_pass = hash_password(password)
        
        # For email signups, we can use a generic or generated profile picture
        default_picture = f"https://api.multiavatar.com/{email}.png"

        new_user = await self.user_repo.create_user(
            conn, 
            email=email,
            name=name,
            picture=None, # Generation photo empty
            profile_image=default_picture, # Avatar
            role="MEMBER", 
            hashed_password=hashed_pass
        )
        return new_user

    async def authenticate_user(self, conn: asyncpg.Connection, email: str, password: str) -> Optional[Dict[str, Any]]:
        """Authenticates a user by email and password."""
        user = await self.user_repo.get_user_by_email(conn, email)
        if not user:
            return None
        
        if not user["hashed_password"] or not verify_password(password, user["hashed_password"]):
            return None
            
        return user

    async def get_user_creations(self, conn: asyncpg.Connection, user_id: int) -> List[Dict[str, Any]]:
        """Retrieves all creations for a specific user."""
        return await self.user_repo.get_creations_by_user_id(conn, user_id)
    
    async def get_all_users(self, conn: asyncpg.Connection) -> List[Dict[str, Any]]:
        """Retrieves all users, excluding sensitive data."""
        users = await self.user_repo.get_all_users(conn)
        # Exclude hashed_password explicitly if the repo method didn't already
        # (repo method already excludes it in select statement)
        return users

    async def get_user_by_id(self, conn: asyncpg.Connection, user_id: int) -> Optional[Dict[str, Any]]:
        """Retrieves a single user by ID, excluding sensitive data."""
        user = await self.user_repo.get_user_by_id(conn, user_id)
        # Exclude hashed_password explicitly if the repo method didn't already
        return user

    async def get_user_with_stats(self, conn: asyncpg.Connection, user_data: dict) -> Dict[str, Any]:
        """
        Enhances user data with real-time stats like daily creation count.
        """
        user_id = int(user_data["sub"])
        # Fetch fresh user data from DB to get latest profile info
        db_user = await self.user_repo.get_user_by_id(conn, user_id)
        
        if db_user:
            # Merge DB data into JWT data, prioritizing DB data
            user_data.update(db_user)
            # Ensure 'sub' is preserved as string for JWT compatibility
            user_data['sub'] = str(db_user['id'])

        daily_creations = await self.user_repo.count_creations_today(conn, user_id)
        
        # Combine JWT data with fetched stats
        user_data['dailyGenerationsUsed'] = daily_creations
        user_data['maxDailyGenerations'] = 3
        
        # Rename 'profile_image' to 'avatarUrl' for frontend
        if 'profile_image' in user_data:
            user_data['avatarUrl'] = user_data.get('profile_image')
            
        # Rename 'picture' to 'generationPhoto'
        if 'picture' in user_data:
            user_data['generationPhoto'] = user_data.get('picture')

        # Map snake_case to camelCase for profile fields
        if 'face_shape' in user_data:
            user_data['faceShape'] = user_data.get('face_shape')
        if 'personal_color' in user_data:
            user_data['personalColor'] = user_data.get('personal_color')
        if 'body_type' in user_data:
            user_data['bodyType'] = user_data.get('body_type')

        return user_data

    async def update_user_profile(self, conn: asyncpg.Connection, user_id: int, profile_data: Dict[str, Any]) -> Dict[str, Any]:
        """Updates the user's profile information."""
        updated_user = await self.user_repo.update_user_profile(conn, user_id, profile_data)
        if not updated_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Format for frontend
        if 'profile_image' in updated_user:
            updated_user['avatarUrl'] = updated_user.get('profile_image')
            
        if 'picture' in updated_user:
            updated_user['generationPhoto'] = updated_user.get('picture')

        # Map snake_case to camelCase for profile fields
        if 'face_shape' in updated_user:
            updated_user['faceShape'] = updated_user.get('face_shape')
        if 'personal_color' in updated_user:
            updated_user['personalColor'] = updated_user.get('personal_color')
        if 'body_type' in updated_user:
            updated_user['bodyType'] = updated_user.get('body_type')
        
        return updated_user