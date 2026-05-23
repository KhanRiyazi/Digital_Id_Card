from fastapi import APIRouter, HTTPException
from app.core.ml_pipeline import predictor
import pandas as pd
import numpy as np

router = APIRouter()

@router.post("/train")
def train_model():
    try:
        # Generate sample training data
        np.random.seed(42)
        n_samples = 1000
        
        training_features = np.random.rand(n_samples, 8)
        training_features[:, 0] = training_features[:, 0] * 100  # attendance
        training_features[:, 1] = training_features[:, 1] * 100  # exam_score
        training_features[:, 2] = training_features[:, 2] * 10   # sleep_hours
        training_features[:, 3] = training_features[:, 3] * 12   # extracurricular
        training_features[:, 4] = training_features[:, 4] * 10   # stress
        training_features[:, 5] = training_features[:, 5] * 10   # social
        training_features[:, 6] = training_features[:, 6] * 5    # income
        training_features[:, 7] = training_features[:, 7] * 100  # achievements
        
        wellness_labels = (
            training_features[:, 0] * 0.25 +
            training_features[:, 1] * 0.20 +
            training_features[:, 2] * 2.5 +
            training_features[:, 3] * 1.5 +
            (10 - training_features[:, 4]) * 2.5 +
            training_features[:, 5] * 1.5 +
            training_features[:, 6] * 2 +
            training_features[:, 7] * 0.15
        )
        wellness_labels = np.clip(wellness_labels, 20, 100)
        
        training_data = {
            'features': training_features,
            'labels': wellness_labels
        }
        
        predictor.train_model(training_data)
        return {"message": "Model trained successfully", "samples": n_samples}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))