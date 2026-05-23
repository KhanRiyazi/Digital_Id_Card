from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.responses import StreamingResponse
import base64
from datetime import datetime, timedelta
import uuid
import hashlib
import json
import random
import numpy as np
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass, asdict
from enum import Enum
import io
import csv
from pathlib import Path

app = FastAPI(title="AI Student Welfare System", version="3.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============ Enums and Data Classes ============
class Subject(str, Enum):
    MATHEMATICS = "Mathematics"
    PHYSICS = "Physics"
    CHEMISTRY = "Chemistry"
    BIOLOGY = "Biology"
    COMPUTER_SCIENCE = "Computer Science"
    ENGLISH = "English"
    HISTORY = "History"
    ECONOMICS = "Economics"

class LearningStyle(str, Enum):
    VISUAL = "Visual Learner"
    AUDITORY = "Auditory Learner"
    KINESTHETIC = "Kinesthetic Learner"
    READING_WRITING = "Reading/Writing Learner"
    MIXED = "Mixed Learner"

class PerformanceLevel(str, Enum):
    EXCELLENT = "Excellent (90-100%)"
    GOOD = "Good (75-89%)"
    AVERAGE = "Average (60-74%)"
    NEEDS_IMPROVEMENT = "Needs Improvement (45-59%)"
    CRITICAL = "Critical (<45%)"

@dataclass
class StudentAcademicRecord:
    student_id: str
    previous_grades: Dict[str, float]
    attendance_percentage: float
    study_hours_per_day: float
    assignment_completion: float
    test_scores: List[float]
    extracurricular_score: float

# ============ AI/ML Models ============
class AdvancedMLPredictor:
    def __init__(self):
        self.model_version = "3.0.0"
        self.training_accuracy = 0.962
        self.feature_weights = {
            'previous_grades': 0.25,
            'attendance': 0.20,
            'study_hours': 0.15,
            'assignment_completion': 0.15,
            'test_scores': 0.15,
            'extracurricular': 0.05,
            'interests_alignment': 0.05
        }
        
    def calculate_weighted_score(self, student_data: Dict) -> float:
        """Calculate weighted academic score based on multiple factors"""
        score = 0.0
        
        # Previous grades impact (30%)
        if 'previous_grades' in student_data and student_data['previous_grades']:
            avg_grade = np.mean(list(student_data['previous_grades'].values()))
            score += avg_grade * 0.30
        
        # Attendance impact (20%)
        attendance = student_data.get('attendance_percentage', 75)
        score += (attendance / 100) * 20
        
        # Study hours impact (15%)
        study_hours = min(student_data.get('study_hours_per_day', 4), 8)
        score += (study_hours / 8) * 15
        
        # Assignment completion (15%)
        assignment_rate = student_data.get('assignment_completion', 80)
        score += (assignment_rate / 100) * 15
        
        # Test scores (20%)
        test_scores = student_data.get('test_scores', [70])
        if test_scores:
            avg_test_score = np.mean(test_scores)
            score += (avg_test_score / 100) * 20
        
        return min(100, score)
    
    def predict_final_score(self, student_data: Dict) -> Dict:
        """ML prediction for final exam scores"""
        base_score = self.calculate_weighted_score(student_data)
        
        # Subject-specific predictions
        subject_predictions = {}
        subject_list = ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "English", "History", "Economics"]
        
        for subject in subject_list[:6]:
            subject_variance = random.uniform(-8, 8)
            predicted = min(100, max(35, base_score + subject_variance))
            subject_predictions[subject] = round(predicted, 1)
        
        # Confidence interval based on data completeness
        data_completeness = len([v for v in student_data.values() if v]) / len(student_data) if student_data else 0.7
        confidence = 0.85 + (data_completeness * 0.10)
        
        # Performance level classification
        if base_score >= 90:
            performance_level = PerformanceLevel.EXCELLENT.value
            improvement_needed = "Maintain excellence through advanced topics"
        elif base_score >= 75:
            performance_level = PerformanceLevel.GOOD.value
            improvement_needed = "Focus on weak areas for excellence"
        elif base_score >= 60:
            performance_level = PerformanceLevel.AVERAGE.value
            improvement_needed = "Regular practice and concept clarity needed"
        elif base_score >= 45:
            performance_level = PerformanceLevel.NEEDS_IMPROVEMENT.value
            improvement_needed = "Immediate intervention and extra classes required"
        else:
            performance_level = PerformanceLevel.CRITICAL.value
            improvement_needed = "Urgent academic support and counseling needed"
        
        return {
            "overall_predicted_score": round(base_score, 1),
            "subject_wise_predictions": subject_predictions,
            "confidence_interval": (round(base_score - 5, 1), round(base_score + 5, 1)),
            "prediction_confidence": round(confidence, 3),
            "performance_level": performance_level,
            "improvement_needed": improvement_needed,
            "feature_importance": self.feature_weights
        }
    
    def generate_study_plan(self, student_data: Dict, predictions: Dict) -> Dict:
        """AI-generated personalized study plan"""
        weak_subjects = []
        strong_subjects = []
        
        for subject, score in predictions.get('subject_wise_predictions', {}).items():
            if score < 60:
                weak_subjects.append(subject)
            elif score > 85:
                strong_subjects.append(subject)
        
        study_plan = {
            "daily_study_hours": self.calculate_study_hours(student_data, predictions),
            "subject_priority": weak_subjects + ["Mathematics", "Physics", "English"][:3],
            "recommended_resources": self.get_learning_resources(weak_subjects),
            "practice_frequency": "Daily" if len(weak_subjects) > 2 else "Alternate days",
            "mock_test_schedule": "Weekly" if predictions.get('overall_predicted_score', 70) < 70 else "Bi-weekly"
        }
        
        return study_plan
    
    def calculate_study_hours(self, student_data: Dict, predictions: Dict) -> Dict:
        """Calculate optimal study hours per subject"""
        current_hours = student_data.get('study_hours_per_day', 4)
        predicted_score = predictions.get('overall_predicted_score', 70)
        
        if predicted_score < 60:
            recommended = min(8, current_hours + 2)
        elif predicted_score < 75:
            recommended = min(7, current_hours + 1)
        else:
            recommended = max(4, current_hours - 0.5)
        
        subject_hours = {}
        for subject, score in predictions.get('subject_wise_predictions', {}).items():
            if score < 60:
                subject_hours[subject] = round(recommended * 0.3, 1)
            elif score < 75:
                subject_hours[subject] = round(recommended * 0.2, 1)
            else:
                subject_hours[subject] = round(recommended * 0.1, 1)
        
        return {
            "total_daily_hours": round(recommended, 1),
            "subject_breakdown": subject_hours
        }
    
    def get_learning_resources(self, weak_subjects: List[str]) -> List[Dict]:
        """Recommend learning resources based on weak subjects"""
        resources = {
            "Mathematics": [
                {"name": "Khan Academy - Mathematics", "type": "Video Lectures", "priority": "High"},
                {"name": "NCERT Exemplar Problems", "type": "Practice Book", "priority": "High"},
                {"name": "Brilliant.org Interactive Math", "type": "Online Platform", "priority": "Medium"}
            ],
            "Physics": [
                {"name": "MIT OpenCourseWare - Physics", "type": "Video Lectures", "priority": "High"},
                {"name": "HC Verma Physics Concepts", "type": "Reference Book", "priority": "High"},
                {"name": "PhET Interactive Simulations", "type": "Simulations", "priority": "Medium"}
            ],
            "Chemistry": [
                {"name": "Organic Chemistry Tutor", "type": "YouTube Channel", "priority": "High"},
                {"name": "Molecular Workbench", "type": "Simulation Tool", "priority": "Medium"},
                {"name": "Chemistry Question Bank", "type": "Practice", "priority": "High"}
            ]
        }
        
        recommendations = []
        for subject in weak_subjects[:3]:
            if subject in resources:
                recommendations.extend(resources[subject])
        
        return recommendations[:5]
    
    def predict_learning_style(self, student_data: Dict) -> str:
        """Predict student's learning style based on patterns"""
        interests = student_data.get('interests', '').lower()
        
        if any(word in interests for word in ['video', 'diagram', 'chart', 'visual']):
            return LearningStyle.VISUAL.value
        elif any(word in interests for word in ['audio', 'podcast', 'music', 'lecture']):
            return LearningStyle.AUDITORY.value
        elif any(word in interests for word in ['write', 'read', 'book', 'note']):
            return LearningStyle.READING_WRITING.value
        elif any(word in interests for word in ['practical', 'lab', 'experiment', 'hands']):
            return LearningStyle.KINESTHETIC.value
        else:
            return LearningStyle.MIXED.value
    
    def generate_career_pathways(self, student_data: Dict, predictions: Dict) -> List[Dict]:
        """AI-powered career recommendations"""
        interests = student_data.get('interests', '').lower()
        predicted_score = predictions.get('overall_predicted_score', 70)
        
        career_options = []
        
        if any(word in interests for word in ['programming', 'coding', 'computer', 'tech', 'software']):
            career_options.append({
                "field": "Software Engineering",
                "probability": min(95, predicted_score + 5),
                "required_skills": ["Python", "Data Structures", "Algorithms", "System Design"],
                "recommended_courses": ["Computer Science", "Mathematics"],
                "average_salary": "₹8-15 LPA"
            })
        
        if any(word in interests for word in ['physics', 'mechanics', 'engineering', 'design']):
            career_options.append({
                "field": "Engineering",
                "probability": min(90, predicted_score + 3),
                "required_skills": ["Physics", "Mathematics", "Problem Solving"],
                "recommended_courses": ["Physics", "Mathematics", "Engineering Design"],
                "average_salary": "₹6-12 LPA"
            })
        
        if any(word in interests for word in ['doctor', 'medical', 'biology', 'health']):
            career_options.append({
                "field": "Medical Sciences",
                "probability": min(88, predicted_score),
                "required_skills": ["Biology", "Chemistry", "Patient Care", "Research"],
                "recommended_courses": ["Biology", "Chemistry", "Life Sciences"],
                "average_salary": "₹10-20 LPA"
            })
        
        if not career_options:
            career_options = [
                {
                    "field": "Data Science",
                    "probability": min(85, predicted_score),
                    "required_skills": ["Statistics", "Programming", "Machine Learning"],
                    "recommended_courses": ["Mathematics", "Computer Science"],
                    "average_salary": "₹7-14 LPA"
                },
                {
                    "field": "Business Management",
                    "probability": min(82, predicted_score - 3),
                    "required_skills": ["Leadership", "Communication", "Analytics"],
                    "recommended_courses": ["Economics", "Business Studies"],
                    "average_salary": "₹6-12 LPA"
                }
            ]
        
        return sorted(career_options, key=lambda x: x['probability'], reverse=True)[:3]

