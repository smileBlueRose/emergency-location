from enum import StrEnum


class SmsStatus(StrEnum):
    PENDING = "pending"
    SENT = "sent"
    DELIVERED = "delivered"
    FAILED = "failed"
    UNKNOWN = "unknown"


class TemplateName(StrEnum):
    HELLO_WORLD = "hello_world"
    LOCATION_SHARE_REQUEST = "share_geolocation_request"
