"""
Schémas Pydantic pour Offre d'emploi.
"""
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from enum import Enum


class TypeTestEnum(str, Enum):
    QCM = "QCM"
    Exercice = "Exercice"


class OffreBase(BaseModel):
    titre: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=1)
    type_test: TypeTestEnum = TypeTestEnum.QCM


class OffreCreate(OffreBase):
    pass


class OffreUpdate(BaseModel):
    titre: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, min_length=1)
    type_test: Optional[TypeTestEnum] = None
    actif: Optional[bool] = None


class OffreResponse(OffreBase):
    id: int
    entreprise_id: int
    lien_uuid: str
    actif: bool
    created_at: datetime

    class Config:
        from_attributes = True


class OffreResponseAvecLien(OffreResponse):
    """Inclut l'URL complète de candidature pour l'entreprise."""
    lien_candidature: str = ""

    class Config:
        from_attributes = True