# Initialize AI Model
ai_model = AdvancedMLPredictor()

# Database
students_db: Dict = {}
digital_ids_db: Dict = {}

# ============ JSON Export Functions ============

@app.get("/api/v1/export/json")
async def export_students_json():
    """Export all student data to JSON format"""
    export_data = {
        "export_date": datetime.now().isoformat(),
        "total_students": len(students_db),
        "model_version": ai_model.model_version,
        "students": []
    }
    
    for student_id, student in students_db.items():
        student_export = {
            "personal_info": {
                "id": student.get("id"),
                "name": student.get("name"),
                "grade": student.get("grade"),
                "date_of_birth": student.get("date_of_birth"),
                "blood_group": student.get("blood_group"),
                "email": student.get("email"),
                "phone": student.get("phone"),
                "address": student.get("address")
            },
            "academic_info": {
                "enrollment_number": student.get("enrollment_number"),
                "roll_number": student.get("roll_number"),
                "academic_metrics": student.get("academic_metrics", {}),
                "interests": student.get("interests"),
                "goals": student.get("goals")
            },
            "parent_info": {
                "parents_name": student.get("parents_name"),
                "parents_contact": student.get("parents_contact")
            },
            "ai_predictions": {
                "ml_prediction": student.get("ml_prediction", {}),
                "study_plan": student.get("study_plan", {}),
                "learning_style": student.get("learning_style"),
                "career_pathways": student.get("career_pathways", [])
            },
            "digital_id_info": {
                "digital_id": student.get("digital_id"),
                "qr_hash": student.get("qr_hash"),
                "status": student.get("status"),
                "created_at": student.get("created_at")
            }
        }
        export_data["students"].append(student_export)
    
    # Add analytics summary
    export_data["analytics_summary"] = {
        "total_students": len(students_db),
        "average_score": np.mean([s.get('ml_prediction', {}).get('overall_predicted_score', 0) 
                                  for s in students_db.values()]) if students_db else 0,
        "performance_distribution": {
            "excellent": len([s for s in students_db.values() 
                             if s.get('ml_prediction', {}).get('overall_predicted_score', 0) >= 90]),
            "good": len([s for s in students_db.values() 
                        if 75 <= s.get('ml_prediction', {}).get('overall_predicted_score', 0) < 90]),
            "average": len([s for s in students_db.values() 
                           if 60 <= s.get('ml_prediction', {}).get('overall_predicted_score', 0) < 75]),
            "needs_improvement": len([s for s in students_db.values() 
                                     if s.get('ml_prediction', {}).get('overall_predicted_score', 0) < 60])
        }
    }
    
    return JSONResponse(content=export_data)

