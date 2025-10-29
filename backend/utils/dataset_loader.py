import numpy as np
from sklearn.datasets import make_moons, make_circles, load_iris, make_regression


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
        elif dataset_name == "linear":
            X, y = make_regression(n_samples=n_samples, n_features=2, noise=10, random_state=42)
        else:
            raise ValueError(f"Unknown dataset: {dataset_name}")
        
        return X, y
