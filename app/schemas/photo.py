from pydantic import BaseModel, ConfigDict


class PhotoUploadSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    url: str
