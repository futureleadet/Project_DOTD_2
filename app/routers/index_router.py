from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx
import logging

router = APIRouter()

class WebhookRequest(BaseModel):
    text: str

WEBHOOK_URL = "http://n8n.nemone.store/webhook/0e49d469-3a13-4dd2-87d1-a5d27de886b9"

@router.post("/api/webhook-proxy")
async def proxy_webhook(request: WebhookRequest):
    """
    Proxies the request to the HTTP webhook to avoid Mixed Content errors.
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                WEBHOOK_URL,
                json={"text": request.text},
                timeout=30.0
            )
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as e:
        logging.error(f"Webhook returned error: {e.response.text}")
        raise HTTPException(status_code=e.response.status_code, detail=f"Webhook Error: {e.response.text}")
    except httpx.RequestError as e:
        logging.error(f"Webhook connection failed: {e}")
        raise HTTPException(status_code=500, detail=f"Webhook Connection Failed: {str(e)}")
    except Exception as e:
        logging.error(f"Unexpected error in webhook proxy: {e}")
        raise HTTPException(status_code=500, detail=str(e))