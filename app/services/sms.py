from core.interfaces import SmsGateway
from schemas.sms import SmsResult
from services.phone import PhoneService


class SmsService:
    def __init__(self, gateway: SmsGateway):
        self._gateway = gateway

    async def send_message(self, phone: str, message: str) -> SmsResult:
        valid_phone = PhoneService.normalize(phone)
        return await self._gateway.send(phone=valid_phone, msg=message)
