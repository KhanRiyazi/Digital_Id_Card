from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, String
from sqlalchemy.sql import func
from app.core.database import Base

class Prediction(Base):
    __tablename__ = "predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    wellness_score = Column(Float)
    risk_level = Column(String)
    recommendations = Column(String)
    input_data = Column(String)  # JSON string of input features
    created_at = Column(DateTime(timezone=True), server_default=func.now())