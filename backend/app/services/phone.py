from phonenumbers import (
    PhoneNumber,
    NumberParseException,
    parse,
    is_valid_number,
    format_number,
    PhoneNumberFormat,
)
from core.exceptions import InvalidPhoneFormatError
from core.config import settings


class PhoneService:
    @classmethod
    def parse(cls, phone: str, region: str | None = None) -> PhoneNumber:
        """:raises InvalidPhoneFormatError: If phone number specified in the wrong format."""
        if not phone.startswith("+"):
            raise InvalidPhoneFormatError(
                "Phone number must be in international format, e.g. +77071234567"
            )

        region = region or settings.phone.default_region
        try:
            return parse(phone, region)
        except NumberParseException as e:
            raise InvalidPhoneFormatError(str(e)) from e

    @classmethod
    def is_valid(cls, phone: str, region: str | None = None) -> bool:
        try:
            parsed = cls.parse(phone, region)
        except InvalidPhoneFormatError:
            return False
        return is_valid_number(parsed)

    @classmethod
    def normalize(cls, phone: str, region: str | None = None) -> str:
        parsed = cls.parse(phone, region)
        return format_number(parsed, PhoneNumberFormat.E164)
