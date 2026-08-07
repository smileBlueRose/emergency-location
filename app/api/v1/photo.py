from fastapi import APIRouter, UploadFile, Depends

from api.dependencies import get_photo_share_upload_usecase
from schemas.common import File
from schemas.photo import PhotoShareSchema
from usecases.photo import UploadPhotoShareUseCase

router = APIRouter(prefix="/photo-shares")


@router.post("", response_model=PhotoShareSchema, status_code=201)
async def upload_photo_share(
    photo: UploadFile,
    request_id: int,
    usecase: UploadPhotoShareUseCase = Depends(get_photo_share_upload_usecase),
) -> PhotoShareSchema:
    file = File(
        filename=photo.filename,
        content_type=photo.content_type,
        data=await photo.read(),
    )
    result = await usecase.execute(request_id=request_id, file=file)
    return PhotoShareSchema.model_validate(result)
