from api import router as api_router
from core.config import settings
from fastapi import FastAPI
import uvicorn

app = FastAPI()
app.include_router(
    api_router,
    prefix='/api'
)

if __name__ == '__main__':
    uvicorn.run('main:app',
                host=settings.run.host,
                port=settings.run.port,
                reload=settings.run.reload)
