"""
Schémas Pydantic pour Entreprise.
"""
from pydantic import BaseModel, EmailStr, Field, model_validator
from datetime import datetime
from typing import Optional, Any


class EntrepriseBase(BaseModel):
    email: EmailStr
    nom_entreprise: str = Field(..., min_length=1, max_length=255)

    class Config:
        populate_by_name = True


class EntrepriseCreate(EntrepriseBase):
    mot_de_passe: str = Field(..., min_length=8, max_length=128)
    non_entreprise: Optional[str] = Field(None, alias="non_entreprise")

    @model_validator(mode="before")
    @classmethod
    def nom_entreprise_from_non_entreprise(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if "nom_entreprise" not in data or data.get("nom_entreprise") is None:
                if "non_entreprise" in data and data["non_entreprise"]:
                    data = {**data, "nom_entreprise": data["non_entreprise"]}
        return data


class EntrepriseUpdate(BaseModel):
    nom_entreprise: Optional[str] = Field(None, min_length=1, max_length=255)
    mot_de_passe: Optional[str] = Field(None, min_length=8, max_length=128)


class EntrepriseLogin(BaseModel):
    email: EmailStr
    mot_de_passe: str


class EntrepriseResponse(EntrepriseBase):
    id: int
    id_entreprise: str
    created_at: datetime

    class Config:
        from_attributes = True


class TokenData(BaseModel):
    id_entreprise: str
    email: str
