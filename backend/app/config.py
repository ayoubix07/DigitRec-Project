"""
Configuration de l'application via variables d'environnement.
"""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Paramètres de l'application ATS."""

    # Connexion MySQL : soit DATABASE_URL, soit les variables MYSQL_*
    DATABASE_URL: str = ""

    # Variables MySQL (utilisées si DATABASE_URL est vide)
    MYSQL_HOST: str = "localhost"
    MYSQL_PORT: int = 3306
    MYSQL_USER: str = "root"
    MYSQL_PASSWORD: str = ""
    MYSQL_DATABASE: str = "ats_recrutement"

    # Application
    APP_NAME: str = "DigitRec"
    DEBUG: bool = False

    # JWT
    SECRET_KEY: str = "changez-moi-en-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30  # 30 minutes

    # Upload CV
    UPLOAD_DIR: str = "uploads/cv"
    MAX_CV_SIZE_MB: int = 5
    ALLOWED_CV_EXTENSIONS: str = "pdf,doc,docx"

    @property
    def database_url(self) -> str:
        """URL de connexion MySQL pour SQLAlchemy."""
        if self.DATABASE_URL:
            return self.DATABASE_URL
        return (
            f"mysql+pymysql://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}"
            f"@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DATABASE}"
        )

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True
        extra = "ignore"


@lru_cache
def get_settings() -> Settings:
    """Retourne les paramètres (mis en cache)."""
    return Settings()
