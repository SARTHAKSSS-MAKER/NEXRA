from pathlib import Path
from datetime import datetime, date
import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, ConfigDict
from sqlalchemy import Column,Integer,Boolean,Float,DateTime
from sqlalchemy.orm import Session

from database import engine, SessionLocal
from models import Base, Transaction

# =========================================================
# PREDICTION LOG
# =========================================================

class PredictionLog(Base):

    __tablename__ = "prediction_logs"

    id = Column(Integer, primary_key=True, index=True)

    created_at = Column(
        DateTime,
        default=datetime.now,
        nullable=False
    )

    fraud = Column(
        Boolean,
        nullable=False
    )

    risk_score = Column(
        Float,
        nullable=False
    )


# =========================================================
# DATABASE
# =========================================================

Base.metadata.create_all(bind=engine)


# =========================================================
# FASTAPI
# =========================================================

app = FastAPI(
    title="NEXRA API",
    description="NEXRA Fraud Detection and Transaction Risk API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# DATABASE SESSION
# =========================================================

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# =========================================================
# ML MODEL
# =========================================================

BASE_DIR = Path(__file__).resolve().parents[1]

MODEL_PATH = BASE_DIR / "ml" / "models" / "fraud_detection_model.pkl"
SCALER_PATH = BASE_DIR / "ml" / "models" / "scaler.pkl"
DATASET_PATH = BASE_DIR / "ml" / "datasets" / "creditcard.csv"
TEST_DATA_PATH = BASE_DIR / "ml" / "models" / "test_data.pkl"


print("\n" + "=" * 60)
print("NEXRA ML SYSTEM")
print("=" * 60)

fraud_model = None
scaler = None

try:

    print("Loading fraud detection model...")
    print("Model path:", MODEL_PATH)

    fraud_model = joblib.load(MODEL_PATH)

    print("Fraud model loaded successfully!")

    print("Loading scaler...")
    print("Scaler path:", SCALER_PATH)

    scaler = joblib.load(SCALER_PATH)

    print("Scaler loaded successfully!")

except Exception as e:

    print("WARNING: ML model could not be loaded.")
    print("Error:", e)


# =========================================================
# REQUEST SCHEMA
# =========================================================

class PredictionRequest(BaseModel):

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "features": [
                    0.0,
                    0.0,
                    0.0,
                    0.0,
                    0.0,
                    0.0,
                    0.0,
                    0.0,
                    0.0,
                    0.0,
                    0.0,
                    0.0,
                    0.0,
                    0.0,
                    0.0,
                    0.0,
                    0.0,
                    0.0,
                    0.0,
                    0.0,
                    0.0,
                    0.0,
                    0.0,
                    0.0,
                    0.0,
                    0.0,
                    0.0,
                    0.0,
                    0.0,
                    100.0
                ]
            }
        }
    )

    features: list[float] = Field(
        ...,
        min_length=30,
        max_length=30,
        description=(
            "Exactly 30 numerical features: "
            "Time + V1-V28 + Amount"
        )
    )


# =========================================================
# RESPONSE SCHEMA
# =========================================================

class PredictionResponse(BaseModel):

    success: bool
    prediction: int
    fraud: bool
    result: str

    fraud_probability: float
    fraud_probability_percent: float

    risk_score: float
    risk_level: str
    status: str


# =========================================================
# ROOT
# =========================================================

@app.get("/")
def root():

    return {
        "message": "NEXRA API is running",
        "ml_model": fraud_model is not None,
        "scaler": scaler is not None
    }


# =========================================================
# HEALTH
# =========================================================

@app.get("/api/health")
def health():

    return {
        "status": "healthy",
        "ml_model": fraud_model is not None,
        "scaler": scaler is not None
    }


# =========================================================
# ML STATUS
# =========================================================

