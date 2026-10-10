from app.auth.repository.user_repository import UserRepository
from app.auth.models.user import User


from app.auth.schemas.login import LoginRequest, UserLoginRequest
from app.auth.schemas.token import TokenResponse
from app.auth.schemas.signup import SignupRequest, SignupResponse
from app.auth.schemas.otp import VerifyOTPRequest

from app.auth.services.email_service import EmailService
from app.auth.services.otp_service import OTPService
from app.auth.services.redis_service import RedisService
from app.auth.services.sso_service import DummySSOService

from app.core.constants import Roles
from fastapi import HTTPException, status


from app.student.models.student import Student
from app.student.repository.student_repository import StudentRepository

from app.core.security import (
    create_access_token,
    create_refresh_token,
    hash_password,
    verify_password,
)

# ==============================================================================
# [SECURITY VULNERABILITY WARNING - TEMPORARY DEVELOPMENT USERS]
# DO NOT DEPLOY TO PRODUCTION! Remove this block before deploying.
# Provides temporary hardcoded bypass credentials for testing without Redis/SMTP.
# ==============================================================================
HARDCODED_TEST_USERS = {
    "recruitment@systemsltd.com": {
        "password": "IndustryPass123!",
        "role": Roles.INDUSTRY,
        "id": "6aafed2a68ac5b04136eb20a",
    },
    "ahmed.bilal.alumni@comsats.edu.pk": {
        "password": "AlumniPass123!",
        "role": Roles.ALUMNI,
        "id": "6aafed2a68ac5b04136eb20f",
    },
    "admin.career@comsats.edu.pk": {
        "password": "AdminPass123!",
        "role": Roles.ADMIN,
        "id": "6aafed2b68ac5b04136eb210",
    },
    "ejazwamiq@gmail.com": {
        "password": "Password123!",
        "role": Roles.ALUMNI,
        "id": "6aaff450117cc37b552adda0",
    },
}
# ==============================================================================

