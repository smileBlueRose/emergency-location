from core.interfaces import FileStorageGateway
from repositories.photo import SharePhotoRepository
from schemas.common import File
from models.photo import PhotoShare
from services.image import ImageService
from loguru import logger


class UploadPhotoShareUseCase:
    def __init__(self, repo: SharePhotoRepository, gateway: FileStorageGateway):
        self._repo = repo
        self._gateway = gateway

    async def execute(self, file: File, request_id: int) -> PhotoShare:
        # TODO: check request is active
        # TODO: Max allowed uploads — 10

        logger.info(f"Uploading photo share for request_id={request_id}")

        content = ImageService.convert_to_jpeg(data=file.data)
        logger.debug("Image converted to jpeg")

        filename = self._gateway.save_share_photo(
            content, request_id=request_id, mimetype="image/jpeg"
        )
        logger.info("Photo saved to storage: file={}", filename)

        photo_share = await self._repo.upload(
            PhotoShare(request_id=request_id, filename=filename)
        )
        logger.info("Created photo share: id={}", photo_share.id)

        return photo_share
