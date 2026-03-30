"""
ATS Recrutement - Point d'entrée FastAPI.
"""
import traceback
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.database import engine, Base
from app import models  # noqa: F401 - enregistrement des modèles pour create_all
from app.routers import auth_entreprise, auth_candidat, offres, candidatures
from app.routers.dashboard import router as dashboard_router

settings = get_settings()

# Création des tables si elles n'existent pas (optionnel si vous utilisez schema.sql)
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"[ATTENTION] Création des tables : {e}")

app = FastAPI(
    title=settings.APP_NAME,
    description="Plateforme de recrutement SaaS - Gestion des offres et candidatures",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Préfixe global API
app.include_router(auth_entreprise.router, prefix="/api")
app.include_router(auth_candidat.router, prefix="/api")
app.include_router(offres.router, prefix="/api")
app.include_router(candidatures.router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")


@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    return response


@app.get("/")
def root():
    return {"message": "Bienvenue sur l'API ATS Recrutement", "docs": "/docs"}


@app.get("/sante")
def sante():
    return {"status": "ok"}


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Retourne le détail de l'erreur en 500 pour faciliter le diagnostic."""
    detail = str(exc)
    if settings.DEBUG:
        detail += "\n" + traceback.format_exc()
    return JSONResponse(
        status_code=500,
        content={"detail": detail, "type": type(exc).__name__},
    )
