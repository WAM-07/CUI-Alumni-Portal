from app.industry.repositories.application_repository import ApplicationRepository
from app.industry.models.application import Application
from app.industry.schemas.application_schema import ApplicationCreate, ApplicationUpdate, ApplicationResponse
from app.industry.services.job_service import JobService
from fastapi import HTTPException
from typing import List

class ApplicationService:
    
    @staticmethod
    async def create_application(applicant_id: str, data: ApplicationCreate) -> Application:
        # Verify job exists and is open
        job = await JobService.get_job(data.job_id)
        if job.status != "open":
            raise HTTPException(status_code=400, detail="Job is not open for applications")
            
        new_app = Application(applicant_user_id=applicant_id, **data.model_dump())
        saved_app = await ApplicationRepository.create_application(new_app)

        # Trigger notification to the employer company
        try:
            from app.industry.services.notification_service import NotificationService
            from app.industry.schemas.notification_schema import NotificationCreate
            await NotificationService.create_notification(
                NotificationCreate(
                    recipient_id=job.company_id,
                    title="New Job Application",
                    message=f"A new application has been submitted for '{job.title}'.",
                    type="application",
                    related_entity_id=saved_app.id,
                    metadata={"job_id": job.id, "job_title": job.title}
                )
            )
        except Exception:
            pass

        return saved_app

    @staticmethod
    async def get_applications_for_job(company_id: str, job_id: str) -> List[ApplicationResponse]:
        job = await JobService.get_job(job_id)
        if job.company_id != company_id:
            raise HTTPException(status_code=403, detail="Not authorized to view these applications")
            
        apps = await ApplicationRepository.get_all_by_job(job_id)
        
        from app.database import mongodb
        from app.database.collections import Collections
        from bson import ObjectId

        enriched_apps = []
        for app in apps:
            app_dict = app.model_dump()
            uid = app.applicant_user_id
            
            # Lookup candidate details
            student_query = {"registration_no": uid}
            if ObjectId.is_valid(uid):
                student_query = {"$or": [{"_id": ObjectId(uid)}, {"registration_no": uid}]}
            student = await mongodb.database[Collections.STUDENTS].find_one(student_query)
            if student:
                app_dict["applicant_name"] = student.get("name") or student.get("registration_no")
                app_dict["applicant_email"] = student.get("email")
                app_dict["applicant_role"] = "Student"
                if not app_dict.get("resume_link") and student.get("cv", {}).get("file_url"):
                    app_dict["resume_link"] = student["cv"]["file_url"]
            else:
                user = await mongodb.database[Collections.USERS].find_one({"_id": ObjectId(uid)}) if ObjectId.is_valid(uid) else None
                if user:
                    profile = await mongodb.database[Collections.ALUMNI_PROFILES].find_one({"user_id": uid})
                    app_dict["applicant_name"] = profile.get("name") if profile else user.get("email", "").split("@")[0].capitalize()
                    app_dict["applicant_email"] = user.get("email")
                    app_dict["applicant_role"] = user.get("role", "Alumni").capitalize()
                else:
                    app_dict["applicant_name"] = f"Applicant ({uid[-6:] if len(uid) >= 6 else uid})"
                    app_dict["applicant_email"] = ""
                    app_dict["applicant_role"] = "Applicant"
            
            enriched_apps.append(ApplicationResponse(**app_dict))

        return enriched_apps
        
    @staticmethod
    async def update_application_status(company_id: str, app_id: str, data: ApplicationUpdate) -> Application:
        app = await ApplicationRepository.get_by_id(app_id)
        if not app:
            raise HTTPException(status_code=404, detail="Application not found")
            
        # Verify company owns the job
        job = await JobService.get_job(app.job_id)
        if job.company_id != company_id:
            raise HTTPException(status_code=403, detail="Not authorized to update this application")
            
        return await ApplicationRepository.update_status(app_id, data.status)
