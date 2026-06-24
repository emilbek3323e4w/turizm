from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.notification import Notification
from app.repositories.base import BaseRepository

class NotificationRepository(BaseRepository):
    model = Notification

    @classmethod
    async def get_by_user_id(cls, user_id: int, db: AsyncSession) -> list[Notification]:
        result = await db.execute(
            select(cls.model)
            .where(cls.model.user_id == user_id)
            .order_by(cls.model.created_at.desc())
        )
        return list(result.scalars().all())
