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


## RBAC- role based access control
-> used to give different permissions to different roles
-> eg: admin can do anything, user can do only specific things
use oauth2 module to implement RBAC
-->get_current_user() -for authenticated user
-->role_required() for role based access control -
create_access_token() -for creating access token with
(secrect_key, algorithm, payload) token created then -
verify_access_token() -for decoding access token with
(secrect kev.algorithm.token) -token decoded then