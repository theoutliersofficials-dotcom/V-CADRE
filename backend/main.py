from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.buildings import router as buildings_router
from app.api.topology import router as topology_router
from app.api.risk_score import router as risk_score_router
from app.api.auth import router as auth_router
from app.database import create_tables


app = FastAPI(
    title="V-CADRE API",
    description="College Property Mapping System",
    version="1.0.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://v-cadre.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    create_tables()


app.include_router(buildings_router)
app.include_router(topology_router)
app.include_router(risk_score_router)
app.include_router(auth_router)

@app.get("/")
def root():
    return {
        "message": "V-CADRE API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }