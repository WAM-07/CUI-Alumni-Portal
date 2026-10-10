from typing import Optional, List
from fastapi import HTTPException, status
from app.alumni.repositories.post_repository import PostRepository
from app.alumni.models.post import Post
from app.alumni.schemas.feed_schema import FeedResponse
from app.alumni.schemas.post_schema import PostResponse


class FeedService:

    @staticmethod
    async def get_feed(
        post_type: Optional[str] = None,
        author_role: Optional[str] = None,
        search: Optional[str] = None,
        page: int = 1,
        limit: int = 20,
        public_only: bool = False
    ) -> FeedResponse:
        roles: Optional[List[str]] = [author_role] if author_role else ["alumni", "industry"]
        skip = (page - 1) * limit

        posts = await PostRepository.get_feed(
            roles=roles,
            post_type=post_type,
            search=search,
            limit=limit,
            skip=skip,
            public_only=public_only
        )
        total = await PostRepository.count_feed(
            roles=roles,
            post_type=post_type,
            search=search,
            public_only=public_only
        )

        post_responses = [PostResponse(**post.model_dump()) for post in posts]
        has_more = (skip + len(posts)) < total

        return FeedResponse(
            posts=post_responses,
            total=total,
            page=page,
            limit=limit,
            has_more=has_more
        )

    @staticmethod
    async def get_feed_post(post_id: str) -> PostResponse:
        post = await PostRepository.get_by_id(post_id)
        if not post or not post.is_public:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Post not found in community feed"
            )
        return PostResponse(**post.model_dump())

    @staticmethod
    async def toggle_save_post(post_id: str, current_entity: dict, save: bool) -> dict:
        from app.database import mongodb
        from app.database.collections import Collections
        from bson import ObjectId

        role = current_entity.get("role")
        user_id = current_entity.get("id")
        
        # Verify post exists
        post = await PostRepository.get_by_id(post_id)
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")

        collection = Collections.STUDENTS if role == "student" else Collections.USERS
        
        # For MongoDB query
        try:
            obj_id = ObjectId(user_id)
        except Exception:
            obj_id = user_id # In case string ids are used directly in test cases

        update_op = {"$addToSet": {"saved_posts": post_id}} if save else {"$pull": {"saved_posts": post_id}}

        result = await mongodb.database[collection].update_one(
            {"_id": obj_id},
            update_op
        )

        # Handle hardcoded test user bypass where _id might not match ObjectId correctly
        if result.matched_count == 0 and isinstance(user_id, str) and not isinstance(obj_id, str):
            result = await mongodb.database[collection].update_one(
                {"id": user_id}, # Fallback
                update_op
            )

        return {"message": f"Post {'saved' if save else 'unsaved'} successfully"}

    @staticmethod
    async def get_saved_posts(current_entity: dict, page: int = 1, limit: int = 20) -> FeedResponse:
        from app.database import mongodb
        from app.database.collections import Collections
        from bson import ObjectId

        role = current_entity.get("role")
        user_id = current_entity.get("id")
        
        collection = Collections.STUDENTS if role == "student" else Collections.USERS
        
        try:
            obj_id = ObjectId(user_id)
        except Exception:
            obj_id = user_id
            
        user = await mongodb.database[collection].find_one({"_id": obj_id})
        if not user and isinstance(user_id, str):
            user = await mongodb.database[collection].find_one({"id": user_id})
            
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
            
        saved_post_ids = user.get("saved_posts", [])
        if not saved_post_ids:
            return FeedResponse(posts=[], total=0, page=page, limit=limit, has_more=False)
            
        skip = (page - 1) * limit
        paginated_ids = saved_post_ids[::-1][skip:skip+limit] # reverse to show newest saves first
        
        posts = []
        for pid in paginated_ids:
            post = await PostRepository.get_by_id(pid)
            if post:
                posts.append(PostResponse(**post.model_dump()))
                
        return FeedResponse(
            posts=posts,
            total=len(saved_post_ids),
            page=page,
            limit=limit,
            has_more=(skip + limit) < len(saved_post_ids)
        )
