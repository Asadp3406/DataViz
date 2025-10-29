from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import uvicorn

from models.ml_models import MLModelTrainer
from utils.dataset_loader import DatasetLoader

app = FastAPI(title="Algorithm Visualizer API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://data-viz-zeta.vercel.app",
        "https://*.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


dataset_loader = DatasetLoader()
model_trainer = MLModelTrainer()


class TrainRequest(BaseModel):
    algorithm: str
    dataset: str
    parameters: Dict[str, Any]


@app.get("/")
def read_root():
    return {"message": "Algorithm Visualizer API", "status": "running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/datasets")
def get_datasets():
    """Get available datasets"""
    return {
        "datasets": [
            {"id": "moons", "name": "Moons", "type": "classification"},
            {"id": "circles", "name": "Circles", "type": "classification"},
            {"id": "iris", "name": "Iris", "type": "classification"},
            {"id": "linear", "name": "Linear", "type": "regression"}
        ]
    }


@app.get("/algorithms")
def get_algorithms():
    """Get available algorithms with their parameters"""
    return {
        "algorithms": [
            {
                "id": "logistic_regression",
                "name": "Logistic Regression",
                "type": "classification",
                "parameters": [
                    {"name": "C", "type": "slider", "min": 0.01, "max": 10, "default": 1.0, "step": 0.1},
                    {"name": "max_iter", "type": "slider", "min": 100, "max": 2000, "default": 200, "step": 100},
                    {"name": "solver", "type": "dropdown", "options": ["lbfgs", "liblinear", "newton-cg", "sag", "saga"], "default": "lbfgs"},
                    {"name": "penalty", "type": "dropdown", "options": ["l2", "none"], "default": "l2"},
                    {"name": "tol", "type": "slider", "min": 0.0001, "max": 0.01, "default": 0.0001, "step": 0.0001}
                ]
            },
            {
                "id": "knn",
                "name": "K-Nearest Neighbors",
                "type": "classification",
                "parameters": [
                    {"name": "n_neighbors", "type": "slider", "min": 1, "max": 30, "default": 5, "step": 1},
                    {"name": "weights", "type": "dropdown", "options": ["uniform", "distance"], "default": "uniform"},
                    {"name": "algorithm", "type": "dropdown", "options": ["auto", "ball_tree", "kd_tree", "brute"], "default": "auto"},
                    {"name": "leaf_size", "type": "slider", "min": 10, "max": 50, "default": 30, "step": 5},
                    {"name": "p", "type": "slider", "min": 1, "max": 3, "default": 2, "step": 1}
                ]
            },
            {
                "id": "decision_tree",
                "name": "Decision Tree",
                "type": "classification",
                "parameters": [
                    {"name": "max_depth", "type": "slider", "min": 1, "max": 30, "default": 5, "step": 1},
                    {"name": "min_samples_split", "type": "slider", "min": 2, "max": 20, "default": 2, "step": 1},
                    {"name": "min_samples_leaf", "type": "slider", "min": 1, "max": 20, "default": 1, "step": 1},
                    {"name": "criterion", "type": "dropdown", "options": ["gini", "entropy", "log_loss"], "default": "gini"},
                    {"name": "splitter", "type": "dropdown", "options": ["best", "random"], "default": "best"},
                    {"name": "max_features", "type": "dropdown", "options": ["sqrt", "log2", "None"], "default": "None"}
                ]
            },
            {
                "id": "random_forest",
                "name": "Random Forest",
                "type": "classification",
                "parameters": [
                    {"name": "n_estimators", "type": "slider", "min": 10, "max": 300, "default": 100, "step": 10},
                    {"name": "max_depth", "type": "slider", "min": 1, "max": 30, "default": 10, "step": 1},
                    {"name": "min_samples_split", "type": "slider", "min": 2, "max": 20, "default": 2, "step": 1},
                    {"name": "min_samples_leaf", "type": "slider", "min": 1, "max": 10, "default": 1, "step": 1},
                    {"name": "criterion", "type": "dropdown", "options": ["gini", "entropy", "log_loss"], "default": "gini"},
                    {"name": "max_features", "type": "dropdown", "options": ["sqrt", "log2", "None"], "default": "sqrt"},
                    {"name": "bootstrap", "type": "dropdown", "options": ["True", "False"], "default": "True"}
                ]
            },
            {
                "id": "svm",
                "name": "Support Vector Machine",
                "type": "classification",
                "parameters": [
                    {"name": "C", "type": "slider", "min": 0.01, "max": 100, "default": 1.0, "step": 0.5},
                    {"name": "kernel", "type": "dropdown", "options": ["linear", "rbf", "poly", "sigmoid"], "default": "rbf"},
                    {"name": "gamma", "type": "dropdown", "options": ["scale", "auto"], "default": "scale"},
                    {"name": "degree", "type": "slider", "min": 2, "max": 5, "default": 3, "step": 1},
                    {"name": "tol", "type": "slider", "min": 0.0001, "max": 0.01, "default": 0.001, "step": 0.0001},
                    {"name": "max_iter", "type": "slider", "min": 100, "max": 2000, "default": 1000, "step": 100}
                ]
            },
            {
                "id": "linear_regression",
                "name": "Linear Regression",
                "type": "regression",
                "parameters": [
                    {"name": "fit_intercept", "type": "dropdown", "options": ["True", "False"], "default": "True"},
                    {"name": "positive", "type": "dropdown", "options": ["False", "True"], "default": "False"}
                ]
            }
        ]
    }


@app.post("/train")
async def train_model(request: TrainRequest):
    """Train model and return visualization data"""
    try:
        # Load dataset
        X, y = dataset_loader.load_dataset(request.dataset)
        
        # Train model
        result = model_trainer.train(
            algorithm=request.algorithm,
            X=X,
            y=y,
            parameters=request.parameters
        )
        
        return result
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
