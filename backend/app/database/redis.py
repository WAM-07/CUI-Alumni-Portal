# app/database/redis.py

import redis.asyncio as redis

from app.core.config import settings

redis_client = None


async def connect_to_redis():

    global redis_client

    try:
        redis_client = redis.Redis(
            host=settings.REDIS_HOST,
            port=settings.REDIS_PORT,
            db=settings.REDIS_DB,
            decode_responses=True,
            socket_connect_timeout=0.2,
            socket_timeout=0.2
        )
    except Exception:
        redis_client = None


async def close_redis():

    global redis_client

    if redis_client:
        try:
            await redis_client.close()
        except Exception:
            pass