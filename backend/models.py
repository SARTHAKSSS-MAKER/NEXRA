from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from database import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(String, unique=True, index=True)
    amount = Column(Float)
    risk_score = Column(Float)
    status = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    severity = Column(String)
    status = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)