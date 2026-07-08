from utils.oauth2 import get_current_user, role_required
from fastapi import APIRouter,HTTPException,Depends,status
from schemas.job import JobCreate,JobUpdate,JobResponse
from models import company,job
from models.company import Company
from models.job import Job
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import get_db,SessionLocal

router=APIRouter(prefix="/job",tags=["job"])

@router.post("/",status_code=status.HTTP_201_CREATED)
async def create_job(job:JobCreate, db:AsyncSession=Depends(get_db), current_user=Depends(role_required(["admin","hr"]))):
    try:
        if job.company_id <= 0:
            raise HTTPException(status_code=400, detail="company_id must be greater than 0")

        company = await db.execute(select(Company).filter(Company.id == job.company_id))
        company = company.scalar_one_or_none()
        if not company:
            raise HTTPException(status_code=404, detail=f"Company with id {job.company_id} not found")

        db_job=Job(**job.dict())
        db.add(db_job)
        await db.commit()
        await db.refresh(db_job)
        return db_job               
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail="An error occurred while creating the job")


@router.get("/",status_code=status.HTTP_200_OK, response_model=list[JobResponse])
async def get_all_jobs(db:AsyncSession=Depends(get_db), current_user=Depends(get_current_user)):
   try:
     jobs = await db.execute(select(Job))
     return jobs.scalars().all()
   except Exception as e:
     raise HTTPException(status_code=500, detail="An error occurred while fetching jobs")

@router.get("/{job_id}",status_code=status.HTTP_200_OK, response_model=JobResponse)
async def get_job(job_id:int, db:AsyncSession=Depends(get_db), current_user=Depends(get_current_user)):
    job = await db.execute(select(Job).filter(Job.id == job_id))
    job = job.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.put("/{job_id}",status_code=status.HTTP_200_OK, response_model=JobResponse)
async def update_job(job_id:int, job:JobUpdate, db:AsyncSession=Depends(get_db), current_user=Depends(role_required(["admin","hr"]))):
    db_job_query = await db.execute(select(Job).filter(Job.id == job_id))
    db_job = db_job_query.scalar_one_or_none()
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")

    update_data = job.dict(exclude_unset=True)
    if "company_id" in update_data:
        company_id = update_data["company_id"]
        if company_id is not None:
            if company_id <= 0:
                raise HTTPException(status_code=400, detail="company_id must be greater than 0")

            company_query = await db.execute(select(Company).filter(Company.id == company_id))
            company = company_query.scalar_one_or_none()
            if not company:
                raise HTTPException(status_code=404, detail=f"Company with id {company_id} not found")

    for key, value in update_data.items():
        setattr(db_job, key, value)
    await db.commit()
    await db.refresh(db_job)
    return db_job

@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_job(job_id:int, db:AsyncSession=Depends(get_db), current_user=Depends(role_required(["admin","hr"]))):
    job = await db.execute(select(Job).filter(Job.id == job_id))
    db_job = job.scalar_one_or_none()
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")
    await db.delete(db_job)
    await db.commit()
    return {"message": "Job deleted successfully"}

