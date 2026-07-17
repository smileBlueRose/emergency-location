from contextlib import asynccontextmanager
from typing import AsyncGenerator

from api import router as api_router
from core.config import settings
from fastapi import FastAPI
from db import db_helper
import uvicorn


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    yield
    await db_helper.dispose()


main_app = FastAPI(lifespan=lifespan)
main_app.include_router(api_router, prefix="/api")

if __name__ == "__main__":
    uvicorn.run(
        "main:main_app",
        host=settings.run.host,
        port=settings.run.port,
        reload=settings.run.reload,
    )