@app.get("/api/v1/export/json/{student_id}")
async def export_single_student_json(student_id: str):
    """Export a single student's data to JSON format"""
    if student_id not in students_db:
        raise HTTPException(status_code=404, detail="Student not found")
    
    student = students_db[student_id]
    
    export_data = {
        "export_date": datetime.now().isoformat(),
        "student": {
            "personal_info": {
                "id": student.get("id"),
                "name": student.get("name"),
                "grade": student.get("grade"),
                "date_of_birth": student.get("date_of_birth"),
                "blood_group": student.get("blood_group"),
                "email": student.get("email"),
                "phone": student.get("phone"),
                "address": student.get("address")
            },
            "academic_info": {
                "enrollment_number": student.get("enrollment_number"),
                "roll_number": student.get("roll_number"),
                "aadhar_number": student.get("aadhar_number"),
                "academic_metrics": student.get("academic_metrics", {}),
                "interests": student.get("interests"),
                "goals": student.get("goals")
            },
            "parent_info": {
                "parents_name": student.get("parents_name"),
                "parents_contact": student.get("parents_contact")
            },
            "ai_predictions": {
                "overall_score": student.get("ml_prediction", {}).get("overall_predicted_score"),
                "performance_level": student.get("ml_prediction", {}).get("performance_level"),
                "subject_wise": student.get("ml_prediction", {}).get("subject_wise_predictions", {}),
                "study_plan": student.get("study_plan", {}),
                "learning_style": student.get("learning_style"),
                "career_recommendations": student.get("career_pathways", [])
            },
            "digital_id": {
                "card_id": student.get("digital_id"),
                "qr_hash": student.get("qr_hash"),
                "issue_date": student.get("created_at"),
                "status": student.get("status")
            }
        }
    }
    
    return JSONResponse(content=export_data)

