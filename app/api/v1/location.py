from fastapi import APIRouter, Depends

from api.dependencies import (
    get_create_location_share_request_usecase,
    get_submit_location_share_record_usecase,
    get_get_location_share_record_use_case,
)
from schemas.location import (
    LocationShareRequestSchema,
    LocationShareRecordSchema,
    LocationShareRecordListSchema,
)
from usecases.location import (
    CreateLocationShareRequestUseCase,
    SubmitLocationShareRecordUseCase,
    GetLocationShareRecordsUseCase,
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


@router.get(
    "/location-shares/{request_id}/records",
    response_model=LocationShareRecordListSchema,
    status_code=200,
)
async def get_location_records(
    request_id: int,
    include_all: bool = False,
    usecase: GetLocationShareRecordsUseCase = Depends(
        get_get_location_share_record_use_case
    ),
):
    result = await usecase.execute(request_id, include_all)
    return LocationShareRecordListSchema(
        items=[LocationShareRecordSchema.model_validate(r) for r in result]
    )
