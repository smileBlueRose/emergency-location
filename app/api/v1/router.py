from fastapi import APIRouter
from api.v1.location import router as location_router

router = APIRouter()
router.include_router(location_router, prefix="/location", tags=["location"])
