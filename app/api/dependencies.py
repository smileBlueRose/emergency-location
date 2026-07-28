from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from core.http import client_provider
from db.helper import db_helper
from gateway.sms.twilio import SmsTwilioGateway
from gateway.whatsapp import WhatsAppGraphApiGateway
from repositories.location import (
    LocationShareRequestRepository,
    LocationShareRecordRepository,
)
from services.sms import SmsService
from services.whatsapp import WhatsAppService
from usecases.location import (
    CreateLocationShareRequestUseCase,
    SubmitLocationShareRecordUseCase,
    GetLocationShareRecordsUseCase,
)
from core.config import settings
from twilio.rest import Client as TwilioClient


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
    return SmsService(
        gateway=SmsTwilioGateway(
            TwilioClient(
                settings.sms.twilio.account_sid, settings.sms.twilio.auth_token
            )
        )
    )


async def get_whatsapp_graph_api_gateway() -> WhatsAppGraphApiGateway:
    client = await client_provider.get_client(base_url=settings.whatsapp.graph_api.url)
    return WhatsAppGraphApiGateway(
        client=client,
        phone_number_id=settings.whatsapp.graph_api.phone_number_id,
        access_token=settings.whatsapp.graph_api.access_token,
    )


async def get_whatsapp_service() -> WhatsAppService:
    return WhatsAppService(gateway=await get_whatsapp_graph_api_gateway())
