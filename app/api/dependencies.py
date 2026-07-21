from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from core.http import client_provider
from db.helper import db_helper
from gateway.sms import SmsKzGateway
from repositories.location import (
    LocationShareRequestRepository,
    LocationShareRecordRepository,
)
from services.sms import SmsService
from usecases.location import (
    CreateLocationShareRequestUseCase,
    SubmitLocationShareRecordUseCase,
    GetLocationShareRecordsUseCase,
)


def get_create_location_share_request_usecase(
    session: AsyncSession = Depends(db_helper.session_getter),
) -> CreateLocationShareRequestUseCase:
    repo = LocationShareRequestRepository(session)
    return CreateLocationShareRequestUseCase(repository=repo)


def get_submit_location_share_record_usecase(
    session: AsyncSession = Depends(db_helper.session_getter),
) -> SubmitLocationShareRecordUseCase:
    request_repo = LocationShareRequestRepository(session)
    record_repo = LocationShareRecordRepository(session)
    return SubmitLocationShareRecordUseCase(
        request_repo=request_repo, record_repo=record_repo
    )


def get_get_location_share_record_use_case(
    session: AsyncSession = Depends(db_helper.session_getter),
) -> GetLocationShareRecordsUseCase:
    repo = LocationShareRecordRepository(session)
    return GetLocationShareRecordsUseCase(repo)


async def get_sms_service() -> SmsService:
    client = await client_provider.get_client()
    return SmsService(gateway=SmsKzGateway(client))
