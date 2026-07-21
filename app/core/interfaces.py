from typing import Protocol
from schemas.sms import SmsResult
from httpx import AsyncClient
from core.enums import SmsStatus


class SmsGateway(Protocol):
    _client: AsyncClient

    async def send(self, phone: str, msg: str) -> SmsResult: ...
    async def get_status(self, msg_id: str, phone: str | None = None) -> SmsStatus: ...
