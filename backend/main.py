from pathlib import Path
from datetime import datetime, date
import joblib
import numpy as np
import pandas as pd

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel, Field, ConfigDict

from sqlalchemy import Column, Integer, Boolean, Float, DateTime
from sqlalchemy.orm import Session

from database import engine, SessionLocal
from models import Base, Transaction
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix
)


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


Base.metadata.create_all(bind=engine)


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


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


BASE_DIR = Path(__file__).resolve().parents[1]

MODEL_PATH = (
    BASE_DIR
    / "ml"
    / "models"
    / "fraud_detection_model.pkl"
)

SCALER_PATH = (
    BASE_DIR
    / "ml"
    / "models"
    / "scaler.pkl"
)

DATASET_PATH = (
    BASE_DIR
    / "ml"
    / "datasets"
    / "creditcard.csv"
)

TEST_DATA_PATH = (
    BASE_DIR
    / "ml"
    / "models"
    / "test_data.pkl"
)


fraud_model = None
scaler = None


print("\n" + "=" * 60)
print("NEXRA ML SYSTEM")
print("=" * 60)

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


settings_store = {
    "notifications": True,
    "real_time_monitoring": True,
    "auto_block_high_risk": False,
    "risk_threshold": 80,
    "model_version": "Financial Fraud Detection v1.0"
}


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
        description="Exactly 30 numerical features: Time + V1-V28 + Amount"
    )


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


class SettingsUpdate(BaseModel):

    notifications: bool
    real_time_monitoring: bool
    auto_block_high_risk: bool
    risk_threshold: int
    model_version: str


@app.get("/")
def root():

    return {
        "message": "NEXRA API is running",
        "ml_model": fraud_model is not None,
        "scaler": scaler is not None,
        "settings": settings_store
    }


@app.get("/api/health")
def health():

    return {
        "status": "healthy",
        "ml_model": fraud_model is not None,
        "scaler": scaler is not None
    }


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

    required_columns = [
        *feature_columns,
        "Class"
    ]

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

            "actual_class": int(
                row["Class"]
            ),

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

    if fraud_model is None or scaler is None:
        raise HTTPException(
            status_code=503,
            detail="Fraud model or scaler is not loaded"
        )

    if not TEST_DATA_PATH.exists():
        raise HTTPException(
            status_code=404,
            detail="Held-out test data not found"
        )

    test_data = joblib.load(TEST_DATA_PATH)

    X_test = test_data["X_test"]
    y_test = test_data["y_test"]

    X_test_scaled = scaler.transform(X_test)

    y_pred = fraud_model.predict(X_test_scaled)

    accuracy = accuracy_score(y_test, y_pred)
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

    tn, fp, fn, tp = confusion_matrix(
        y_test,
        y_pred
    ).ravel()

    return {
        "accuracy": float(accuracy),
        "precision": float(precision),
        "recall": float(recall),
        "f1_score": float(f1),
        "test_samples": int(len(y_test)),
        "true_negative": int(tn),
        "false_positive": int(fp),
        "false_negative": int(fn),
        "true_positive": int(tp),
        "confusion_matrix": [
            [int(tn), int(fp)],
            [int(fn), int(tp)]
        ]
    }


@app.post(
    "/api/predict",
    response_model=PredictionResponse
)
def predict_fraud(
    request: PredictionRequest,
    db: Session = Depends(get_db)
):

    if fraud_model is None or scaler is None:

        raise HTTPException(
            status_code=503,
            detail="Fraud detection model is not loaded."
        )

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

    if features.shape[1] != 30:

        raise HTTPException(
            status_code=400,
            detail=(
                "Exactly 30 features are required: "
                "Time + V1-V28 + Amount."
            )
        )

    scaler_features = getattr(
        scaler,
        "n_features_in_",
        None
    )

    if (
        scaler_features is not None
        and scaler_features != 30
    ):

        raise HTTPException(
            status_code=500,
            detail=(
                f"Scaler expects {scaler_features} features, "
                "but the API requires 30."
            )
        )

    try:

        scaled_features = (
            scaler.transform(features)
        )

        prediction = int(
            fraud_model.predict(
                scaled_features
            )[0]
        )

        if hasattr(
            fraud_model,
            "predict_proba"
        ):

            probabilities = (
                fraud_model.predict_proba(
                    scaled_features
                )[0]
            )

            fraud_probability = float(
                probabilities[1]
            )

        else:

            fraud_probability = float(
                prediction
            )

        risk_score = round(
            fraud_probability * 100,
            2
        )

        threshold = int(
            settings_store[
                "risk_threshold"
            ]
        )

        auto_block = bool(
            settings_store[
                "auto_block_high_risk"
            ]
        )

        if (
            auto_block
            and risk_score >= threshold
        ):

            risk_level = "Critical"
            status = "Blocked"

        elif risk_score >= 80:

            risk_level = "Critical"
            status = "Review"

        elif risk_score >= 50:

            risk_level = "High"
            status = "Review"

        elif risk_score >= 25:

            risk_level = "Medium"
            status = "Review"

        else:

            risk_level = "Low"
            status = "Approved"

        prediction_log = PredictionLog(
            fraud=prediction == 1,
            risk_score=risk_score
        )

        db.add(prediction_log)

        db.flush()

        transaction_amount = float(
            request.features[-1]
        )

        transaction = Transaction(
            transaction_id=f"TXN-AI-{prediction_log.id:04d}",
            amount=transaction_amount,
            location="Dataset Test",
            risk_score=risk_score,
            status=status
        )

        db.add(transaction)

        db.commit()

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

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )


