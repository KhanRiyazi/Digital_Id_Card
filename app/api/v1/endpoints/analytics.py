from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.models.student import Student

router = APIRouter()

@router.get("/stats")
def get_analytics(db: Session = Depends(get_db)):
    total_students = db.query(Student).count()
    
    # Risk distribution
    risk_distribution = db.query(
        Student.risk_level, func.count(Student.id)
    ).group_by(Student.risk_level).all()
    
    # Average metrics
    avg_wellness = db.query(func.avg(Student.wellness_score)).scalar() or 0
    avg_attendance = db.query(func.avg(Student.attendance)).scalar() or 0
    avg_exam_score = db.query(func.avg(Student.exam_score)).scalar() or 0
    
    return {
        "total_students": total_students,
        "avg_wellness": round(avg_wellness, 1),
        "avg_attendance": round(avg_attendance, 1),
        "avg_exam_score": round(avg_exam_score, 1),
        "risk_distribution": [{"level": r[0], "count": r[1]} for r in risk_distribution]
    }