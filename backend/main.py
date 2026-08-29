from pathlib import Path

import joblib
import numpy as np

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from database import engine, SessionLocal
from models import Base, Transaction


# =========================================================
# DATABASE
# =========================================================

Base.metadata.create_all(bind=engine)


# =========================================================
# FASTAPI
# =========================================================

app = FastAPI(
    title="NEXRA API",
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


print("\n" + "=" * 55)
print("NEXRA ML SYSTEM")
print("=" * 55)

fraud_model = None
scaler = None

try:

    print("Loading fraud detection model...")

    fraud_model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)

    print("Fraud model loaded successfully!")
    print("Scaler loaded successfully!")

except Exception as e:

    print("WARNING: ML model could not be loaded.")
    print("Error:", e)


# =========================================================
# REQUEST SCHEMA
# =========================================================

class PredictionRequest(BaseModel):

    features: list[float] = Field(
        ...,
        min_length=30,
        max_length=30,
        description="Time, V1-V28, Amount"
    )


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


# =========================================================
# FRAUD PREDICTION
# =========================================================

@app.post("/api/predict")
def predict_fraud(request: PredictionRequest):

    # -----------------------------------------------------
    # Check ML system
    # -----------------------------------------------------

    if fraud_model is None or scaler is None:

        raise HTTPException(
            status_code=503,
            detail="Fraud detection model is not loaded."
        )

    # -----------------------------------------------------
    # Convert input
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
    # Verify feature count
    # -----------------------------------------------------

    if features.shape[1] != 30:

        raise HTTPException(
            status_code=400,
            detail=(
                f"Expected 30 features "
                f"(Time + V1-V28 + Amount), "
                f"received {features.shape[1]}."
            )
        )

    # -----------------------------------------------------
    # MODEL PREDICTION
    # -----------------------------------------------------

    try:

        # Check what the scaler expects
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
                        f"Scaler expects {scaler_features} "
                        f"features, but API received 30. "
                        "Retrain/save the scaler using the "
                        "same feature pipeline as the model."
                    )
                )

        # Scale features
        scaled_features = scaler.transform(features)

        # Prediction
        prediction = int(
            fraud_model.predict(scaled_features)[0]
        )

        # Probability
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
        # RISK LEVEL + STATUS
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
        # RESPONSE
        # -------------------------------------------------

        return {

            "success": True,

            "prediction": prediction,

            "fraud": prediction == 1,

            "result": (
                "Fraud"
                if prediction == 1
                else "Legitimate"
            ),

            "fraud_probability": round(
                fraud_probability,
                4
            ),

            "fraud_probability_percent": round(
                fraud_probability * 100,
                2
            ),

            "risk_score": risk_score,

            "risk_level": risk_level,

            "status": status
        }

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
def get_models():

    return [

        {
            "id": "MOD-001",
            "name": "Fraud Detection Model",
            "version": "v2.4.1",
            "accuracy": 96.8,
            "status": "Active"
        },

        {
            "id": "MOD-002",
            "name": "Transaction Risk Model",
            "version": "v1.8.3",
            "accuracy": 94.5,
            "status": "Active"
        },

        {
            "id": "MOD-003",
            "name": "Anomaly Detection Model",
            "version": "v3.1.0",
            "accuracy": 92.7,
            "status": "Training"
        }
    ]


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