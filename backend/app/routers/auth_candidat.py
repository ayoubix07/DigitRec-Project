"""
Inscription et connexion des candidats.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.candidat import Candidat
from app.schemas.candidat import CandidatCreate, CandidatLogin, CandidatResponse
from app.core.security import hasher_mot_de_passe, verifier_mot_de_passe, creer_access_token

router = APIRouter(prefix="/auth/candidat", tags=["Auth Candidat"])


@router.post("/inscription", response_model=CandidatResponse)
def inscription_candidat(data: CandidatCreate, db: Session = Depends(get_db)):
    if db.query(Candidat).filter(Candidat.email == data.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Un candidat avec cet email existe déjà.",
        )
    candidat = Candidat(
        email=data.email,
        mot_de_passe_hash=hasher_mot_de_passe(data.mot_de_passe),
        nom=data.nom,
        prenom=data.prenom,
    )
    db.add(candidat)
    db.commit()
    db.refresh(candidat)
    return candidat


@router.post("/login")
def login_candidat(data: CandidatLogin, db: Session = Depends(get_db)):
    candidat = db.query(Candidat).filter(Candidat.email == data.email).first()
    if not candidat or not verifier_mot_de_passe(data.mot_de_passe, candidat.mot_de_passe_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect.",
        )
    token = creer_access_token(
        data={"sub": str(candidat.id), "type": "candidat", "email": candidat.email}
    )
    return {"access_token": token, "token_type": "bearer", "candidat": CandidatResponse.model_validate(candidat)}
