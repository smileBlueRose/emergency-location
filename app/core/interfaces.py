from typing import Protocol
from schemas.sms import SmsResult
from core.enums import SmsStatus
from schemas.whatsapp import WhatsAppTemplate, WhatsAppSendResult


class SmsGateway(Protocol):
    async def send(self, phone: str, msg: str) -> SmsResult: ...

    async def get_status(self, msg_id: str, phone: str | None = None) -> SmsStatus: ...


class WhatsAppGateway(Protocol):
    async def send(
        self, phone: str, template: WhatsAppTemplate
    ) -> WhatsAppSendResult: ...
