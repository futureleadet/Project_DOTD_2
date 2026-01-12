from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from app.services.analysis_service import AnalysisService
from app.dependencies.auth import get_current_user
from app.dependencies.db_connection import get_db_connection
from app.repositories.creations_repository import CreationsRepository
import asyncpg
import httpx

router = APIRouter(prefix="/api/analysis", tags=["analysis"])

@router.get("/brand-archive")
async def get_brand_archive(
    current_user: dict = Depends(get_current_user),
    conn: asyncpg.Connection = Depends(get_db_connection)
):
    """
    Fetches the brand archive consulting data from n8n webhook.
    """
    creations_repo = CreationsRepository()
    user_id = int(current_user["sub"])
    user_name = current_user.get("name", "User")

    # 1. Get total creation count
    count = await creations_repo.get_total_creations_count(conn, user_id)
    
    # 2. Get latest 5 recommendation_texts (Style History)
    history_list = await creations_repo.get_latest_recommendation_texts(conn, user_id, limit=5)
    history_text = "\n".join([f"- {text}" for text in history_list])

    # 3. Call n8n webhook
    webhook_url = "http://n8n.nemone.store/webhook/dotd-consulting"
    
    payload = {
        "userName": user_name,
        "count": count,
        "userStyleHistory": history_text
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(webhook_url, json=payload, timeout=60.0)
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"Webhook Error: {e.response.text}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload")
async def upload_csv(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
    analysis_service: AnalysisService = Depends(),
    conn: asyncpg.Connection = Depends(get_db_connection)
):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Invalid file format. Please upload a CSV file.")
    
    try:
        result = await analysis_service.process_csv(file, current_user, conn)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/simulate-message")
async def simulate_message(
    payload: dict,
    current_user: dict = Depends(get_current_user),
    analysis_service: AnalysisService = Depends()
):
    # payload: {"message": "...", "personas": [...]}
    return await analysis_service.simulate_message(payload["message"], payload["personas"])