class AuthService:

    async def student_login(self, request: LoginRequest) -> TokenResponse:

        # [SECURITY VULNERABILITY - TEMPORARY BYPASS FOR DEV TESTING]
        if request.registration_no == "FA21-BCS-042" and request.password == "StudentPass123!":
            access_token = create_access_token({"sub": "FA21-BCS-042", "role": Roles.STUDENT})
            refresh_token = create_refresh_token({"sub": "FA21-BCS-042", "role": Roles.STUDENT})
            return TokenResponse(
                access_token=access_token,
                refresh_token=refresh_token,
                role=Roles.STUDENT
            )
        # -------------------------------------------------------------

        user = await DummySSOService.login(
            request.registration_no,
            request.password
        )

        existing_student = await StudentRepository.find_by_registration_no(
            user["registration_no"]
        )

        if not existing_student:
            student = Student(
                registration_no=user["registration_no"],
                name=user["name"],
                email=user["email"]
            )
            await StudentRepository.create_student(student)

        access_token = create_access_token(
            {"sub": user["registration_no"], "role": user["role"]}
        )
        refresh_token = create_refresh_token(
            {"sub": user["registration_no"], "role": user["role"]}
        )

        try:
            await RedisService.save_refresh_token(
                user["registration_no"],
                refresh_token
            )
        except Exception:
            pass # Ignore redis errors for local dev

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            role=user["role"]
        )


    async def user_login(self,request: UserLoginRequest) -> TokenResponse:
        # [SECURITY VULNERABILITY - TEMPORARY BYPASS FOR DEV TESTING]
        if request.email in HARDCODED_TEST_USERS:
            test_data = HARDCODED_TEST_USERS[request.email]
            if request.password == test_data["password"]:
                # Ensure the user exists in the DB so dependencies don't fail
                existing = await UserRepository.find_by_email(request.email)
                if not existing:
                    u = User(
                        email=request.email,
                        hashed_password=hash_password(request.password),
                        role=test_data["role"],
                        is_verified=True
                    )
                    u.id = test_data["id"]
                    # Insert with the hardcoded ID
                    await mongodb.database[Collections.USERS].insert_one({"_id": ObjectId(test_data["id"]), **u.model_dump(exclude={"id"})})

                access_token = create_access_token({"sub": test_data["id"], "role": test_data["role"]})
                refresh_token = create_refresh_token({"sub": test_data["id"], "role": test_data["role"]})
                return TokenResponse(
                    access_token=access_token,
                    refresh_token=refresh_token,
                    role=test_data["role"]
                )
        # -------------------------------------------------------------
        
        # 1. Find user by email
        user = await UserRepository.find_by_email(
            request.email
        )

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        # 2. Check whether email is verified
        if not user.is_verified:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Please verify your email first"
            )

        # 3. Verify password
        password_valid = verify_password(
            request.password,
            user.hashed_password
        )

        if not password_valid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        # 4. Make sure only allowed non-student roles
        if user.role not in [
            Roles.ADMIN,
            Roles.ALUMNI,
            Roles.INDUSTRY
        ]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="This login method is not available for this role"
            )

        # 5. Create access token
        access_token = create_access_token(
            {
                "sub": user.id,
                "role": user.role
            }
        )

        # 6. Create refresh token
        refresh_token = create_refresh_token(
            {
                "sub": user.id,
                "role": user.role
            }
        )

        # 7. Save refresh token in Redis
        try:
            await RedisService.save_refresh_token(
                user.id,
                refresh_token
            )
        except Exception:
            pass # Ignore redis errors for local dev

        # 8. Return tokens
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            role=user.role
        )



    async def signup(self, request: SignupRequest) -> SignupResponse:

        existing_user = await UserRepository.find_by_email(request.email)

        # -------------------------------------------------
        # User already exists
        # -------------------------------------------------

        if existing_user:

            # Already verified
            if existing_user.is_verified:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Email already exists"
                )

            otp = OTPService.generate_otp()

            try:
                await OTPService.save_otp(request.email, otp)
                await EmailService.send_otp(request.email, otp)
            except Exception:
                pass # Ignore Redis/SMTP errors for dev

            return SignupResponse(
                message="A new OTP has been sent to your email."
            )

        # -------------------------------------------------
        # New User
        # -------------------------------------------------

        hashed_password = hash_password(request.password)

        user = User(
            email=request.email,
            hashed_password=hashed_password,
            role=request.role,
            is_verified=True
        )

        user_id = await UserRepository.create_user(user)

        # Initialize user profile
        try:
            if request.role == Roles.ALUMNI:
                from app.alumni.services.profile_service import AlumniProfileService
                await AlumniProfileService.get_or_create_profile(user_id=user_id, email=request.email)
            elif request.role == Roles.INDUSTRY:
                from app.industry.services.profile_service import IndustryProfileService
                company_name = request.email.split("@")[0].capitalize()
                await IndustryProfileService.get_or_create_profile(user_id=user_id, company_name=company_name)
        except Exception:
            pass

        try:
            otp = OTPService.generate_otp()
            await OTPService.save_otp(request.email, otp)
            await EmailService.send_otp(request.email, otp)
        except Exception:
            pass # Ignore Redis/SMTP errors for dev

        return SignupResponse(
            message="Account registered successfully."
        )

    async def verify_email(self,request: VerifyOTPRequest) -> TokenResponse:

        user = await UserRepository.find_by_email(
            request.email
        )

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        await UserRepository.verify_user(
            request.email
        )

        access_token = create_access_token(
            {
                "sub": user.id,
                "role": user.role
            }
        )

        refresh_token = create_refresh_token(
            {
                "sub": user.id,
                "role": user.role
            }
        )

        try:
            await RedisService.save_refresh_token(user.id, refresh_token)
        except Exception:
            pass # Ignore Redis errors for dev

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            role=user.role
        )

    async def refresh_token(self,refresh_token: str) -> TokenResponse:

        # -----------------------------------------
        # 1. Decode refresh token
        # -----------------------------------------

        try:
            payload = decode_token(refresh_token)

        except Exception:

            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired refresh token"
            )

        # -----------------------------------------
        # 2. Get student identity
        # -----------------------------------------

        registration_no = payload.get("sub")

        if not registration_no:

            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )

        # -----------------------------------------
        # 3. Check refresh token in Redis
        # -----------------------------------------

        stored_token = await RedisService.get_refresh_token(
            registration_no
        )

        if not stored_token:

            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token not found"
            )

        # -----------------------------------------
        # 4. Compare tokens
        # -----------------------------------------

        if stored_token != refresh_token:

            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )

        # -----------------------------------------
        # 5. Create NEW access token
        # -----------------------------------------

        access_token = create_access_token(
            {
                "sub": registration_no,
                "role": Roles.STUDENT
            }
        )

        # -----------------------------------------
        # 6. Return new access token
        # -----------------------------------------

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            role=Roles.STUDENT
        )