from typing import Protocol, runtime_checkable
from schemas.sms import SmsResult
from httpx import AsyncClient


class SmsGateway(Protocol):
    client: AsyncClient

    async def send(self, phone: str, msg: str) -> SmsResult: ...