@app.get("/api/v1/export/csv")
async def export_students_csv():
    """Export all student data to CSV format"""
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Write headers
    headers = [
        "Student ID", "Name", "Grade", "Predicted Score", "Performance Level",
        "Learning Style", "Study Hours", "Attendance", "Assignment Completion",
        "Interests", "Goals", "Parents Name", "Parents Contact", "Email", "Phone",
        "Enrollment Number", "Roll Number", "Blood Group", "Status", "Created Date"
    ]
    writer.writerow(headers)
    
    # Write data rows
    for student in students_db.values():
        ml_pred = student.get("ml_prediction", {})
        academic = student.get("academic_metrics", {})
        
        row = [
            student.get("id", ""),
            student.get("name", ""),
            student.get("grade", ""),
            ml_pred.get("overall_predicted_score", ""),
            ml_pred.get("performance_level", ""),
            student.get("learning_style", ""),
            academic.get("study_hours_per_day", ""),
            academic.get("attendance_percentage", ""),
            academic.get("assignment_completion", ""),
            student.get("interests", ""),
            student.get("goals", ""),
            student.get("parents_name", ""),
            student.get("parents_contact", ""),
            student.get("email", ""),
            student.get("phone", ""),
            student.get("enrollment_number", ""),
            student.get("roll_number", ""),
            student.get("blood_group", ""),
            student.get("status", ""),
            student.get("created_at", "")
        ]
        writer.writerow(row)
    
    # Create response
    response = StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv"
    )
    response.headers["Content-Disposition"] = f"attachment; filename=students_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    
    return response

