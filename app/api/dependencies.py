from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from db.helper import db_helper
from repositories.location import LocationShareRequestRepository
from usecases.location import CreateLocationShareRequestUseCase


def get_create_location_share_request_usecase(
    session: AsyncSession = Depends(db_helper.session_getter),
) -> CreateLocationShareRequestUseCase:
    repo = LocationShareRequestRepository(session=session)
    return CreateLocationShareRequestUseCase(repository=repo)