@app.get("/api/ml/status")
def ml_status():

    ready = (
        fraud_model is not None
        and scaler is not None
    )

    return {
        "model_loaded": fraud_model is not None,
        "scaler_loaded": scaler is not None,
        "model_file": MODEL_PATH.name,
        "scaler_file": SCALER_PATH.name,
        "status": "ready" if ready else "not_ready"
    }

@app.get("/api/test-transactions")
def get_test_transactions():
    if not DATASET_PATH.exists():
        raise HTTPException(
            status_code=404,
            detail="Credit card dataset not found"
        )

    df = pd.read_csv(DATASET_PATH)

    feature_columns = [
        "Time",
        *[f"V{i}" for i in range(1, 29)],
        "Amount"
    ]

    required_columns = [*feature_columns, "Class"]

    missing_columns = [
        column
        for column in required_columns
        if column not in df.columns
    ]

    if missing_columns:
        raise HTTPException(
            status_code=500,
            detail=f"Dataset is missing columns: {missing_columns}"
        )

    legitimate = df[df["Class"] == 0].head(5)
    fraud = df[df["Class"] == 1].head(5)

    selected = pd.concat(
        [legitimate, fraud],
        ignore_index=True
    )

    transactions = []

    for index, row in selected.iterrows():
        transactions.append({
            "id": f"TEST-{index + 1:04d}",
            "actual_class": int(row["Class"]),
            "actual_label": (
                "Fraud"
                if int(row["Class"]) == 1
                else "Legitimate"
            ),
            "features": [
                float(row[column])
                for column in feature_columns
            ]
        })

    return {
        "count": len(transactions),
        "transactions": transactions
    }
@app.get("/api/evaluate")
def evaluate_model():
    if not MODEL_PATH.exists():
        raise HTTPException(
            status_code=404,
            detail="Fraud detection model not found"
        )

    if not SCALER_PATH.exists():
        raise HTTPException(
            status_code=404,
            detail="Scaler not found"
        )

    if not TEST_DATA_PATH.exists():
        raise HTTPException(
            status_code=404,
            detail="Held-out test data not found"
        )

    test_data = joblib.load(TEST_DATA_PATH)

    X_test = test_data["X_test"]
    y_test = test_data["y_test"]

    evaluation_model = joblib.load(MODEL_PATH)
    evaluation_scaler = joblib.load(SCALER_PATH)

    X_test_scaled = evaluation_scaler.transform(X_test)

    y_pred = evaluation_model.predict(X_test_scaled)

    from sklearn.metrics import (
        accuracy_score,
        precision_score,
        recall_score,
        f1_score,
        confusion_matrix
    )

    accuracy = accuracy_score(
        y_test,
        y_pred
    )

    precision = precision_score(
        y_test,
        y_pred,
        zero_division=0
    )

    recall = recall_score(
        y_test,
        y_pred,
        zero_division=0
    )

    f1 = f1_score(
        y_test,
        y_pred,
        zero_division=0
    )

    cm = confusion_matrix(
        y_test,
        y_pred
    )

    return {
        "dataset": "Credit Card Fraud Detection",
        "test_samples": int(len(y_test)),
        "accuracy": round(float(accuracy), 4),
        "precision": round(float(precision), 4),
        "recall": round(float(recall), 4),
        "f1_score": round(float(f1), 4),
        "confusion_matrix": cm.tolist(),
        "true_negative": int(cm[0][0]),
        "false_positive": int(cm[0][1]),
        "false_negative": int(cm[1][0]),
        "true_positive": int(cm[1][1])
    }
# =========================================================
# FRAUD PREDICTION
# =========================================================

