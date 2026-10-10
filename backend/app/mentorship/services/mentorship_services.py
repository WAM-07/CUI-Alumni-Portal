from app.mentorship.repository.mentorship_repository import MentorshipRepository
from app.mentorship.models.mentorship import MentorshipRequestModel
from app.mentorship.schemas.mentorship_schema import MentorshipRequestCreate, MentorshipStatusUpdate, MentorshipResponse, MentorProfile, OptInUpdate
from app.auth.repository.user_repository import UserRepository
from app.database import mongodb
from app.database.collections import Collections
from app.core.constants import Roles
from fastapi import HTTPException, status
from bson import ObjectId

class MentorshipService:

    @staticmethod
    async def get_mentors() -> list[MentorProfile]:
        users_cursor = mongodb.database[Collections.USERS].find({"role": Roles.ALUMNI, "is_mentor": True})
        users = await users_cursor.to_list(length=100)
        
        user_ids = [str(u["_id"]) for u in users]
        
        profiles_cursor = mongodb.database[Collections.ALUMNI_PROFILES].find({
            "$or": [
                {"is_mentor": True},
                {"user_id": {"$in": user_ids}}
            ]
        })
        profiles_list = await profiles_cursor.to_list(length=100)
        profiles_by_user_id = {str(p.get("user_id")): p for p in profiles_list}

        result = []
        seen_ids = set()

        for u in users:
            uid = str(u["_id"])
            seen_ids.add(uid)
            p = profiles_by_user_id.get(uid, {})
            name = p.get("name") or u.get("name") or u.get("email", "").split("@")[0].capitalize()
            result.append(MentorProfile(
                id=uid,
                email=u.get("email", ""),
                name=name,
                avatar_url=p.get("avatar_url"),
                bio=p.get("bio"),
                current_company=p.get("current_company"),
                current_position=p.get("current_position"),
                department=p.get("department")
            ))

        for p in profiles_list:
            uid = str(p.get("user_id") or p.get("_id"))
            if p.get("is_mentor") and uid not in seen_ids:
                seen_ids.add(uid)
                result.append(MentorProfile(
                    id=uid,
                    email=p.get("email", ""),
                    name=p.get("name") or "Alumni Mentor",
                    avatar_url=p.get("avatar_url"),
                    bio=p.get("bio"),
                    current_company=p.get("current_company"),
                    current_position=p.get("current_position"),
                    department=p.get("department")
                ))

        return result

    @staticmethod
    async def create_request(student_id: str, request: MentorshipRequestCreate) -> MentorshipResponse:
        # Verify alumni exists and is a mentor
        alumni = await UserRepository.find_by_id(request.alumni_id)
        if not alumni or alumni.role != Roles.ALUMNI or not alumni.is_mentor:
            raise HTTPException(status_code=400, detail="Invalid mentor selected.")
            
        # Check if request already exists
        existing_requests = await MentorshipRepository.get_requests_by_student(student_id)
        for req in existing_requests:
            if req.alumni_id == request.alumni_id:
                raise HTTPException(status_code=400, detail="Request already sent to this mentor.")

        req_model = MentorshipRequestModel(
            student_id=student_id,
            alumni_id=request.alumni_id,
            status="pending"
        )
        
        req_id = await MentorshipRepository.create_request(req_model)
        req_model.id = req_id
        
        return MentorshipResponse(**req_model.model_dump())

    @staticmethod
    async def get_my_requests(user_id: str, role: str) -> list[MentorshipResponse]:
        if role == Roles.STUDENT:
            requests = await MentorshipRepository.get_requests_by_student(user_id)
        elif role == Roles.ALUMNI:
            requests = await MentorshipRepository.get_requests_by_alumni(user_id)
        else:
            return []
            
        responses = []
        for req in requests:
            req_data = req.model_dump()
            
            # Lookup student name
            student_name = "Student"
            student_id = req.student_id
            student_query = {"registration_no": student_id}
            if ObjectId.is_valid(student_id):
                student_query = {"$or": [{"_id": ObjectId(student_id)}, {"registration_no": student_id}]}
            student_doc = await mongodb.database[Collections.STUDENTS].find_one(student_query)
            if student_doc:
                student_name = student_doc.get("name") or student_doc.get("registration_no") or "Student"
            else:
                user_doc = await mongodb.database[Collections.USERS].find_one({"_id": ObjectId(student_id)}) if ObjectId.is_valid(student_id) else None
                if user_doc:
                    student_name = user_doc.get("email", "").split("@")[0].capitalize() or "Student"
            
            # Lookup alumni name
            alumni_name = "Alumni Mentor"
            alumni_id = req.alumni_id
            alumni_query = {"user_id": alumni_id}
            if ObjectId.is_valid(alumni_id):
                alumni_query = {"$or": [{"user_id": alumni_id}, {"_id": ObjectId(alumni_id)}]}
            alumni_doc = await mongodb.database[Collections.ALUMNI_PROFILES].find_one(alumni_query)
            if alumni_doc and alumni_doc.get("name"):
                alumni_name = alumni_doc.get("name")
            else:
                user_doc = await mongodb.database[Collections.USERS].find_one({"_id": ObjectId(alumni_id)}) if ObjectId.is_valid(alumni_id) else None
                if user_doc:
                    alumni_name = user_doc.get("email", "").split("@")[0].capitalize()
            
            req_data["student_name"] = student_name
            req_data["alumni_name"] = alumni_name
            responses.append(MentorshipResponse(**req_data))
            
        return responses

    @staticmethod
    async def update_request_status(alumni_id: str, request_id: str, update: MentorshipStatusUpdate) -> MentorshipResponse:
        req = await MentorshipRepository.get_request_by_id(request_id)
        if not req:
            raise HTTPException(status_code=404, detail="Request not found.")
            
        if req.alumni_id != alumni_id:
            raise HTTPException(status_code=403, detail="Not authorized to update this request.")
            
        await MentorshipRepository.update_status(request_id, update.status)
        req.status = update.status
        return MentorshipResponse(**req.model_dump())

    @staticmethod
    async def toggle_opt_in(alumni_id: str, update: OptInUpdate):
        user_query = {"_id": ObjectId(alumni_id)} if ObjectId.is_valid(alumni_id) else {"id": alumni_id}
        await mongodb.database[Collections.USERS].update_one(
            user_query,
            {"$set": {"is_mentor": update.is_mentor}}
        )
        # Also sync to alumni_profiles collection
        await mongodb.database[Collections.ALUMNI_PROFILES].update_one(
            {"user_id": alumni_id},
            {"$set": {"is_mentor": update.is_mentor}}
        )
        return {"message": "Mentor status updated.", "is_mentor": update.is_mentor}

    @staticmethod
    async def get_opt_in_status(alumni_id: str):
        user_query = {"_id": ObjectId(alumni_id)} if ObjectId.is_valid(alumni_id) else {"id": alumni_id}
        user = await mongodb.database[Collections.USERS].find_one(user_query)
        if not user:
            profile = await mongodb.database[Collections.ALUMNI_PROFILES].find_one({"user_id": alumni_id})
            if profile:
                return {"is_mentor": profile.get("is_mentor", False)}
            raise HTTPException(status_code=404, detail="User not found.")
        return {"is_mentor": user.get("is_mentor", False)}
