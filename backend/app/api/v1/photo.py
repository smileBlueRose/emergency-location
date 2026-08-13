from fastapi import APIRouter, UploadFile, Depends

from api.dependencies import get_photo_share_upload_usecase, get_get_photo_share_usecase
from core.config import settings
from core.utils import get_photo_share_url
from schemas.common import File
from schemas.photo import PhotoUploadSchema, PhotoShareListSchema, PhotoShareSchema
from usecases.photo import UploadPhotoShareUseCase, GetPhotoShareUseCase

router = APIRouter(prefix=settings.api_prefix.photo_shares)


@router.post(
    settings.api_path.upload_photo_shares,
    response_model=PhotoUploadSchema,
    status_code=201,
)
async def upload_photo_share(
    photo: UploadFile,
    request_id: int,
    usecase: UploadPhotoShareUseCase = Depends(get_photo_share_upload_usecase),
) -> PhotoUploadSchema:
    file = File(
        filename=photo.filename,
        content_type=photo.content_type,
        data=await photo.read(),
    )
    result = await usecase.execute(request_id=request_id, file=file)
    return PhotoUploadSchema(id=result.id, url=get_photo_share_url(result.filename))


@router.get(
    settings.api_path.get_photo_shares,
    response_model=PhotoShareListSchema,
    status_code=200,
)
async def get_photo_shares(
    request_id: int,
    usecase: GetPhotoShareUseCase = Depends(get_get_photo_share_usecase),
) -> PhotoShareListSchema:
    result = await usecase.execute(request_id=request_id)
    items = [
        PhotoShareSchema(id=i.id, url=get_photo_share_url(i.filename)) for i in result
    ]
    return PhotoShareListSchema(items=items)