@app.post(
    "/api/predict",
    response_model=PredictionResponse,
    summary="Predict transaction fraud",
    description=(
        "Analyzes a transaction using the trained "
        "Logistic Regression fraud detection model."
    )
)
def predict_fraud(
    request: PredictionRequest,
    db: Session = Depends(get_db)
):

    # -----------------------------------------------------
    # CHECK ML SYSTEM
    # -----------------------------------------------------

    if fraud_model is None or scaler is None:

        raise HTTPException(
            status_code=503,
            detail="Fraud detection model is not loaded."
        )

    # -----------------------------------------------------
    # CONVERT INPUT
    # -----------------------------------------------------

    try:

        features = np.asarray(
            request.features,
            dtype=np.float64
        ).reshape(1, -1)

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid feature values."
        )

    # -----------------------------------------------------
    # VERIFY FEATURE COUNT
    # -----------------------------------------------------

    if features.shape[1] != 30:

        raise HTTPException(
            status_code=400,
            detail=(
                "Exactly 30 features are required: "
                "Time + V1-V28 + Amount."
            )
        )

    # -----------------------------------------------------
    # CHECK SCALER
    # -----------------------------------------------------

    scaler_features = getattr(
        scaler,
        "n_features_in_",
        None
    )

    if scaler_features is not None:

        if scaler_features != 30:

            raise HTTPException(
                status_code=500,
                detail=(
                    f"Scaler expects {scaler_features} features, "
                    "but the API requires 30. "
                    "Retrain/save the scaler using the "
                    "same feature pipeline as the model."
                )
            )

    # -----------------------------------------------------
    # MODEL PREDICTION
    # -----------------------------------------------------

    try:

        # Scale input using the SAME scaler used during training
        scaled_features = scaler.transform(features)

        # Generate prediction
        prediction = int(
            fraud_model.predict(scaled_features)[0]
        )

        # -------------------------------------------------
        # FRAUD PROBABILITY
        # -------------------------------------------------

        if hasattr(fraud_model, "predict_proba"):

            probabilities = fraud_model.predict_proba(
                scaled_features
            )[0]

            fraud_probability = float(
                probabilities[1]
            )

        else:

            fraud_probability = float(prediction)

        # -------------------------------------------------
        # RISK SCORE
        # -------------------------------------------------

        risk_score = round(
            fraud_probability * 100,
            2
        )

        # -------------------------------------------------
        # RISK LEVEL
        # -------------------------------------------------

        if risk_score >= 80:

            risk_level = "Critical"
            status = "Blocked"

        elif risk_score >= 50:

            risk_level = "High"
            status = "Review"

        elif risk_score >= 25:

            risk_level = "Medium"
            status = "Review"

        else:

            risk_level = "Low"
            status = "Approved"


            # -------------------------------------------------
        # SAVE PREDICTION
        # -------------------------------------------------

        prediction_log = PredictionLog(
            fraud=prediction == 1,
            risk_score=risk_score
        )

        db.add(prediction_log)
        db.commit()

        # -------------------------------------------------
        # FINAL RESULT
        # -------------------------------------------------

        return PredictionResponse(

            success=True,

            prediction=prediction,

            fraud=prediction == 1,

            result=(
                "Fraud"
                if prediction == 1
                else "Legitimate"
            ),

            fraud_probability=round(
                fraud_probability,
                4
            ),

            fraud_probability_percent=round(
                fraud_probability * 100,
                2
            ),

            risk_score=risk_score,

            risk_level=risk_level,

            status=status
        )

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )


# =========================================================
# TRANSACTIONS
# =========================================================

@app.get("/api/transactions")
def get_transactions(
    db: Session = Depends(get_db)
):

    transactions = db.query(
        Transaction
    ).all()

    if not transactions:

        transactions = [

            Transaction(
                transaction_id="TXN-98241",
                amount=84500,
                location="Mumbai, IN",
                risk_score=82,
                status="Blocked"
            ),

            Transaction(
                transaction_id="TXN-98240",
                amount=12800,
                location="Pune, IN",
                risk_score=61,
                status="Review"
            ),

            Transaction(
                transaction_id="TXN-98239",
                amount=3250,
                location="Delhi, IN",
                risk_score=24,
                status="Approved"
            ),

            Transaction(
                transaction_id="TXN-98238",
                amount=7900,
                location="Bengaluru, IN",
                risk_score=18,
                status="Approved"
            )
        ]

        db.add_all(transactions)
        db.commit()

        for transaction in transactions:
            db.refresh(transaction)

    return [

        {
            "id": transaction.transaction_id,
            "amount": transaction.amount,
            "location": transaction.location,
            "risk_score": transaction.risk_score,
            "status": transaction.status
        }

        for transaction in transactions
    ]