@app.get("/api/transactions")
def get_transactions(
    db: Session = Depends(get_db)
):

    transactions = (
        db.query(Transaction)
        .order_by(Transaction.id.desc())
        .limit(10)
        .all()
    )

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

    response = []

    for transaction in transactions:

        if transaction.risk_score >= 80:
            risk_level = "Critical"
        elif transaction.risk_score >= 50:
            risk_level = "High"
        elif transaction.risk_score >= 25:
            risk_level = "Medium"
        else:
            risk_level = "Low"

        response.append({
            "id": transaction.transaction_id,
            "amount": transaction.amount,
            "location": transaction.location,
            "risk_score": transaction.risk_score,
            "risk_level": risk_level,
            "status": transaction.status
        })

    return response

@app.get("/api/alerts")
def get_alerts(
    db: Session = Depends(get_db)
):

    transactions = (
        db.query(Transaction)
        .order_by(Transaction.id.desc())
        .limit(100)
        .all()
    )

    alerts = []

    for transaction in transactions:

        risk_score = float(
            transaction.risk_score or 0
        )

        if risk_score >= 80:

            severity = "Critical"
            alert_type = "High Risk Transaction"
            message = "High-risk transaction detected"

        elif risk_score >= 50:

            severity = "High"
            alert_type = "Suspicious Activity"
            message = "Transaction requires investigation"

        elif risk_score >= 25:

            severity = "Medium"
            alert_type = "Risk Threshold Alert"
            message = "Transaction requires monitoring"

        else:

            continue

        status = (
            "Blocked"
            if transaction.status == "Blocked"
            else "Investigating"
            if transaction.status == "Review"
            else "Open"
        )

        alerts.append({
            "id": f"ALT-TXN-{transaction.id:04d}",
            "type": alert_type,
            "message": message,
            "risk_score": risk_score,
            "severity": severity,
            "status": status,
            "transaction_id": transaction.transaction_id,
            "amount": transaction.amount,
            "location": transaction.location
        })

    return alerts

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

        "predictions_today":
            predictions_today,

        "models": [

            {
                "id": "MOD-001",
                "name": "Fraud Detection Model",
                "version": settings_store[
                    "model_version"
                ],
                "accuracy": 93.73,
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

@app.get("/api/risk")
def get_risk(
    db: Session = Depends(get_db)
):

    transactions = (
        db.query(Transaction)
        .order_by(Transaction.id.desc())
        .limit(1000)
        .all()
    )

    if not transactions:
        return {
            "overall_risk": 0,
            "risk_level": "Low",
            "high_risk": 0,
            "medium_risk": 0,
            "low_risk": 0,
            "risk_change": 0
        }

    scores = [
        float(transaction.risk_score or 0)
        for transaction in transactions
    ]

    high_risk = sum(
        1 for score in scores
        if score >= 80
    )

    medium_risk = sum(
        1 for score in scores
        if 50 <= score < 80
    )

    low_risk = sum(
        1 for score in scores
        if score < 50
    )

    overall_risk = round(
        sum(scores) / len(scores),
        2
    )

    if overall_risk >= 80:
        risk_level = "Critical"
    elif overall_risk >= 50:
        risk_level = "High"
    elif overall_risk >= 25:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    return {
        "overall_risk": overall_risk,
        "risk_level": risk_level,
        "high_risk": high_risk,
        "medium_risk": medium_risk,
        "low_risk": low_risk,
        "risk_change": 0
    }


@app.get("/api/dashboard")
def get_dashboard():

    return {
        "total_transactions": 42900,
        "high_risk_transactions": 6284,
        "detection_accuracy": 93.73,
        "active_alerts": 24,
        "fraud_rate": 3.8,
        "blocked_transactions": 1842
    }


@app.get("/api/settings")
def get_settings():

    return settings_store.copy()


@app.put("/api/settings")
def update_settings(
    settings: SettingsUpdate
):

    risk_threshold = min(
        max(
            int(settings.risk_threshold),
            0
        ),
        100
    )

    settings_store[
        "notifications"
    ] = bool(
        settings.notifications
    )

    settings_store[
        "real_time_monitoring"
    ] = bool(
        settings.real_time_monitoring
    )

    settings_store[
        "auto_block_high_risk"
    ] = bool(
        settings.auto_block_high_risk
    )

    settings_store[
        "risk_threshold"
    ] = risk_threshold

    settings_store[
        "model_version"
    ] = settings.model_version

    print("\nNEXRA SETTINGS UPDATED")

    print(
        "Auto Block:",
        settings_store[
            "auto_block_high_risk"
        ]
    )

    print(
        "Risk Threshold:",
        settings_store[
            "risk_threshold"
        ]
    )

    print(
        "Model Version:",
        settings_store[
            "model_version"
        ]
    )

    return {
        "message": "Settings updated successfully",
        "settings": settings_store.copy()
    }