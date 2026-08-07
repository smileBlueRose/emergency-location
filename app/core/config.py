from pydantic import BaseModel, PostgresDsn
from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path

PROJECT_DIR = Path(__file__).parent.parent.parent
SECRETS_DIR = PROJECT_DIR / "secrets"
ENV_DIR = PROJECT_DIR / "env"

MEDIA_ROOT = Path(PROJECT_DIR / "media")
MEDIA_ROOT.mkdir(exist_ok=True)


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


class PhoneConfig(BaseModel):
    default_region: str = "KZ"


class LocationConfig(BaseModel):
    request_ttl: int = 60 * 30


class SmsConfig(BaseModel):
    sender: str

    class SmsKzConfig(BaseModel):
        login: str
        password: str

    class TwilioConfig(BaseModel):
        account_sid: str
        auth_token: str
        from_phone: str

    kz: SmsKzConfig  # TODO: rename to smsc_kz
    twilio: TwilioConfig


class WhatsAppConfig(BaseModel):
    class GraphApi(BaseModel):
        url: str = "https://graph.facebook.com/v21.0"
        phone_number_id: str
        access_token: str

    graph_api: GraphApi


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(ENV_DIR / ".env.template", ENV_DIR / ".env"),
        case_sensitive=False,
        env_nested_delimiter="__",
    )
    run: RunConfig
    db: DatabaseConfig
    phone: PhoneConfig = PhoneConfig()
    location: LocationConfig = LocationConfig()
    sms: SmsConfig
    whatsapp: WhatsAppConfig


settings = Settings()  # type: ignore
