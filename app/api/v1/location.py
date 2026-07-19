from fastapi import APIRouter, Depends

from api.dependencies import (
    get_create_location_share_request_usecase,
    get_submit_location_share_record_usecase,
)
from schemas.location import LocationShareRequestSchema, LocationShareRecordSchema
from usecases.location import (
    CreateLocationShareRequestUseCase,
    SubmitLocationShareRecordUseCase,
)
from fastapi import Body

router = APIRouter()


@router.post(
    "/location-shares", response_model=LocationShareRequestSchema, status_code=201
)
async def create_location_share_request(
    phone: str = Body(..., embed=True),
    usecase: CreateLocationShareRequestUseCase = Depends(
        get_create_location_share_request_usecase
    ),
):
    result = await usecase.execute(phone)

    return result


@router.post(
    "/location-shares/{request_id}/records",
    response_model=LocationShareRecordSchema,
    status_code=201,
)
async def submit_location_record(
    request_id: int,
    latitude: float = Body(..., embed=True),
    longitude: float = Body(..., embed=True),
    usecase: SubmitLocationShareRecordUseCase = Depends(
        get_submit_location_share_record_usecase
    ),
):
    result = await usecase.execute(request_id, latitude, longitude)

    return result
