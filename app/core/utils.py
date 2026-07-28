from secrets import token_hex


def get_trace_id() -> str:
    """
    Produces a compact 12-character string.

    48 bits of entropy is enough for a request ID: at up to 1M requests
    the collision probability is ~0.18%, and for small apps
    """
    return token_hex(6)
