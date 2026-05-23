# app/schemas.py
from pydantic import BaseModel, EmailStr
from datetime import datetime, date, time
from typing import Optional

class StudentCreate(BaseModel):
    student_id: str
    name: str
    email: EmailStr
    department: str
    year: int
    phone: Optional[str] = None

class StudentResponse(BaseModel):
    id: int
    student_id: str
    name: str
    email: EmailStr
    department: str
    year: int
    phone: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

class AttendanceRecord(BaseModel):
    student_id: int
    date: date
    time: time
    
class TokenData(BaseModel):
    username: Optional[str] = None