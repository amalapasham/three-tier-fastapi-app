from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import databases
import sqlalchemy
from typing import List

# Database setup
DATABASE_URL = "sqlite:///./amala.db"
database = databases.Database(DATABASE_URL)
metadata = sqlalchemy.MetaData()

# Users table
users = sqlalchemy.Table(
    "users",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("name", sqlalchemy.String(50)),
    sqlalchemy.Column("email", sqlalchemy.String(100)),
    sqlalchemy.Column("skills", sqlalchemy.String(500)),
)

app = FastAPI(
    title="Amala Pasham's API",
    description="My First FastAPI Project - Learning API Development",
    version="1.0.0"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    await database.connect()
    engine = sqlalchemy.create_engine(DATABASE_URL)
    metadata.create_all(engine)

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

# Routes
@app.get("/")
async def hello():
    return {"message": "Hello! This is Amala Pasham's first FastAPI!", "status": "success"}

@app.get("/about")
async def about_me():
    return {
        "name": "Amala Pasham",
        "project": "FastAPI Learning",
        "skills": ["Python", "API Development", "FastAPI"],
        "hobby": "Coding and exploring new technologies!"
    }

@app.post("/users/")
async def create_user(name: str, email: str):
    # Check current user count
    count_query = users.select()
    current_users = await database.fetch_all(count_query)
    
    # Limit to 5 users maximum
    if len(current_users) >= 5:
        raise HTTPException(status_code=400, detail="Maximum 5 users allowed")
    
    query = users.insert().values(name=name, email=email, skills="[]")
    user_id = await database.execute(query)
    return {"id": user_id, "name": name, "email": email, "status": "created"}

@app.get("/users/")
async def get_users():
    query = users.select()
    return await database.fetch_all(query)

# Add this delete function
@app.delete("/delete-amala-users/")
async def delete_amala_users():
    try:
        # Delete users with name 'Amala'
        query = users.delete().where(users.c.name == 'Amala')
        deleted_count = await database.execute(query)
        
        # Get remaining users count
        remaining_query = users.select()
        remaining_users = await database.fetch_all(remaining_query)
        
        return {
            "deleted_count": deleted_count,
            "message": f"Deleted {deleted_count} users named 'Amala'",
            "remaining_count": len(remaining_users)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))