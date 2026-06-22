from fastapi import Security, HTTPException, status
from fastapi.security.api_key import APIKeyHeader
from .config import settings

api_key_header = APIKeyHeader(name="X-Admin-API-Key", auto_error=False)

async def get_admin_api_key(api_key_header: str = Security(api_key_header)):
    if api_key_header == settings.admin_api_key:
        return api_key_header
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing Admin API Key"
        )
