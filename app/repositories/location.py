from models.location import LocationShareRequest, LocationShareRecord
from typing import TYPE_CHECKING
from sqlalchemy import select

if TYPE_CHECKING:
    from sqlalchemy.ext.asyncio import AsyncSession


class LocationShareRequestRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, instance: LocationShareRequest) -> LocationShareRequest:
        self.session.add(instance)
        await self.session.commit()
        await self.session.refresh(instance)
        return instance

    async def get(self, request_id: int) -> LocationShareRequest | None:
        result = await self.session.execute(
            select(LocationShareRequest).where(LocationShareRequest.id == request_id)
        )
        return result.scalar_one_or_none()


class LocationShareRecordRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, instance: LocationShareRecord) -> LocationShareRecord:
        self.session.add(instance)
        await self.session.commit()
        await self.session.refresh(instance)
        return instance

    async def get_by_id(self, record_id: int) -> LocationShareRecord | None:
        result = await self.session.execute(
            select(LocationShareRecord).where(LocationShareRecord.id == record_id)
        )
        return result.scalar_one_or_none()

    async def get_all_by_request_id(
        self, request_id: int, limit: int | None = None
    ) -> list[LocationShareRecord]:
        result = await self.session.execute(
            select(LocationShareRecord)
            .where(LocationShareRecord.request_id == request_id)
            .order_by(LocationShareRecord.created_at.desc())
            .limit(limit)
        )
        return list(result.scalars().all())
