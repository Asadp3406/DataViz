# DataViz Studio 📊

An interactive web-based tool to visualize how different classification and regression algorithms behave when their parameters change. Explore patterns, visualize data, and discover insights through beautiful, interactive visualizations.

## Features

- 6 algorithms: Linear Regression, Logistic Regression, KNN, Decision Tree, Random Forest, SVM
- Interactive hyperparameter tuning with sliders and dropdowns
- Real-time visualization of decision boundaries, accuracy curves, and feature importance
- Multiple toy datasets (moons, circles, iris)
- Clean, responsive UI with dark mode support

## Tech Stack

- **Frontend**: React.js + Tailwind CSS + Framer Motion + Plotly.js
- **Backend**: FastAPI + scikit-learn + NumPy
- **Communication**: REST API

## Quick Start

### Prerequisites

- Node.js (v16+)
- Python (3.8+)
- npm or yarn

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Backend runs on `http://localhost:8000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## API Endpoints

- `GET /datasets` - List available datasets
- `POST /train` - Train model and get visualization data
- `GET /health` - Health check

## Usage

1. Select a dataset from the dropdown
2. Choose an algorithm
3. Adjust hyperparameters using sliders
4. Click "Run Model" to see visualizations
5. Compare algorithms side-by-side (optional)

## Project Structure

```
ml-visualizer/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── utils/
│   └── package.json
├── backend/           # FastAPI application
│   ├── app.py
│   ├── models/
│   ├── utils/
│   └── requirements.txt
└── README.md
```

## License

MIT
