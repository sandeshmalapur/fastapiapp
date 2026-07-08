from utils.oauth2 import role_required,get_current_user
from fastapi import APIRouter,HTTPException,Depends,status
from schemas.company import CompanyCreate,CompanyUpdate,CompanyResponse
from models import company,job
from models.company import Company
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import get_db,SessionLocal
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import selectinload

router=APIRouter(prefix="/company",tags=["company"])

@router.post("/",status_code=status.HTTP_201_CREATED, response_model=CompanyResponse)
async def create_company(company:CompanyCreate, db:AsyncSession=Depends(get_db), current_user=Depends(role_required(["admin"]))):
    try:
        db_company=Company(**company.dict())
        db.add(db_company)
        await db.commit()
        await db.refresh(db_company)
        return db_company
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database Error creating company: {str(e)}")

@router.get("/",status_code=status.HTTP_200_OK, response_model=list[CompanyResponse])
async def get_all_company(db:AsyncSession=Depends(get_db)):
    try:
        result = await db.execute(select(Company).options(selectinload(Company.jobs)))
        companies = result.scalars().all()
        return companies
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database Error fetching companies: {str(e)}")

@router.get("/{company_id}",status_code=status.HTTP_200_OK, response_model=CompanyResponse)
async def get_company(company_id:int, db:AsyncSession=Depends(get_db)):
    try:
        company = await db.execute(select(Company).filter(Company.id == company_id))
        company = company.scalars().first()
        if not company:
            raise HTTPException(status_code=404, detail="Company not found")
        return company
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database Error fetching company: {str(e)}")

@router.put("/{company_id}",status_code=status.HTTP_200_OK)
async def update_company(company_id:int,company:CompanyUpdate, db:AsyncSession=Depends(get_db), current_user=Depends(role_required(["admin"]))):
    try:
        db_company = await db.execute(select(Company).filter(Company.id == company_id))
        db_company = db_company.scalars().first()
        if not db_company:
            raise HTTPException(status_code=404, detail="Company not found")
        for key, value in company.dict().items():
            setattr(db_company, key, value)
        await db.commit()
        await db.refresh(db_company)
        return db_company
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database Error updating company: {str(e)}")

@router.delete("/{company_id}",status_code=status.HTTP_204_NO_CONTENT)
async def delete_company(company_id:int, db:AsyncSession=Depends(get_db), current_user=Depends(role_required(["admin"]))):
    try:
        db_company = await db.execute(select(Company).filter(Company.id == company_id))
        db_company = db_company.scalars().first()
        if not db_company:
            raise HTTPException(status_code=404, detail="Company not found")
        await db.delete(db_company)
        await db.commit()
        return {"message": "Company deleted successfully"}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database Error deleting company: {str(e)}")
