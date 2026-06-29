# Fastapiapp

## creating fastapi application


## crud operations
-create
-read
-update
-delete


## Rest API

-Get
-Post
-Put
-Del


## Architecture of FastAPI application
--Model  
--Router  
--Controller  
--Service  
--Repositor  
--Middleware  
--Schem  

## models
alembic ---- database migration



# concepts
# Concepts:

pip install alembic

alembic init alembic

alembic -> env.py -> from imported model -> metadata data

alembic.ini -> sqlalchemy.url = postgres url
--> postgresql://user:password@host:port/database_name

alembic revision --autogenerate -m "initial migration"

alembic upgrade head
