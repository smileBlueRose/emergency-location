from core.config import settings
from core.exceptions import InvalidPhoneFormatError
from repositories.location import (
    LocationShareRequestRepository,
    LocationShareRecordRepository,
)
from models.location import LocationShareRequest, LocationShareRecord
from services.phone import PhoneService
from datetime import datetime, UTC, timedelta
from core.exceptions import NotFoundError


class CreateLocationShareRequestUseCase:
    def __init__(self, repository: LocationShareRequestRepository):
        self._repo = repository

    async def execute(self, phone: str) -> LocationShareRequest:
        if not PhoneService.is_valid(phone):
            raise InvalidPhoneFormatError("Phone number is invalid.")
        phone_number = PhoneService.normalize(phone)
        expired_at = datetime.now(tz=UTC) + timedelta(
            seconds=settings.location.request_ttl
        )
        share_request = LocationShareRequest(phone=phone_number, expired_at=expired_at)

        return await self._repo.create(share_request)


class SubmitLocationShareRecordUseCase:
    def __init__(
        self,
        request_repo: LocationShareRequestRepository,
        record_repo: LocationShareRecordRepository,
    ):
        self._request_repo = request_repo
        self._record_repo = record_repo

    async def execute(
        self, request_id: int, latitude: float, longitude: float
    ) -> LocationShareRecord:
        """:raises NotFoundError:"""

        location_request = await self._request_repo.get(request_id=request_id)
        if location_request is None:
            raise NotFoundError("Location share request not found.")

        location_record = LocationShareRecord(
            request_id=request_id, latitude=latitude, longitude=longitude
        )
        return await self._record_repo.create(location_record)


class GetLocationShareRecordsUseCase:
    def __init__(self, repo: LocationShareRecordRepository):
        self._repo = repo

    async def execute(
        self, request_id: int, include_all: bool
    ) -> list[LocationShareRecord]:
        if include_all:
            return await self._repo.get_all_by_request_id(request_id=request_id)

        return await self._repo.get_all_by_request_id(request_id=request_id, limit=1)
