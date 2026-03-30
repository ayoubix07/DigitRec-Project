"""
Candidatures : dépôt par le candidat et liste par l'entreprise.
"""
import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.entreprise import Entreprise
from app.models.offre import Offre
from app.models.candidat import Candidat
from app.models.candidature import Candidature
from app.schemas.candidature import CandidatureResponse, CandidatureResponseDetail, StatutCandidatureEnum
from app.core.auth import get_entreprise_from_token, get_candidat_from_token
from app.config import get_settings

router = APIRouter(prefix="/candidatures", tags=["Candidatures"])
settings = get_settings()


def _allowed_extension(filename: str) -> bool:
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    return ext in settings.ALLOWED_CV_EXTENSIONS.split(",")


@router.post("/offre/{lien_uuid}")
def soumettre_candidature(
    lien_uuid: str,
    cv: UploadFile = File(...),
  db: Session = Depends(get_db),
  candidat: Candidat = Depends(get_candidat_from_token),
):
    """Le candidat connecté soumet sa candidature (upload CV) pour l'offre donnée par son lien UUID."""
    offre = db.query(Offre).filter(Offre.lien_uuid == lien_uuid, Offre.actif == True).first()
    if not offre:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Offre introuvable ou inactive")
    if not _allowed_extension(cv.filename or ""):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Format de CV non autorisé. Autorisés : {settings.ALLOWED_CV_EXTENSIONS}",
        )
    existing = db.query(Candidature).filter(
        Candidature.candidat_id == candidat.id,
        Candidature.offre_id == offre.id,
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vous avez déjà soumis une candidature pour cette offre.",
        )
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    ext = (cv.filename or "pdf").rsplit(".", 1)[-1].lower()
    unique_name = f"{uuid.uuid4()}.{ext}"
    file_path = os.path.join(settings.UPLOAD_DIR, unique_name)
    with open(file_path, "wb") as f:
        f.write(cv.file.read())
    candidature = Candidature(
        candidat_id=candidat.id,
        offre_id=offre.id,
        cv_path=file_path,
    )
    db.add(candidature)
    db.commit()
    db.refresh(candidature)
    return CandidatureResponse.model_validate(candidature)


@router.get("", response_model=list[CandidatureResponseDetail])
def lister_candidatures_entreprise(
    db: Session = Depends(get_db),
    entreprise: Entreprise = Depends(get_entreprise_from_token),
):
    """Liste des candidatures pour les offres de l'entreprise connectée."""
    offres_ids = [o.id for o in db.query(Offre).filter(Offre.entreprise_id == entreprise.id).all()]
    candidatures = (
        db.query(Candidature)
        .filter(Candidature.offre_id.in_(offres_ids))
        .order_by(Candidature.created_at.desc())
        .all()
    )
    result = []
    for c in candidatures:
        r = CandidatureResponseDetail.model_validate(c)
        r.candidat_nom = c.candidat.nom
        r.candidat_prenom = c.candidat.prenom
        r.candidat_email = c.candidat.email
        r.offre_titre = c.offre.titre
        result.append(r)
    return result


@router.get("/offre/{offre_id}", response_model=list[CandidatureResponseDetail])
def lister_candidatures_par_offre(
  offre_id: int,
  db: Session = Depends(get_db),
  entreprise: Entreprise = Depends(get_entreprise_from_token),
):
    offre = db.query(Offre).filter(Offre.id == offre_id, Offre.entreprise_id == entreprise.id).first()
    if not offre:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Offre introuvable")
    candidatures = db.query(Candidature).filter(Candidature.offre_id == offre_id).order_by(Candidature.created_at.desc()).all()
    result = []
    for c in candidatures:
        r = CandidatureResponseDetail.model_validate(c)
        r.candidat_nom = c.candidat.nom
        r.candidat_prenom = c.candidat.prenom
        r.candidat_email = c.candidat.email
        r.offre_titre = c.offre.titre
        result.append(r)
    return result