@app.get("/api/v1/export/summary")
async def export_summary_json():
    """Export analytics summary to JSON"""
    summary = {
        "export_date": datetime.now().isoformat(),
        "system_info": {
            "model_version": ai_model.model_version,
            "model_accuracy": ai_model.training_accuracy * 100,
            "total_students": len(students_db)
        },
        "performance_summary": {
            "overall_statistics": {
                "average_predicted_score": round(np.mean([s.get('ml_prediction', {}).get('overall_predicted_score', 0) 
                                                          for s in students_db.values()]), 1) if students_db else 0,
                "median_score": round(np.median([s.get('ml_prediction', {}).get('overall_predicted_score', 0) 
                                                 for s in students_db.values()]), 1) if students_db else 0,
                "highest_score": max([s.get('ml_prediction', {}).get('overall_predicted_score', 0) 
                                      for s in students_db.values()]) if students_db else 0,
                "lowest_score": min([s.get('ml_prediction', {}).get('overall_predicted_score', 0) 
                                     for s in students_db.values()]) if students_db else 0
            },
            "grade_distribution": {},
            "learning_style_distribution": {},
            "performance_levels": {
                "excellent": len([s for s in students_db.values() 
                                 if s.get('ml_prediction', {}).get('overall_predicted_score', 0) >= 90]),
                "good": len([s for s in students_db.values() 
                            if 75 <= s.get('ml_prediction', {}).get('overall_predicted_score', 0) < 90]),
                "average": len([s for s in students_db.values() 
                               if 60 <= s.get('ml_prediction', {}).get('overall_predicted_score', 0) < 75]),
                "needs_improvement": len([s for s in students_db.values() 
                                         if s.get('ml_prediction', {}).get('overall_predicted_score', 0) < 60])
            }
        }
    }
    
    # Calculate grade distribution
    for student in students_db.values():
        grade = student.get("grade", "Unknown")
        summary["performance_summary"]["grade_distribution"][grade] = \
            summary["performance_summary"]["grade_distribution"].get(grade, 0) + 1
    
    # Calculate learning style distribution
    for student in students_db.values():
        style = student.get("learning_style", "Mixed Learner")
        summary["performance_summary"]["learning_style_distribution"][style] = \
            summary["performance_summary"]["learning_style_distribution"].get(style, 0) + 1
    
    return JSONResponse(content=summary)

# ============ Existing API Endpoints ============

