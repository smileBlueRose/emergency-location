import logging
import sys

from loguru import logger, Record

from core.config import PROJECT_DIR


class InterceptHandler(logging.Handler):
    def emit(self, record: logging.LogRecord) -> None:
        try:
            level = logger.level(record.levelname).name
        except ValueError:
            level = record.levelno

        logger.bind(_uvicorn=True).opt(exception=record.exc_info).log(
            level, record.getMessage()
        )


UVICORN_LOG_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "default": {
            "()": InterceptHandler,
        },
    },
    "loggers": {
        "uvicorn": {
            "handlers": ["default"],
            "level": "INFO",
            "propagate": False,
        },
        "uvicorn.error": {
            "handlers": ["default"],
            "level": "INFO",
            "propagate": False,
        },
        "uvicorn.access": {
            "handlers": ["default"],
            "level": "INFO",
            "propagate": False,
        },
    },
}


def is_uvicorn(record: Record) -> bool:
    return record["extra"].get("_uvicorn", False)


def is_application(record: Record) -> bool:
    return not is_uvicorn(record)


def configure_logger() -> None:
    logger.remove()
    logger.level("INFO", color="<green>")

    application_format = (
        "<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | "
        "<level>{level: <8}</level> | "
        "{message} | <level>{extra}</level> | "
        "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan>"
    )

    uvicorn_format = (
        "<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | "
        "<level>{level: <8}</level> | "
        "{message}"
    )

    logger.add(
        f"{PROJECT_DIR}/logs/info.log",
        level="INFO",
        format=application_format,
        filter=is_application,
    )

    logger.add(
        f"{PROJECT_DIR}/logs/error.log",
        level="ERROR",
        format=application_format,
        filter=is_application,
    )

    logger.add(
        f"{PROJECT_DIR}/logs/info.log",
        level="INFO",
        format=uvicorn_format,
        filter=is_uvicorn,
    )

    logger.add(
        f"{PROJECT_DIR}/logs/error.log",
        level="ERROR",
        format=uvicorn_format,
        filter=is_uvicorn,
    )

    logger.add(
        sys.stderr,
        level="DEBUG",
        format=application_format,
        filter=is_application,
    )

    logger.add(
        sys.stderr,
        level="DEBUG",
        format=uvicorn_format,
        filter=is_uvicorn,
    )

    logger.debug("Logger configured")
