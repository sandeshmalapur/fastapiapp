from SQLalchemy import Column, Integer, String,Enum,relationship,ForeignKey
from database import Base,engine,SessionLocal
from models.job import Job

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String,nullable=False, index=True)
    email = Column(String, unique=True)
    phone = Column(String, unique=True)
    # address = Column(String,)
    job_id = Column(Integer, ForeignKey("jobs.id"))
    jobs = relationship("Job", back_populates="company")
