"""
Inscription et connexion des entreprises.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.entreprise import Entreprise
from app.schemas.entreprise import EntrepriseCreate, EntrepriseLogin, EntrepriseResponse
from app.core.security import hasher_mot_de_passe, verifier_mot_de_passe, creer_access_token

router = APIRouter(prefix="/auth/entreprise", tags=["Auth Entreprise"])


@router.post("/inscription", response_model=EntrepriseResponse)
def inscription_entreprise(data: EntrepriseCreate, db: Session = Depends(get_db)):
    if db.query(Entreprise).filter(Entreprise.email == data.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Une entreprise avec cet email existe déjà.",
        )
    entreprise = Entreprise(
        email=data.email,
        mot_de_passe_hash=hasher_mot_de_passe(data.mot_de_passe),
        nom_entreprise=data.nom_entreprise,
    )
    db.add(entreprise)
    db.commit()
    db.refresh(entreprise)
    print(f"[DEBUG] entreprise créée: id={entreprise.id}, id_entreprise={entreprise.id_entreprise}")
    return entreprise


@router.get("/debug/entreprises")
def debug_list_entreprises(db: Session = Depends(get_db)):
    entreprises = db.query(Entreprise).all()
    return [{"id": e.id, "id_entreprise": e.id_entreprise, "email": e.email, "nom_entreprise": e.nom_entreprise} for e in entreprises]


@router.post("/login")
def login_entreprise(data: EntrepriseLogin, db: Session = Depends(get_db)):
    entreprise = db.query(Entreprise).filter(Entreprise.email == data.email).first()
    if not entreprise or not verifier_mot_de_passe(data.mot_de_passe, entreprise.mot_de_passe_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect.",
        )
    token = creer_access_token(
        data={"sub": entreprise.id_entreprise, "type": "entreprise", "email": entreprise.email}
    )
    return {
        "access_token": token,
        "token_type": "bearer",
        "entreprise": EntrepriseResponse.model_validate(entreprise),
    }