# =========================================================
# ALERTS
# =========================================================

@app.get("/api/alerts")
def get_alerts():

    return [

        {
            "id": "ALT-001",
            "type": "High Risk Transaction",
            "message": "Unusual transaction detected",
            "risk_score": 92,
            "severity": "Critical",
            "status": "Open"
        },

        {
            "id": "ALT-002",
            "type": "Suspicious Activity",
            "message": "Multiple transactions from unusual location",
            "risk_score": 81,
            "severity": "High",
            "status": "Investigating"
        },

        {
            "id": "ALT-003",
            "type": "Velocity Alert",
            "message": "Transaction frequency exceeded threshold",
            "risk_score": 74,
            "severity": "Medium",
            "status": "Open"
        }
    ]


# =========================================================
# MODELS
# =========================================================

@app.get("/api/models")
def get_models(
    db: Session = Depends(get_db)
):

    today = date.today()

    predictions_today = db.query(
        PredictionLog
    ).filter(
        PredictionLog.created_at >= datetime.combine(
            today,
            datetime.min.time()
        )
    ).count()

    return {
        "predictions_today": predictions_today,

        "models": [

            {
                "id": "MOD-001",
                "name": "Fraud Detection Model",
                "version": "v2.4.1",
                "accuracy": 96.8,
                "status": "Production"
            },

            {
                "id": "MOD-002",
                "name": "Transaction Risk Model",
                "version": "v1.8.3",
                "accuracy": 94.5,
                "status": "Production"
            },

            {
                "id": "MOD-003",
                "name": "Anomaly Detection Model",
                "version": "v3.1.0",
                "accuracy": 92.7,
                "status": "Monitoring"
            }

        ]
    }

# =========================================================
# REPORTS
# =========================================================

@app.get("/api/reports")
def get_reports():

    return [

        {
            "id": "REP-001",
            "name": "Daily Fraud Analysis",
            "type": "Fraud Analysis",
            "date": "2026-08-28",
            "status": "Completed"
        },

        {
            "id": "REP-002",
            "name": "Transaction Risk Report",
            "type": "Risk Analysis",
            "date": "2026-08-27",
            "status": "Completed"
        },

        {
            "id": "REP-003",
            "name": "Monthly Security Report",
            "type": "Security",
            "date": "2026-08-01",
            "status": "Generated"
        }
    ]


# =========================================================
# RISK
# =========================================================

@app.get("/api/risk")
def get_risk():

    return {
        "overall_risk": 68,
        "risk_level": "Medium",
        "high_risk": 6284,
        "medium_risk": 12450,
        "low_risk": 24166,
        "risk_change": 12.6
    }


# =========================================================
# DASHBOARD
# =========================================================

@app.get("/api/dashboard")
def get_dashboard():

    return {
        "total_transactions": 42900,
        "high_risk_transactions": 6284,
        "detection_accuracy": 96.8,
        "active_alerts": 24,
        "fraud_rate": 3.8,
        "blocked_transactions": 1842
    }


# =========================================================
# SETTINGS
# =========================================================

class SettingsUpdate(BaseModel):

    notifications: bool
    real_time_monitoring: bool
    auto_block_high_risk: bool
    risk_threshold: int
    model_version: str


@app.get("/api/settings")
def get_settings():

    return {

        "notifications": True,

        "real_time_monitoring": True,

        "auto_block_high_risk": False,

        "risk_threshold": 80,

        "model_version": "v2.4.1"
    }


@app.put("/api/settings")
def update_settings(
    settings: SettingsUpdate
):

    return {

        "message": "Settings updated successfully",

        "settings": settings.model_dump()
    }