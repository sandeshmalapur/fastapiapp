from SQLalchemy import Column, Integer, String,Enum,relationship,ForeignKey
from database import Base,engine,SessionLocal
from models.company import Company

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    description = Column(String, nullable=False)
    # location = Column(String, nullable=False)
    salary = Column(Integer, nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id"))
    company = relationship("Company", back_populates="jobs")