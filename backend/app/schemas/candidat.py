"""
Schémas Pydantic pour Candidat.
"""
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional


class CandidatBase(BaseModel):
    email: EmailStr
    nom: str = Field(..., min_length=1, max_length=255)
    prenom: str = Field(..., min_length=1, max_length=255)


class CandidatCreate(CandidatBase):
    mot_de_passe: str = Field(..., min_length=8, max_length=128)


class CandidatUpdate(BaseModel):
    nom: Optional[str] = Field(None, min_length=1, max_length=255)
    prenom: Optional[str] = Field(None, min_length=1, max_length=255)
    mot_de_passe: Optional[str] = Field(None, min_length=8, max_length=128)


class CandidatLogin(BaseModel):
    email: EmailStr
    mot_de_passe: str


class CandidatResponse(CandidatBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
