from enum import StrEnum

from pydantic import BaseModel


class WhatsAppTemplateLanguageCode(StrEnum):
    EN_US = "en_US"
    RU = "ru"
    KK = "kk"


class WhatsAppTemplate(BaseModel):
    name: str
    language: WhatsAppTemplateLanguageCode
    params: list[str] | dict[str, str] | None = None


class WhatsAppSendResult(BaseModel):
    message_id: str
