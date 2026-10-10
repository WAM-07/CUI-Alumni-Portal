from fastapi import APIRouter, Depends, HTTPException, status
from app.auth.dependensies import get_current_user
from app.auth.models.user import User
from app.mentorship.schemas.mentorship_schema import (
    MentorshipRequestCreate, MentorshipStatusUpdate, 
    MentorshipResponse, MentorProfile, OptInUpdate
)
from app.mentorship.services.mentorship_services import MentorshipService
from app.core.constants import Roles

router = APIRouter(
    prefix="/mentorship",
    tags=["Mentorship"]
)

@router.get("/mentors", response_model=list[MentorProfile])
async def get_mentors(user: User = Depends(get_current_user)):
    return await MentorshipService.get_mentors()

@router.post("/requests", response_model=MentorshipResponse)
async def create_request(request: MentorshipRequestCreate, user: User = Depends(get_current_user)):
    if user.role != Roles.STUDENT:
        raise HTTPException(status_code=403, detail="Only students can send mentorship requests.")
    return await MentorshipService.create_request(user.id, request)

@router.get("/requests/me", response_model=list[MentorshipResponse])
async def get_my_requests(user: User = Depends(get_current_user)):
    return await MentorshipService.get_my_requests(user.id, user.role)

@router.put("/requests/{request_id}/status", response_model=MentorshipResponse)
async def update_request_status(request_id: str, update: MentorshipStatusUpdate, user: User = Depends(get_current_user)):
    if user.role != Roles.ALUMNI:
        raise HTTPException(status_code=403, detail="Only alumni can update mentorship requests.")
    return await MentorshipService.update_request_status(user.id, request_id, update)

@router.put("/opt-in")
async def toggle_opt_in(update: OptInUpdate, user: User = Depends(get_current_user)):
    if user.role != Roles.ALUMNI:
        raise HTTPException(status_code=403, detail="Only alumni can opt-in to mentorship.")
    return await MentorshipService.toggle_opt_in(user.id, update)

@router.get("/opt-in/status")
async def get_opt_in_status(user: User = Depends(get_current_user)):
    if user.role != Roles.ALUMNI:
        raise HTTPException(status_code=403, detail="Only alumni can view opt-in status.")
    return await MentorshipService.get_opt_in_status(user.id)
