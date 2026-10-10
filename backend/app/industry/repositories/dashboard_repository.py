from app.database import mongodb
from app.database.collections import Collections

class DashboardRepository:
    
    @staticmethod
    async def get_industry_stats(company_id: str) -> dict:
        jobs_cursor = mongodb.database[Collections.JOBS].find({"company_id": company_id}, {"_id": 1})
        jobs = await jobs_cursor.to_list(length=None)
        
        jobs_count = len(jobs)
        job_ids = [str(job["_id"]) for job in jobs]
        
        total_applicants = await mongodb.database[Collections.APPLICATIONS].count_documents({"job_id": {"$in": job_ids}})
        
        return {
            "total_jobs": jobs_count,
            "total_applicants": total_applicants
        }
