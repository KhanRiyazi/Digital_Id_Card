import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import joblib
import os

class StudentWelfarePredictor:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.model_path = "app/ml_models/saved_models/welfare_model.pkl"
        self.scaler_path = "app/ml_models/saved_models/scaler.pkl"
        self.load_model()
    
    def load_model(self):
        if os.path.exists(self.model_path):
            self.model = joblib.load(self.model_path)
            self.scaler = joblib.load(self.scaler_path)
        else:
            self.model = RandomForestRegressor(n_estimators=100, random_state=42)
    
    def predict_wellness(self, features: dict):
        input_data = np.array([[
            features.get('attendance', 85),
            features.get('exam_score', 70),
            features.get('sleep_hours', 7),
            features.get('extracurricular_hours', 4),
            features.get('stress_level', 5),
            features.get('social_support', 6),
            features.get('family_income_level', 3),
            features.get('previous_achievements', 70)
        ]])
        
        # For demo, use weighted formula if model not trained
        if self.model is None or not hasattr(self.model, 'predict'):
            wellness = self._calculate_wellness_score(features)
        else:
            scaled_input = self.scaler.transform(input_data)
            wellness = self.model.predict(scaled_input)[0]
        
        return max(20, min(100, round(wellness)))
    
    def _calculate_wellness_score(self, features):
        attendance_weight = features.get('attendance', 85) / 100 * 25
        exam_weight = features.get('exam_score', 70) / 100 * 20
        sleep_weight = min(25, (features.get('sleep_hours', 7) / 9) * 25)
        extra_weight = min(15, (features.get('extracurricular_hours', 4) / 8) * 15)
        stress_weight = max(0, 25 - (features.get('stress_level', 5) * 2.5))
        social_weight = features.get('social_support', 6) / 10 * 15
        
        return attendance_weight + exam_weight + sleep_weight + extra_weight + stress_weight + social_weight
    
    def train_model(self, training_data):
        X = training_data['features']
        y = training_data['labels']
        X_scaled = self.scaler.fit_transform(X)
        self.model.fit(X_scaled, y)
        joblib.dump(self.model, self.model_path)
        joblib.dump(self.scaler, self.scaler_path)

predictor = StudentWelfarePredictor()