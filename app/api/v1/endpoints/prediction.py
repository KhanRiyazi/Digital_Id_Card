from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.ml_pipeline import predictor
from app.models.student import Student
from app.models.prediction import Prediction
from app.schemas.prediction import PredictionRequest, PredictionResponse
from app.schemas.student import StudentCreate, StudentResponse
import json
import uuid

router = APIRouter()

def get_risk_level(score):
    if score >= 75:
        return "Excellent"
    elif score >= 55:
        return "Moderate"
    elif score >= 35:
        return "At Risk"
    else:
        return "Critical"

def get_recommendations(score, features):
    if score >= 75:
        return "Student is thriving! Encourage leadership roles and peer mentoring."
    elif score >= 55:
        return "Good progress. Focus on consistent sleep schedule and stress management."
    elif score >= 35:
        return "Needs attention. Consider counseling, attendance improvement, and family engagement."
    else:
        return "Immediate intervention required. Contact parents and schedule wellness meeting."

@router.post("/predict", response_model=PredictionResponse)
def predict_wellness(request: PredictionRequest, db: Session = Depends(get_db)):
    features = {
        'attendance': request.attendance,
        'exam_score': request.exam_score,
        'sleep_hours': request.sleep_hours,
        'extracurricular_hours': request.extracurricular_hours,
        'stress_level': request.stress_level,
        'social_support': request.social_support,
        'family_income_level': 3,
        'previous_achievements': request.exam_score
    }
    
    wellness_score = predictor.predict_wellness(features)
    risk_level = get_risk_level(wellness_score)
    recommendations = get_recommendations(wellness_score, features)
    
    return PredictionResponse(
        wellness_score=wellness_score,
        risk_level=risk_level,
        recommendations=recommendations,
        student_id=str(uuid.uuid4())[:8].upper()
    )

@router.post("/register-and-predict", response_model=StudentResponse)
def register_and_predict(student_data: StudentCreate, db: Session = Depends(get_db)):
    features = student_data.dict()
    wellness_score = predictor.predict_wellness(features)
    risk_level = get_risk_level(wellness_score)
    recommendations = get_recommendations(wellness_score, features)
    
    student_id = f"EDU{str(uuid.uuid4())[:8].upper()}"
    
    db_student = Student(
        student_id=student_id,
        **student_data.dict(),
        wellness_score=wellness_score,
        risk_level=risk_level,
        recommendations=recommendations
    )
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    
    return db_student

@router.get("/students", response_model=list[StudentResponse])
def get_all_students(db: Session = Depends(get_db)):
    return db.query(Student).order_by(Student.created_at.desc()).all()

@router.get("/students/{student_id}", response_model=StudentResponse)
def get_student(student_id: str, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.student_id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student