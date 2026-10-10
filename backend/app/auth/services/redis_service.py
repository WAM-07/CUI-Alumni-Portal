from app.database import redis


class RedisService:
    _tokens = {}

    @staticmethod
    async def save_refresh_token(user_id, token):
        RedisService._tokens[str(user_id)] = token
        if redis.redis_client:
            try:
                await redis.redis_client.set(f"refresh:{user_id}", token)
            except Exception:
                pass

    @staticmethod
    async def get_refresh_token(user_id):
        if str(user_id) in RedisService._tokens:
            return RedisService._tokens[str(user_id)]
        if redis.redis_client:
            try:
                return await redis.redis_client.get(f"refresh:{user_id}")
            except Exception:
                pass
        return None

    @staticmethod
    async def delete_refresh_token(user_id):
        RedisService._tokens.pop(str(user_id), None)
        if redis.redis_client:
            try:
                await redis.redis_client.delete(f"refresh:{user_id}")
            except Exception:
                pass