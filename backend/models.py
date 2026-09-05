from sqlalchemy import Column, Integer, String, Float
from database import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(String, unique=True, index=True)
    amount = Column(Float)
    location = Column(String)
    risk_score = Column(Float)
    status = Column(String)