from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import httpx
from typing import Optional
from app.dependencies.db_connection import get_db_connection
from app.repositories.creations_repository import CreationsRepository
import asyncpg
import json

router = APIRouter(prefix="/api/shopping", tags=["shopping"])

class ShoppingRequest(BaseModel):
    trend_insight: str
    creation_id: Optional[int] = None

@router.post("/recommend")
async def recommend_products(
    request: ShoppingRequest,
    conn: asyncpg.Connection = Depends(get_db_connection)
):
    webhook_url = "http://n8n.nemone.store/webhook-test/f7897612-b58a-48bc-b4c4-1edf8e985552"
    creations_repo = CreationsRepository()
    
    try:
        async with httpx.AsyncClient() as client:
            # User specified input: {{ $json.body.trend_insight }}
            response = await client.post(
                webhook_url, 
                json={"trend_insight": request.trend_insight},
                timeout=45.0
            )
            
            if response.status_code != 200:
                print(f"N8N Error: {response.status_code} {response.text}")
                raise HTTPException(status_code=response.status_code, detail="Failed to fetch recommendations from N8N")
            
            data = response.json()
            
            # If creation_id is provided, save the result to the DB
            if request.creation_id:
                # Assuming data structure is {"shopping_list": [...]}
                # We save it as JSON string
                await creations_repo.update_shopping_results(conn, request.creation_id, json.dumps(data))
            
            return data
            
    except httpx.RequestError as exc:
        print(f"An error occurred while requesting {exc.request.url!r}.")
        raise HTTPException(status_code=500, detail="Connection error to recommendation service")
    except Exception as e:
        print(f"Error calling N8N webhook: {e}")
        raise HTTPException(status_code=500, detail=str(e))
