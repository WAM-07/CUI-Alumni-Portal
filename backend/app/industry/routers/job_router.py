from fastapi import APIRouter, Depends
from typing import List
from app.auth.models.user import User
from app.auth.dependensies import get_current_industry_user
from app.industry.schemas.job_schema import JobCreate, JobUpdate, JobResponse
from app.industry.schemas.application_schema import ApplicationResponse, ApplicationUpdate
from app.industry.services.job_service import JobService
from app.industry.services.application_service import ApplicationService

router = APIRouter(prefix="/jobs", tags=["Industry Jobs"])

@router.post("/", response_model=JobResponse)
async def create_job(data: JobCreate, current_user: User = Depends(get_current_industry_user)):
    return await JobService.create_job(company_id=current_user.id, data=data)

@router.get("/", response_model=List[JobResponse])
async def get_company_jobs(current_user: User = Depends(get_current_industry_user)):
    """Fetch jobs posted by the logged-in industry user."""
    return await JobService.get_jobs_by_company(company_id=current_user.id)

from app.auth.dependensies import get_current_authenticated_entity
from app.industry.schemas.application_schema import ApplicationCreate

@router.get("/all", response_model=List[JobResponse])
async def get_all_jobs(current_entity: dict = Depends(get_current_authenticated_entity)):
    """Fetch all jobs for the general job board (accessible by any authenticated user)."""
    return await JobService.get_all_jobs()

@router.post("/{job_id}/apply", response_model=ApplicationResponse)
async def apply_to_job(
    job_id: str,
    data: ApplicationCreate,
    current_entity: dict = Depends(get_current_authenticated_entity)
):
    """Apply to a job posting (accessible by students, alumni, etc.)."""
    data.job_id = job_id
    applicant_id = current_entity.get("id") or current_entity.get("sub")
    return await ApplicationService.create_application(applicant_id=str(applicant_id), data=data)

@router.put("/{job_id}", response_model=JobResponse)
async def update_job(job_id: str, data: JobUpdate, current_user: User = Depends(get_current_industry_user)):
    return await JobService.update_job(job_id=job_id, company_id=current_user.id, data=data)

@router.delete("/{job_id}")
async def delete_job(job_id: str, current_user: User = Depends(get_current_industry_user)):
    await JobService.delete_job(job_id=job_id, company_id=current_user.id)
    return {"message": "Job deleted successfully"}

@router.get("/{job_id}/applicants", response_model=List[ApplicationResponse])
async def get_job_applicants(job_id: str, current_user: User = Depends(get_current_industry_user)):
    return await ApplicationService.get_applications_for_job(company_id=current_user.id, job_id=job_id)

@router.put("/{job_id}/applicants/{app_id}/status", response_model=ApplicationResponse)
async def update_applicant_status(job_id: str, app_id: str, data: ApplicationUpdate, current_user: User = Depends(get_current_industry_user)):
    # Assuming job_id check is handled or we just update the app by its id. We pass company_id for validation.
    return await ApplicationService.update_application_status(company_id=current_user.id, app_id=app_id, data=data)
