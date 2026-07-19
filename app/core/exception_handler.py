from fastapi import FastAPI, Request
from core.exceptions import NotFoundError, InvalidPhoneFormatError
from fastapi.responses import JSONResponse


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(NotFoundError)
    async def not_found_error_exception_handler(
        request: Request, exc: NotFoundError
    ) -> JSONResponse:
        return JSONResponse(status_code=404, content={"detail": str(exc)})

    @app.exception_handler(InvalidPhoneFormatError)
    async def invalid_phone_handler(
        request: Request, exc: InvalidPhoneFormatError
    ) -> JSONResponse:
        return JSONResponse(status_code=400, content={"detail": str(exc)})
