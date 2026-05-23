from pydantic import BaseModel
from typing import Optional

class PredictionRequest(BaseModel):
    name: str
    grade: str
    attendance: float = 85.0
    exam_score: float = 70.0
    sleep_hours: float = 7.0
    extracurricular_hours: float = 4.0
    stress_level: int = 5
    social_support: int = 6

class PredictionResponse(BaseModel):
    wellness_score: float
    risk_level: str
    recommendations: str
    student_id: Optional[str] = None