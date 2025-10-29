import numpy as np
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, mean_squared_error
import json


class MLModelTrainer:
    """Train models and generate visualization data"""
    
    def __init__(self):
        self.models = {
            "logistic_regression": LogisticRegression,
            "knn": KNeighborsClassifier,
            "decision_tree": DecisionTreeClassifier,
            "random_forest": RandomForestClassifier,
            "svm": SVC,
            "linear_regression": LinearRegression
        }
    
    def _process_parameters(self, parameters: dict) -> dict:
        """Convert string parameters to proper Python types"""
        processed = {}
        for key, value in parameters.items():
            # Convert string booleans
            if value == "True":
                processed[key] = True
            elif value == "False":
                processed[key] = False
            # Convert string None
            elif value == "None":
                processed[key] = None
            else:
                processed[key] = value
        return processed
    
    def train(self, algorithm: str, X: np.ndarray, y: np.ndarray, parameters: dict):
        """Train model and return results"""
        if algorithm not in self.models:
            raise ValueError(f"Unknown algorithm: {algorithm}")
        
        # Convert string parameters to proper types
        processed_params = self._process_parameters(parameters)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Create and train model
        model_class = self.models[algorithm]
        model = model_class(**processed_params)
        model.fit(X_train, y_train)
        
        # Predictions
        y_pred = model.predict(X_test)
        
        # Calculate metrics
        is_classification = algorithm != "linear_regression"
        if is_classification:
            score = accuracy_score(y_test, y_pred)
            metric_name = "accuracy"
        else:
            score = mean_squared_error(y_test, y_pred)
            metric_name = "mse"
        
        # Generate decision boundary data
        decision_boundary = self._generate_decision_boundary(model, X, y)
        
        # Feature importance (for tree-based models)
        feature_importance = None
        if hasattr(model, 'feature_importances_'):
            feature_importance = model.feature_importances_.tolist()
        
        return {
            "success": True,
            "metrics": {
                metric_name: float(score),
                "train_size": len(X_train),
                "test_size": len(X_test)
            },
            "decision_boundary": decision_boundary,
            "feature_importance": feature_importance,
            "training_data": {
                "X": X_train.tolist(),
                "y": y_train.tolist()
            },
            "test_data": {
                "X": X_test.tolist(),
                "y": y_test.tolist(),
                "predictions": y_pred.tolist()
            }
        }
    
    def _generate_decision_boundary(self, model, X, y):
        """Generate decision boundary mesh for visualization"""
        h = 0.02  # step size in mesh
        x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
        y_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1
        
        xx, yy = np.meshgrid(
            np.arange(x_min, x_max, h),
            np.arange(y_min, y_max, h)
        )
        
        # Predict on mesh
        Z = model.predict(np.c_[xx.ravel(), yy.ravel()])
        Z = Z.reshape(xx.shape)
        
        return {
            "x": xx.tolist(),
            "y": yy.tolist(),
            "z": Z.tolist(),
            "data_points": {
                "X": X.tolist(),
                "y": y.tolist()
            }
        }
