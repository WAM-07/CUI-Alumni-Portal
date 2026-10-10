from fastapi import APIRouter, Depends, File, Form, UploadFile
from app.core.dependencies import get_current_student
from app.student.schemas.additional_info import StudentAdditionalInfoRequest
from app.student.schemas.student import StudentResponse
from app.student.services.student_service import StudentService


router = APIRouter(
    prefix="/student",
    tags=["Student Profile"]
)


@router.get("/me",response_model=StudentResponse)
async def get_my_profile(current_user: dict = Depends(get_current_student)):

    return await StudentService.get_student_by_registration_no( current_user["registration_no"] )


@router.patch("/additional-info",response_model=StudentResponse)
async def update_additional_info(
    linkedin_url: str | None = Form(None),
    instagram_url: str | None = Form(None),
    cv: UploadFile | None = File(None),
    current_user: dict = Depends(get_current_student)
):
    
    request = StudentAdditionalInfoRequest(
        linkedin_url=linkedin_url,
        instagram_url=instagram_url
    )

    return await StudentService.update_additional_info(registration_no=current_user["registration_no"],request=request, cv=cv)


@router.post("/avatar", response_model=StudentResponse)
async def upload_student_avatar(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_student)
):
    from app.alumni.services.media_service import MediaService
    from app.student.repository.student_repository import StudentRepository
    avatar_url = await MediaService.upload_image(file, folder="alumni_portal/students/avatars")
    await StudentRepository.update_additional_info(
        registration_no=current_user["registration_no"],
        avatar_url=avatar_url
    )
    return await StudentService.get_student_by_registration_no(current_user["registration_no"])


@router.post("/cover", response_model=StudentResponse)
async def upload_student_cover(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_student)
):
    from app.alumni.services.media_service import MediaService
    from app.student.repository.student_repository import StudentRepository
    cover_url = await MediaService.upload_image(file, folder="alumni_portal/students/covers")
    await StudentRepository.update_additional_info(
        registration_no=current_user["registration_no"],
        cover_url=cover_url
    )
    return await StudentService.get_student_by_registration_no(current_user["registration_no"])