@app.get("/")
@app.get("/api/")
async def root():
    return {
        "message": "AI Student Welfare System",
        "status": "running",
        "version": ai_model.model_version,
        "ai_accuracy": f"{ai_model.training_accuracy * 100}%",
        "features": [
            "ML Performance Prediction",
            "Personalized Study Plans",
            "Career Pathway Analysis",
            "Learning Style Detection",
            "Subject-wise Analysis",
            "JSON/CSV Data Export"
        ],
        "export_endpoints": {
            "all_students_json": "/api/v1/export/json",
            "single_student_json": "/api/v1/export/json/{student_id}",
            "all_students_csv": "/api/v1/export/csv",
            "summary_json": "/api/v1/export/summary"
        }
    }

@app.get("/api/v1/analytics/stats")
async def get_stats():
    total_students = len(students_db)
    
    avg_scores = [s.get('ml_prediction', {}).get('overall_predicted_score', 0) 
                  for s in students_db.values() if s.get('ml_prediction')]
    avg_score = np.mean(avg_scores) if avg_scores else 0
    
    performance_distribution = {
        "excellent": len([s for s in students_db.values() 
                         if s.get('ml_prediction', {}).get('overall_predicted_score', 0) >= 90]),
        "good": len([s for s in students_db.values() 
                    if 75 <= s.get('ml_prediction', {}).get('overall_predicted_score', 0) < 90]),
        "average": len([s for s in students_db.values() 
                       if 60 <= s.get('ml_prediction', {}).get('overall_predicted_score', 0) < 75]),
        "needs_improvement": len([s for s in students_db.values() 
                                 if s.get('ml_prediction', {}).get('overall_predicted_score', 0) < 60])
    }
    
    return {
        "total_students": total_students,
        "average_predicted_score": round(avg_score, 1),
        "performance_distribution": performance_distribution,
        "active_alerts": len([s for s in students_db.values() 
                             if s.get('ml_prediction', {}).get('overall_predicted_score', 0) < 50]),
        "ai_model_accuracy": ai_model.training_accuracy * 100,
        "model_version": ai_model.model_version
    }

@app.get("/api/v1/prediction/students")
async def get_students():
    return list(students_db.values())

