import numpy as np
import pandas as pd
from sklearn.datasets import (
    make_moons, make_circles, load_iris, make_regression,
    load_wine, load_breast_cancer, make_blobs, make_classification
)


class DatasetLoader:
    """Load and prepare datasets for ML visualization"""
    
    def load_dataset(self, dataset_name: str, n_samples: int = 300):
        """Load dataset by name"""
        if dataset_name == "moons":
            X, y = make_moons(n_samples=n_samples, noise=0.3, random_state=42)
        elif dataset_name == "circles":
            X, y = make_circles(n_samples=n_samples, noise=0.2, factor=0.5, random_state=42)
        elif dataset_name == "iris":
            iris = load_iris()
            # Use only first 2 features for 2D visualization
            X = iris.data[:, :2]
            y = iris.target
        elif dataset_name == "wine":
            wine = load_wine()
            # Use first 2 features for 2D visualization
            X = wine.data[:, :2]
            y = wine.target
        elif dataset_name == "breast_cancer":
            cancer = load_breast_cancer()
            # Use first 2 features for 2D visualization
            X = cancer.data[:, :2]
            y = cancer.target
        elif dataset_name == "blobs":
            X, y = make_blobs(n_samples=n_samples, centers=3, n_features=2, random_state=42)
        elif dataset_name == "classification":
            X, y = make_classification(n_samples=n_samples, n_features=2, n_redundant=0, 
                                      n_informative=2, n_clusters_per_class=1, random_state=42)
        elif dataset_name == "linear":
            X, y = make_regression(n_samples=n_samples, n_features=2, noise=10, random_state=42)
        else:
            raise ValueError(f"Unknown dataset: {dataset_name}")
        
        return X, y
    
    def load_custom_dataset(self, file_content: str):
        """Load custom CSV dataset"""
        from io import StringIO
        
        # Read CSV
        df = pd.read_csv(StringIO(file_content))
        
        # Assume last column is target
        X = df.iloc[:, :-1].values
        y = df.iloc[:, -1].values
        
        # If more than 2 features, use first 2 for visualization
        if X.shape[1] > 2:
            X = X[:, :2]
        
        return X, y
