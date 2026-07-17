from pydantic import BaseModel, PostgresDsn
from pydantic_settings import BaseSettings


class RunConfig(BaseModel):
    host: str = 'localhost'
    port: int = 8000
    reload: bool = True


class DatabaseConfig(BaseModel):
    url: PostgresDsn
    echo: bool = False
    echo_pool: bool = False
    pool_size: int = 5
    max_overflow: int = 10


class Settings(BaseSettings):
    run: RunConfig = RunConfig()
    db: DatabaseConfig


settings = Settings()
