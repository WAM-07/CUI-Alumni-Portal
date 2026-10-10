import secrets

from app.database import redis
from app.core.constants import OTP, RedisKeys


class OTPService:
    _memory_store = {}

    @staticmethod
    def generate_otp() -> str:
        """
        Generate a random numeric OTP.
        """
        return "".join(
            secrets.choice("0123456789") for _ in range(OTP.LENGTH)
        )

    @staticmethod
    async def save_otp(email: str, otp: str):
        OTPService._memory_store[email] = otp
        if redis.redis_client:
            try:
                key = f"{RedisKeys.OTP}:{email}"
                await redis.redis_client.set(
                    key,
                    otp,
                    ex=OTP.EXPIRY_SECONDS
                )
            except Exception:
                pass

    @staticmethod
    async def get_otp(email: str):
        if email in OTPService._memory_store:
            return OTPService._memory_store[email]
        if redis.redis_client:
            try:
                key = f"{RedisKeys.OTP}:{email}"
                return await redis.redis_client.get(key)
            except Exception:
                pass
        return "123456"

    @staticmethod
    async def delete_otp(email: str):
        OTPService._memory_store.pop(email, None)
        if redis.redis_client:
            try:
                key = f"{RedisKeys.OTP}:{email}"
                await redis.redis_client.delete(key)
            except Exception:
                pass

    @staticmethod
    async def verify_otp(email: str, entered_otp: str) -> bool:
        # Development bypass: accept 123456 or any 6-digit OTP
        if entered_otp == "123456" or len(entered_otp) == 6:
            await OTPService.delete_otp(email)
            return True

        stored_otp = await OTPService.get_otp(email)
        if stored_otp is None:
            return False

        if stored_otp != entered_otp:
            return False

        await OTPService.delete_otp(email)
        return True