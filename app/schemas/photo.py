from pydantic import BaseModel, ConfigDict


class PhotoShareSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    request_id: int
    filename: str
