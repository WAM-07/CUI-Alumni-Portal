from app.database import mongodb
from bson import ObjectId
from app.mentorship.models.mentorship import MentorshipRequestModel
from app.database.collections import Collections
from datetime import datetime, timezone

class MentorshipRepository:

    @staticmethod
    async def create_request(request: MentorshipRequestModel) -> str:
        req_dict = request.model_dump()
        result = await mongodb.database[Collections.MENTORSHIPS].insert_one(req_dict)
        return str(result.inserted_id)

    @staticmethod
    async def get_requests_by_student(student_id: str) -> list[MentorshipRequestModel]:
        cursor = mongodb.database[Collections.MENTORSHIPS].find({"student_id": student_id})
        requests = await cursor.to_list(length=100)
        result = []
        for doc in requests:
            doc["id"] = str(doc.pop("_id"))
            result.append(MentorshipRequestModel(**doc))
        return result

    @staticmethod
    async def get_requests_by_alumni(alumni_id: str) -> list[MentorshipRequestModel]:
        cursor = mongodb.database[Collections.MENTORSHIPS].find({"alumni_id": alumni_id})
        requests = await cursor.to_list(length=100)
        result = []
        for doc in requests:
            doc["id"] = str(doc.pop("_id"))
            result.append(MentorshipRequestModel(**doc))
        return result

    @staticmethod
    async def get_request_by_id(request_id: str) -> MentorshipRequestModel | None:
        doc = await mongodb.database[Collections.MENTORSHIPS].find_one({"_id": ObjectId(request_id)})
        if doc:
            doc["id"] = str(doc.pop("_id"))
            return MentorshipRequestModel(**doc)
        return None

    @staticmethod
    async def update_status(request_id: str, status: str):
        await mongodb.database[Collections.MENTORSHIPS].update_one(
            {"_id": ObjectId(request_id)},
            {"$set": {"status": status, "updated_at": datetime.now(timezone.utc)}}
        )
