from core.interfaces import WhatsAppGateway
from schemas.whatsapp import (
    WhatsAppSendResult,
    WhatsAppTemplate,
    WhatsAppTemplateLanguageCode,
)
from core.enums import TemplateName

from loguru import logger


class WhatsAppService:
    def __init__(self, gateway: WhatsAppGateway):
        self._gateway = gateway

    async def send_location_share_request(
        self, phone: str, link: str
    ) -> WhatsAppSendResult:
        template = WhatsAppTemplate(
            name=TemplateName.LOCATION_SHARE_REQUEST,
            language=self._get_language_code(phone=phone),
            params={"location_link": link},
        )

        logger.info(
            "Sending geolocation share request: phone={!r}, link={}", phone, link
        )
        result = await self._gateway.send(phone=phone, template=template)
        logger.info("Message sent: message_id={}", result.message_id)

        return result

    @staticmethod
    def _get_language_code(phone: str) -> WhatsAppTemplateLanguageCode:
        return WhatsAppTemplateLanguageCode.EN_US
