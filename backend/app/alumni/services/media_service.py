import os
import uuid
from fastapi import UploadFile, HTTPException
import cloudinary.uploader
from app.database import cloudinary_config
from app.core.config import settings


class MediaService:

    @staticmethod
    async def upload_image(file: UploadFile, folder: str = "alumni_portal/posts") -> str:
        if file.content_type and not (
            file.content_type.startswith("image/") or
            file.content_type in ["application/pdf", "image/jpeg", "image/png", "image/webp", "image/gif"]
        ):
            raise HTTPException(status_code=400, detail="Only image and document files are supported")

        # Try Cloudinary if real credentials provided
        if settings.CLOUDINARY_API_KEY and settings.CLOUDINARY_API_KEY != "123456789012345" and settings.CLOUDINARY_CLOUD_NAME != "demo":
            try:
                result = cloudinary.uploader.upload(
                    file.file,
                    resource_type="auto",
                    folder=folder
                )
                url = result.get("secure_url") or result.get("url")
                if url:
                    return url
            except Exception:
                pass # Fallback to local storage

        # Local storage fallback
        uploads_dir = os.path.join(os.getcwd(), "uploads")
        os.makedirs(uploads_dir, exist_ok=True)
        
        ext = os.path.splitext(file.filename or "")[1] or ".png"
        filename = f"{uuid.uuid4().hex}{ext}"
        filepath = os.path.join(uploads_dir, filename)

        await file.seek(0)
        content = await file.read()
        with open(filepath, "wb") as f:
            f.write(content)

        return f"http://127.0.0.1:8000/uploads/{filename}"
