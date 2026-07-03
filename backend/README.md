fastapiapp
creating fastapi application
CRUD operations
Create
Read
Update
Delete
Rest API
GET
POST
PUT
DELETE
status codes
200 OK
201 Created
204 No Content
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
405 Method Not Allowed
409 Conflict
500 Internal Server Error
Architecture of fastapi application
Model -- tables creation
Router -- routes requests to controllers
Controller -- controller logic
Service -- business logic
Repository -- data access layer
Middleware -- request processing pipeline
schema -- pydantic models for validation
database
relational database
mysql
postgresql
sqlite
sql server
non-relational database
mongodb
cassandra
redis
dynamodb
constraints in database
primary key -- eg: student_id
foreign key -- eg: department_id in student table
unique --eg: email, phonenumber
not null --eg: name
check -- eg: salary > 0
default -- eg: timestamp: func.now()
mysql example
CREATE TABLE Students( Student_ID int PRIMARY KEY, LastName varchar(255) NOT NULL, FirstName varchar(255) );

modules
sqlalchemy -- orm (object relational mapping)
fastapi -- web framework
uvicorn -- server for running fastapi application --> uvicorn app.main:app --reload
psycopg2 -- postgresql driver
pydantic -- data validation
alembic -- database migration
typing-extensions -- type hints
Concepts:
ORM
Object Relational Mapping --> to convert python code to sql commands without writing sql commands
Depends
Dependency injection --> to inject dependencies into route handlers
Sessionmaker
To create a session with the database
SessionLocal
To create a session with the database for a single request
declartive_base
To create a base class for all the models
pip install alembic alembic init alembic alembic-> env.py -> from imported model ->metadata data alembic.ini->sqlalchemy.url to postgresql database url ---> postgresql://user:password@host:port/database_name alembic revision --autogenerate -m "initial migration" you will have a new version update with def upgrade() in that for eg:713e98317319.py before doing upgrade check that. alembic upgrade head

pip install passlib pip install python-jose[cryptography]

passlib- used to encrypt passwords

hashing algorithm
argon2 bcrypt

python-jose[cryptography]- used to create jwt tokens jwt tokens -> used to authenticate and authorize users its in format xxxx.yyyyy.zzzz basically 3 parts 1.header -> algo + token type:{alg:HS256,typ:JWT} 2.payload -> data, for eg: {user_id:1,role:admin} 3.signature -> used to verify the token:{hash(header+payload+secretkey)} access token -> used to access protected resources refresh token -> used to refresh access token

pip install python-multipart

RBAC
Role Based Access Control -> used to give different permissions to different roles -> eg: admin can do anything, user can do only specific things use oauth2 module to implement RBAC -->get_current_user() - for authenticated user -->role_required() - for role based access control create_access_token() - for creating access token with (secret_key,algorithm,payload) - token created then verify_access_token() - for decoding access token with (secret_key,algorithm,token) - token decoded then
flow of application
1.login --> create access token 2.access token --> get current user 3.current user --> get role --> role_required --> access protected resources

npm install vite@latest node -v , npm -v npm install -g typescript npm create vite@latest talentspark react->typescript->eslint->install eslint for typescript cd talentspark/ npm run dev javascript -> ES6 -> arrow functions, rest and spread, template literals, destructuring, promises, async/await dom-> document object manipulation Virtual dom-> react virtual dom->copy of original dom which will update react dom and then updated dom will be updated in real dom components-which are different sections of the web page

gmeetcode-https://meet.google.com/ens-mkxd-wgb meet code-ens-mkxd-wgb

npm install axios

ui->axios->localhost:8000(api call)->fastapi(python)->db->useeffect->setstate->rerender->ui

useeffect-which is used to call the api or which is used to fetch the data from the api automatically when the page is loaded

useState-which is used to store the data in the component and which will update the component when the data is updated or changed

axios - which is used to call the api or which is used to fetch the data from the api

promise - which is used to handle the asynchronous operations

async/await - which is used to handle the asynchronous operations in a synchronous way


SSE-Server sent events ->it is used to send the response from server to client in form of chunks of text so that we can show the response in form of chunks of text like chatbot ui
RAG-Retrieval Augmented Generation-it is used to increase the accuracy of llm by providing relevant information to the llm
context-window-it is the maximum number of words that the llm can process at a time
Langchain->it's a framework to build llms, its useful to connect llm to external sources of information->like database, files, websites ->it is used to create complex workflows of llm->like chatbot that can answer questions about specific documents