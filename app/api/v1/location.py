from fastapi import APIRouter, Depends

from api.dependencies import get_create_location_share_request_usecase
from schemas.location import LocationShareRequestSchema
from usecases.location import CreateLocationShareRequestUseCase
from logging import getLogger

logger = getLogger("app")

router = APIRouter()


@router.post(
    "/location-shares", response_model=LocationShareRequestSchema, status_code=201
)
async def create_location_share_request(
    phone: str,
    usecase: CreateLocationShareRequestUseCase = Depends(
        get_create_location_share_request_usecase
    ),
):
    result = await usecase.execute(phone=phone)
    logger.info(f"result = {result.to_dict()}")

    return result
