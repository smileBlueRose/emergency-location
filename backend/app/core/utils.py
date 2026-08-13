from secrets import token_hex

from loguru import logger

from core.config import BASE_URL, settings


def get_trace_id() -> str:
    """
    Produces a compact 12-character string.

    48 bits of entropy is enough for a request ID: at up to 1M requests
    the collision probability is ~0.18%, and for small apps
    """
    return token_hex(6)


def get_photo_share_url(filename: str) -> str:
    return BASE_URL + settings.api_prefix.media + "/" + filename


def get_share_request_url(request_id: int) -> str:
    ap = settings.api_prefix
    url = f"{BASE_URL}{ap.self}{ap.version}{ap.location}{settings.api_path.submit_location_record.format(request_id=request_id)}"
    logger.debug("share_link={}", url)
    return url
