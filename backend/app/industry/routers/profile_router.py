from fastapi import APIRouter, Depends, UploadFile, File
from app.auth.models.user import User
from app.auth.dependensies import get_current_industry_user
from app.industry.schemas.profile_schema import IndustryProfileUpdate, IndustryProfileResponse
from app.industry.services.profile_service import IndustryProfileService
from app.alumni.services.media_service import MediaService
from app.industry.repositories.profile_repository import IndustryProfileRepository

router = APIRouter(prefix="/profile", tags=["Industry Profile"])

@router.get("/", response_model=IndustryProfileResponse)
async def get_profile(current_user: User = Depends(get_current_industry_user)):
    # company_name defaults to User's company_name/companyName or email fallback
    company_name = getattr(current_user, "company_name", None) or getattr(current_user, "companyName", None) or current_user.email
    profile = await IndustryProfileService.get_or_create_profile(current_user.id, company_name)
    return profile

@router.put("/", response_model=IndustryProfileResponse)
async def update_profile(data: IndustryProfileUpdate, current_user: User = Depends(get_current_industry_user)):
    profile = await IndustryProfileService.update_profile(current_user.id, data)
    return profile

@router.post("/avatar", response_model=IndustryProfileResponse)
async def upload_industry_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_industry_user)
):
    avatar_url = await MediaService.upload_image(file, folder="alumni_portal/industry/avatars")
    await IndustryProfileRepository.update_profile(current_user.id, {"avatar_url": avatar_url, "logo_url": avatar_url})
    company_name = getattr(current_user, "company_name", None) or getattr(current_user, "companyName", None) or current_user.email
    return await IndustryProfileService.get_or_create_profile(current_user.id, company_name)

@router.post("/cover", response_model=IndustryProfileResponse)
async def upload_industry_cover(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_industry_user)
):
    cover_url = await MediaService.upload_image(file, folder="alumni_portal/industry/covers")
    await IndustryProfileRepository.update_profile(current_user.id, {"cover_url": cover_url})
    company_name = getattr(current_user, "company_name", None) or getattr(current_user, "companyName", None) or current_user.email
    return await IndustryProfileService.get_or_create_profile(current_user.id, company_name)
