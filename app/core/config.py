from pydantic import BaseModel, PostgresDsn
from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path

PROJECT_DIR = Path(__file__).parent.parent.parent
SECRETS_DIR = PROJECT_DIR / "secrets"
ENV_DIR = PROJECT_DIR / "env"


class RunConfig(BaseModel):
    host: str
    port: int
    reload: bool = True


class DatabaseConfig(BaseModel):
    user: str
    name: str
    host: str
    port: int
    password_file: str

    echo: bool
    echo_pool: bool
    pool_size: int
    max_overflow: int

    @property
    def url(self) -> PostgresDsn:
        return PostgresDsn.build(
            scheme="postgresql+asyncpg",
            username=self.user,
            password=self.get_password(),
            host=self.host,
            port=self.port,
            path=self.name,
        )

    def get_password(self) -> str:
        return Path(PROJECT_DIR / self.password_file).read_text()


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(ENV_DIR / ".env.template", ENV_DIR / ".env"),
        case_sensitive=False,
        env_nested_delimiter="__",
    )
    run: RunConfig
    db: DatabaseConfig


settings = Settings()  # type: ignore