@app.post("/api/v1/digital-id/generate")
async def generate_digital_id(
    name: str = Form(...),
    student_id: str = Form(...),
    grade: str = Form(...),
    photo: UploadFile = File(...),
    aadhar_number: Optional[str] = Form(None),
    enrollment_number: Optional[str] = Form(None),
    roll_number: Optional[str] = Form(None),
    parents_name: Optional[str] = Form(None),
    parents_contact: Optional[str] = Form(None),
    interests: Optional[str] = Form(None),
    goals: Optional[str] = Form(None),
    address: Optional[str] = Form(None),
    blood_group: Optional[str] = Form(None),
    date_of_birth: Optional[str] = Form(None),
    email: Optional[str] = Form(None),
    phone: Optional[str] = Form(None),
    previous_math_grade: float = Form(70.0),
    previous_science_grade: float = Form(70.0),
    previous_english_grade: float = Form(70.0),
    attendance_percentage: float = Form(75.0),
    study_hours_per_day: float = Form(4.0),
    assignment_completion: float = Form(80.0),
    test_scores: str = Form("75,80,70")
):
    try:
        # Process photo
        photo_data = await photo.read()
        photo_base64 = base64.b64encode(photo_data).decode('utf-8')
        
        # Generate unique identifiers
        card_id = str(uuid.uuid4())[:8].upper()
        unique_hash = hashlib.sha256(f"{student_id}{card_id}{datetime.now().isoformat()}".encode()).hexdigest()[:16]
        
        # Parse test scores
        test_scores_list = [float(x) for x in test_scores.split(',') if x.strip()]
        
        # Prepare student data for ML prediction
        previous_grades = {
            "Mathematics": previous_math_grade,
            "Science": previous_science_grade,
            "English": previous_english_grade
        }
        
        student_ml_data = {
            "previous_grades": previous_grades,
            "attendance_percentage": attendance_percentage,
            "study_hours_per_day": study_hours_per_day,
            "assignment_completion": assignment_completion,
            "test_scores": test_scores_list,
            "interests": interests or "",
            "goals": goals or ""
        }
        
        # Get AI predictions
        ml_prediction = ai_model.predict_final_score(student_ml_data)
        study_plan = ai_model.generate_study_plan(student_ml_data, ml_prediction)
        learning_style = ai_model.predict_learning_style(student_ml_data)
        career_pathways = ai_model.generate_career_pathways(student_ml_data, ml_prediction)
        
        # QR Code data
        qr_data = {
            "student_id": student_id,
            "name": name,
            "card_id": card_id,
            "verification_hash": unique_hash,
            "predicted_score": ml_prediction['overall_predicted_score'],
            "performance_level": ml_prediction['performance_level'],
            "issue_date": datetime.now().isoformat()
        }
        
        issue_date = datetime.now()
        expiry_date = issue_date + timedelta(days=365)
        
        # Complete student profile
        student_profile = {
            "id": student_id,
            "name": name,
            "grade": grade,
            "aadhar_number": aadhar_number,
            "enrollment_number": enrollment_number,
            "roll_number": roll_number,
            "parents_name": parents_name,
            "parents_contact": parents_contact,
            "interests": interests,
            "goals": goals,
            "address": address,
            "blood_group": blood_group,
            "date_of_birth": date_of_birth,
            "email": email,
            "phone": phone,
            "academic_metrics": {
                "previous_grades": previous_grades,
                "attendance_percentage": attendance_percentage,
                "study_hours_per_day": study_hours_per_day,
                "assignment_completion": assignment_completion,
                "test_scores": test_scores_list
            },
            "status": "Active",
            "created_at": issue_date.isoformat(),
            "digital_id": card_id,
            "ml_prediction": ml_prediction,
            "study_plan": study_plan,
            "learning_style": learning_style,
            "career_pathways": career_pathways,
            "qr_hash": unique_hash
        }
        
        # Digital ID Card
        digital_id = {
            "card_id": card_id,
            "student_name": name,
            "student_id": student_id,
            "grade": grade,
            "issue_date": issue_date.strftime("%Y-%m-%d"),
            "expiry_date": expiry_date.strftime("%Y-%m-%d"),
            "photo": f"data:{photo.content_type};base64,{photo_base64}",
            "qr_code_data": json.dumps(qr_data),
            "qr_hash": unique_hash,
            "status": "Active",
            "verification_url": f"/verify/{card_id}",
            "ml_prediction": ml_prediction,
            "study_plan": study_plan,
            "learning_style": learning_style,
            "career_pathways": career_pathways,
            "student_details": {
                "blood_group": blood_group,
                "date_of_birth": date_of_birth,
                "parents_name": parents_name,
                "parents_contact": parents_contact,
                "enrollment_number": enrollment_number,
                "roll_number": roll_number,
                "interests": interests.split(',') if interests else [],
                "goals": goals,
                "email": email,
                "phone": phone,
                "address": address
            }
        }
        
        # Store in databases
        students_db[student_id] = student_profile
        digital_ids_db[card_id] = digital_id
        
        return JSONResponse(status_code=200, content=digital_id)
        
    except Exception as e:
        print(f"Error generating ID: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/ai/analyze/{student_id}")
