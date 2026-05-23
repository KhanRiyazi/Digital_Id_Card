from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class StudentBase(BaseModel):
    name: str
    date_of_birth: Optional[str] = None
    grade: str
    parent_phone: Optional[str] = None
    parent_email: Optional[str] = None
    address: Optional[str] = None
    attendance: float = 85.0
    exam_score: float = 70.0
    previous_achievements: float = 70.0
    sleep_hours: float = 7.0
    extracurricular_hours: float = 4.0
    stress_level: int = 5
    social_support: int = 6
    family_income_level: int = 3

class StudentCreate(StudentBase):
    pass

class StudentUpdate(BaseModel):
    name: Optional[str] = None
    grade: Optional[str] = None
    attendance: Optional[float] = None
    exam_score: Optional[float] = None
    sleep_hours: Optional[float] = None
    stress_level: Optional[int] = None
    social_support: Optional[int] = None

class StudentResponse(StudentBase):
    id: int
    student_id: str
    wellness_score: float
    risk_level: str
    recommendations: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True