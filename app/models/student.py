from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base

class Student(Base):
    __tablename__ = "students"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String, unique=True, index=True)
    name = Column(String, index=True)
    date_of_birth = Column(String)
    grade = Column(String)
    parent_phone = Column(String)
    parent_email = Column(String)
    address = Column(String)
    
    # Academic metrics
    attendance = Column(Float, default=85.0)
    exam_score = Column(Float, default=70.0)
    previous_achievements = Column(Float, default=70.0)
    
    # Lifestyle metrics
    sleep_hours = Column(Float, default=7.0)
    extracurricular_hours = Column(Float, default=4.0)
    stress_level = Column(Integer, default=5)
    social_support = Column(Integer, default=6)
    family_income_level = Column(Integer, default=3)
    
    # Welfare score
    wellness_score = Column(Float, default=70.0)
    risk_level = Column(String, default="Moderate")
    recommendations = Column(String)
    
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())