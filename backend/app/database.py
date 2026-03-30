"""
Connexion à la base de données MySQL via SQLAlchemy.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import get_settings

settings = get_settings()

# URL de connexion (depuis .env : DATABASE_URL ou MYSQL_*)
database_url = settings.database_url
# Charset MySQL pour éviter les erreurs d'encodage (utf8mb4)
if "?" not in database_url:
    database_url = f"{database_url}?charset=utf8mb4"

engine = create_engine(
    database_url,
    pool_pre_ping=True,
    pool_recycle=3600,
    echo=settings.DEBUG,
    connect_args={"connect_timeout": 10},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """Générateur de session pour l'injection dans les routes FastAPI."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
