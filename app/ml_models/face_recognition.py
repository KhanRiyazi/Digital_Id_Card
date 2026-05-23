# app/ml_models/face_recognition.py
import cv2
import numpy as np
from deepface import DeepFace
import face_recognition
from sqlalchemy.orm import Session
from app.models import FaceEncoding, Student
import pickle

class FaceRecognizer:
    def __init__(self):
        self.model_name = "Facenet"
        self.detector_backend = "opencv"
        self.tolerance = 0.6
        
    def extract_face_encoding(self, image_path):
        """Extract face encoding from image"""
        try:
            # Using deepface for better accuracy
            embedding = DeepFace.represent(
                img_path=image_path,
                model_name=self.model_name,
                detector_backend=self.detector_backend,
                enforce_detection=True
            )
            if embedding:
                return np.array(embedding[0]['embedding'])
        except Exception as e:
            print(f"Face extraction error: {e}")
            return None
    
    def recognize_face(self, image_path, db: Session):
        """Recognize face from image by comparing with database"""
        try:
            # Extract encoding from input image
            input_encoding = self.extract_face_encoding(image_path)
            if input_encoding is None:
                return None
            
            # Get all face encodings from database
            face_records = db.query(FaceEncoding).all()
            
            best_match = None
            best_distance = float('inf')
            
            for record in face_records:
                db_encoding = np.frombuffer(record.encoding, dtype=np.float64)
                # Calculate Euclidean distance
                distance = np.linalg.norm(input_encoding - db_encoding)
                
                if distance < self.tolerance and distance < best_distance:
                    best_distance = distance
                    best_match = record.student_id
            
            return best_match
            
        except Exception as e:
            print(f"Face recognition error: {e}")
            return None
    
    def compare_faces(self, face1_path, face2_path):
        """Compare two faces and return similarity score"""
        try:
            result = DeepFace.verify(
                img1_path=face1_path,
                img2_path=face2_path,
                model_name=self.model_name
            )
            return {
                "verified": result['verified'],
                "distance": result['distance'],
                "similarity": 1 - result['distance']
            }
        except Exception as e:
            print(f"Face comparison error: {e}")
            return None