from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes_auth import router as auth_router
from .routes_meal import router as meal_router
from .db import Base, engine

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Smart Diet Planner API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"status": "ok", "service": "smart-diet-planner"}

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(meal_router, prefix="/api/meal", tags=["meal"])
