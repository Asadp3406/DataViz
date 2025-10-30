import numpy as np
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier, export_text
from sklearn.ensemble import (
    RandomForestClassifier, 
    GradientBoostingClassifier,
    AdaBoostClassifier,
    ExtraTreesClassifier,
    BaggingClassifier
)
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split, learning_curve
from sklearn.metrics import accuracy_score, mean_squared_error, confusion_matrix
import json


class MLModelTrainer:
    """Train models and generate visualization data"""
    
    def __init__(self):
        self.models = {
            "logistic_regression": LogisticRegression,
            "knn": KNeighborsClassifier,
            "decision_tree": DecisionTreeClassifier,
            "random_forest": RandomForestClassifier,
            "gradient_boosting": GradientBoostingClassifier,
            "adaboost": AdaBoostClassifier,
            "extra_trees": ExtraTreesClassifier,
            "bagging": BaggingClassifier,
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
        
        # Decision tree structure (for tree models)
        tree_structure = None
        if algorithm == "decision_tree":
            tree_structure = self._export_tree_structure(model, X_train)
        
        # Confusion matrix (for classification)
        conf_matrix = None
        if is_classification:
            conf_matrix = confusion_matrix(y_test, y_pred).tolist()
        
        # Learning curves
        learning_curves_data = self._generate_learning_curves(model_class, processed_params, X, y)
        
        return {
            "success": True,
            "metrics": {
                metric_name: float(score),
                "train_size": len(X_train),
                "test_size": len(X_test)
            },
            "decision_boundary": decision_boundary,
            "feature_importance": feature_importance,
            "tree_structure": tree_structure,
            "confusion_matrix": conf_matrix,
            "learning_curves": learning_curves_data,
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
    
    def _generate_learning_curves(self, model_class, parameters, X, y):
        """Generate learning curves data"""
        try:
            train_sizes = np.linspace(0.1, 1.0, 10)
            train_sizes_abs, train_scores, test_scores = learning_curve(
                model_class(**parameters), X, y, 
                train_sizes=train_sizes, cv=3, n_jobs=-1,
                scoring='accuracy' if model_class != LinearRegression else 'r2'
            )
            
            return {
                "train_sizes": train_sizes_abs.tolist(),
                "train_scores_mean": train_scores.mean(axis=1).tolist(),
                "train_scores_std": train_scores.std(axis=1).tolist(),
                "test_scores_mean": test_scores.mean(axis=1).tolist(),
                "test_scores_std": test_scores.std(axis=1).tolist()
            }
        except Exception as e:
            return None
    
    def _export_tree_structure(self, model, X):
        """Export decision tree structure for visualization"""
        from sklearn.tree import _tree
        
        tree = model.tree_
        feature_names = [f"Feature {i+1}" for i in range(X.shape[1])]
        
        def recurse(node, depth, parent_id=None, position='root'):
            """Recursively build tree structure"""
            if node == _tree.TREE_LEAF:
                return []
            
            nodes = []
            node_id = f"node_{node}_{depth}"
            
            # Get node information
            feature = tree.feature[node]
            threshold = tree.threshold[node]
            samples = tree.n_node_samples[node]
            value = tree.value[node][0]
            
            # Determine node label
            if feature != _tree.TREE_UNDEFINED:
                label = f"{feature_names[feature]}\n≤ {threshold:.2f}\nsamples: {samples}"
            else:
                label = f"Class: {int(value.argmax())}\nsamples: {samples}"
            
            node_info = {
                'id': node_id,
                'label': label,
                'parent': parent_id,
                'position': position,
                'depth': depth,
                'is_leaf': feature == _tree.TREE_UNDEFINED,
                'samples': int(samples)
            }
            nodes.append(node_info)
            
            # Recurse for children
            if feature != _tree.TREE_UNDEFINED:
                left_child = tree.children_left[node]
                right_child = tree.children_right[node]
                
                if left_child != _tree.TREE_LEAF:
                    nodes.extend(recurse(left_child, depth + 1, node_id, 'left'))
                if right_child != _tree.TREE_LEAF:
                    nodes.extend(recurse(right_child, depth + 1, node_id, 'right'))
            
            return nodes
        
        tree_nodes = recurse(0, 0)
        
        # Build edges for visualization
        edges = []
        for node in tree_nodes:
            if node['parent']:
                edges.append({
                    'from': node['parent'],
                    'to': node['id'],
                    'label': node['position']
                })
        
        return {
            'nodes': tree_nodes,
            'edges': edges,
            'max_depth': max(n['depth'] for n in tree_nodes) if tree_nodes else 0
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
