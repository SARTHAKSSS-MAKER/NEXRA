from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import engine, SessionLocal
from models import Base, Transaction

Base.metadata.create_all(bind=engine)

app = FastAPI(title="NEXRA API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",
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

@app.get("/")
def root():
    return {"message": "NEXRA API is running"}

@app.get("/api/health")
def health():
    return {"status": "healthy"}

@app.get("/api/transactions")
def get_transactions(db: Session = Depends(get_db)):
    transactions = db.query(Transaction).all()

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
def get_risk():
    return {
        "overall_risk": 68,
        "risk_level": "Medium",
        "high_risk": 6284,
        "medium_risk": 12450,
        "low_risk": 24166,
        "risk_change": 12.6
    }

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

@app.get("/api/settings")
def get_settings():
    return {
        "notifications": True,
        "real_time_monitoring": True,
        "auto_block_high_risk": False,
        "risk_threshold": 80,
        "model_version": "v2.4.1"
    }
class SettingsUpdate(BaseModel):
    notifications: bool
    real_time_monitoring: bool
    auto_block_high_risk: bool
    risk_threshold: int
    model_version: str


@app.put("/api/settings")
def update_settings(settings: SettingsUpdate):
    return {
        "message": "Settings updated successfully",
        "settings": settings.model_dump()
    }