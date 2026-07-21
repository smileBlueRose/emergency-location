from pydantic import BaseModel


class SmsResult(BaseModel):
    message_id: str
    status_code: int
    text: str
