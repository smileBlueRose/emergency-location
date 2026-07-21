from http.client import responses

from schemas.sms import SmsResult
from core.interfaces import SmsGateway
from requests import post
from core.config import settings
from httpx import AsyncClient


class SmsKzGateway(SmsGateway):
    SEND_URL: str = "https://smsc.kz/rest/send/"

    def __init__(self, client: AsyncClient):
        self._client = client

    async def send(self, phone: str, msg: str) -> SmsResult:
        response = await self._client.post(
            self.SEND_URL,
            json={
                "login": settings.sms.kz.login,
                "psw": settings.sms.kz.password,
                "sender": settings.sms.sender,
                "phones": phone,
                "mes": msg,
                "fmt": 3,
            },
        )
        print(response.json())
        result = SmsResult(
            message_id=str(response.json().get("id", "N/A")),
            status_code=response.status_code,
            text=response.text,
        )
        return result
