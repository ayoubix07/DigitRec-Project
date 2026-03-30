"""
Schémas Pydantic pour la validation et la sérialisation.
"""
from app.schemas.entreprise import (
    EntrepriseCreate,
    EntrepriseUpdate,
    EntrepriseResponse,
    EntrepriseLogin,
)
from app.schemas.offre import (
    OffreCreate,
    OffreUpdate,
    OffreResponse,
    TypeTestEnum,
)
from app.schemas.candidat import (
    CandidatCreate,
    CandidatUpdate,
    CandidatResponse,
    CandidatLogin,
)
from app.schemas.candidature import (
    CandidatureCreate,
    CandidatureUpdate,
    CandidatureResponse,
    StatutCandidatureEnum,
)

__all__ = [
    "EntrepriseCreate",
    "EntrepriseUpdate",
    "EntrepriseResponse",
    "EntrepriseLogin",
    "OffreCreate",
    "OffreUpdate",
    "OffreResponse",
    "TypeTestEnum",
    "CandidatCreate",
    "CandidatUpdate",
    "CandidatResponse",
    "CandidatLogin",
    "CandidatureCreate",
    "CandidatureUpdate",
    "CandidatureResponse",
    "StatutCandidatureEnum",
]
