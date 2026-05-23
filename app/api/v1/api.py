from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, prediction, training, analytics

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(prediction.router, prefix="/prediction", tags=["prediction"])
api_router.include_router(training.router, prefix="/training", tags=["training"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])