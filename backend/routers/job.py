from utils.oauth2 import get_current_user, role_required
from fastapi import APIRouter,HTTPException,Depends,status
from schemas.job import JobCreate,JobUpdate,JobResponse
from models import company,job
from models.company import Company
from models.job import Job
from sqlalchemy.orm import Session
from database import get_db,SessionLocal

router=APIRouter(prefix="/job",tags=["job"])

@router.post("/",status_code=status.HTTP_201_CREATED)
def create_job(job:JobCreate, db:Session=Depends(get_db), current_user=Depends(role_required(["admin","hr"]))):
    if job.company_id <= 0:
        raise HTTPException(status_code=400, detail="company_id must be greater than 0")

    company = db.query(Company).filter(Company.id == job.company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail=f"Company with id {job.company_id} not found")

    db_job=Job(**job.dict())
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

@router.get("/",status_code=status.HTTP_200_OK, response_model=list[JobResponse])
def get_all_jobs(db:Session=Depends(get_db), current_user=Depends(get_current_user)):
    jobs=db.query(Job).all()    
    return jobs

@router.get("/{job_id}",status_code=status.HTTP_200_OK, response_model=JobResponse)
def get_job(job_id:int, db:Session=Depends(get_db), current_user=Depends(get_current_user)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.put("/{job_id}",status_code=status.HTTP_200_OK, response_model=JobResponse)
def update_job(job_id:int, job:JobUpdate, db:Session=Depends(get_db), current_user=Depends(role_required(["admin","hr"]))):
    db_job = db.query(Job).filter(Job.id == job_id).first()
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")

    update_data = job.dict(exclude_unset=True)
    if "company_id" in update_data:
        company_id = update_data["company_id"]
        if company_id is not None:
            if company_id <= 0:
                raise HTTPException(status_code=400, detail="company_id must be greater than 0")

            company = db.query(Company).filter(Company.id == company_id).first()
            if not company:
                raise HTTPException(status_code=404, detail=f"Company with id {company_id} not found")

    for key, value in update_data.items():
        setattr(db_job, key, value)
    db.commit()
    db.refresh(db_job)
    return db_job

@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_job(job_id:int, db:Session=Depends(get_db), current_user=Depends(role_required(["admin","hr"]))):
    db_job = db.query(Job).filter(Job.id == job_id).first()
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")
    db.delete(db_job)
    db.commit()
    return {"message": "Job deleted successfully"}

