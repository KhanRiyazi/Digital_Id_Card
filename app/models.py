# app/models.py
from sqlalchemy import Column, Integer, String, DateTime, Date, Time, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class Student(Base):
    __tablename__ = "students"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String, unique=True, index=True)
    name = Column(String)
    email = Column(String, unique=True)
    department = Column(String)
    year = Column(Integer)
    phone = Column(String)
    photo_path = Column(String)
    id_card_path = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    attendances = relationship("Attendance", back_populates="student")
    face_encoding = relationship("FaceEncoding", back_populates="student", uselist=False)

class FaceEncoding(Base):
    __tablename__ = "face_encodings"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), unique=True)
    encoding = Column(Text)  # Store as bytes/text
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    student = relationship("Student", back_populates="face_encoding")

class Attendance(Base):
    __tablename__ = "attendance"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    date = Column(Date)
    time = Column(Time)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    student = relationship("Student", back_populates="attendances")