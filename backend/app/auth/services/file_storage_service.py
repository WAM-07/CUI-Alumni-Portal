import os
import uuid
import cloudinary.uploader
from fastapi import UploadFile
from app.database import cloudinary_config
from app.core.config import settings

class FileStorageService:

    @staticmethod
    async def upload_cv(file: UploadFile):
        if settings.CLOUDINARY_API_KEY and settings.CLOUDINARY_API_KEY != "123456789012345" and settings.CLOUDINARY_CLOUD_NAME != "demo":
            try:
                result = cloudinary.uploader.upload(
                    file.file,
                    resource_type="raw",
                    folder="alumni_portal"
                )
                return {
                    "file_url": result["secure_url"]
                }
            except Exception:
                pass

        # Local storage fallback
        uploads_dir = os.path.join(os.getcwd(), "uploads")
        os.makedirs(uploads_dir, exist_ok=True)
        
        ext = os.path.splitext(file.filename or "")[1] or ".pdf"
        filename = f"{uuid.uuid4().hex}{ext}"
        filepath = os.path.join(uploads_dir, filename)

        await file.seek(0)
        content = await file.read()
        with open(filepath, "wb") as f:
            f.write(content)

        return {
            "file_url": f"http://127.0.0.1:8000/uploads/{filename}"
        }