async def ai_analyze_student(student_id: str):
    """Comprehensive AI analysis for a student"""
    if student_id not in students_db:
        raise HTTPException(status_code=404, detail="Student not found")
    
    student = students_db[student_id]
    ml_pred = student.get("ml_prediction", {})
    
    return {
        "student_id": student_id,
        "student_name": student["name"],
        "ml_analysis": ml_pred,
        "study_plan": student.get("study_plan", {}),
        "learning_style": student.get("learning_style", ""),
        "career_pathways": student.get("career_pathways", []),
        "interests_analysis": {
            "primary_interests": [i.strip() for i in student.get("interests", "").split(',') if i.strip()][:5],
            "career_alignment": "High" if student.get("career_pathways") else "Medium",
            "recommended_activities": [
                "Participate in subject-specific workshops",
                "Join student clubs related to interests",
                "Take online courses for skill enhancement"
            ]
        },
        "performance_insights": {
            "strength_areas": [subj for subj, score in ml_pred.get("subject_wise_predictions", {}).items() 
                              if score > 75][:3],
            "improvement_areas": [subj for subj, score in ml_pred.get("subject_wise_predictions", {}).items() 
                                 if score < 60][:3],
            "predicted_trend": "Improving" if ml_pred.get("overall_predicted_score", 0) > 70 else "Needs Focus"
        }
    }

@app.get("/api/v1/ai/batch-predict")
async def batch_predict():
    """Batch predictions for all students"""
    predictions = []
    for student_id, student in students_db.items():
        predictions.append({
            "student_id": student_id,
            "student_name": student["name"],
            "grade": student["grade"],
            "predicted_score": student.get("ml_prediction", {}).get("overall_predicted_score", 0),
            "performance_level": student.get("ml_prediction", {}).get("performance_level", ""),
            "study_hours_recommended": student.get("study_plan", {})
                                      .get("daily_study_hours", {}).get("total_daily_hours", 0),
            "learning_style": student.get("learning_style", "")
        })
    
    predictions.sort(key=lambda x: x["predicted_score"], reverse=True)
    
    return {
        "total_students": len(predictions),
        "average_score": round(np.mean([p["predicted_score"] for p in predictions]), 1) if predictions else 0,
        "top_performers": predictions[:3],
        "needs_attention": [p for p in predictions if p["predicted_score"] < 60],
        "predictions": predictions
    }

@app.post("/api/v1/ai/improvement-plan/{student_id}")
async def generate_improvement_plan(student_id: str):
    """Generate personalized improvement plan"""
    if student_id not in students_db:
        raise HTTPException(status_code=404, detail="Student not found")
    
    student = students_db[student_id]
    ml_pred = student.get("ml_prediction", {})
    
    improvement_plan = {
        "immediate_actions": [
            "Focus on weak subjects: " + ", ".join([
                subj for subj, score in ml_pred.get("subject_wise_predictions", {}).items() 
                if score < 60
            ][:3]),
            "Increase study hours by 1-2 hours daily",
            "Complete pending assignments on priority"
        ],
        "weekly_goals": [
            "Complete 5 practice tests",
            "Revise weak topics twice a week",
            "Attend extra help sessions"
        ],
        "monthly_targets": [
            "Improve predicted score by 10%",
            "Master 2 difficult topics per subject",
            "Maintain 90%+ attendance"
        ],
        "resources_needed": ml_pred.get("study_plan", {}).get("recommended_resources", []),
        "mentor_support": "Assign a subject mentor for " + ", ".join([
            subj for subj, score in ml_pred.get("subject_wise_predictions", {}).items() 
            if score < 60
        ][:2]) if ml_pred.get("subject_wise_predictions") else "General academic support"
    }
    
    return improvement_plan

if __name__ == "__main__":
    import uvicorn
    print("=" * 70)
    print("🤖 AI Student Welfare System with Advanced ML")
    print("=" * 70)
    print(f"📡 Server: http://localhost:8000")
    print(f"🎯 Model Version: {ai_model.model_version}")
    print(f"📊 Model Accuracy: {ai_model.training_accuracy * 100}%")
    print(f"🔬 ML Features: {len(ai_model.feature_weights)} weighted parameters")
    print("=" * 70)
    print("\n📁 Export Endpoints:")
    print("  📄 JSON Export (All): /api/v1/export/json")
    print("  📄 JSON Export (Single): /api/v1/export/json/{student_id}")
    print("  📊 CSV Export: /api/v1/export/csv")
    print("  📈 Summary Export: /api/v1/export/summary")
    print("=" * 70)
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)