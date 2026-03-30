"""
CRUD Offres d'emploi et génération du lien unique (UUID).
"""
import uuid
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.entreprise import Entreprise
from app.models.offre import Offre
from app.models.candidature import Candidature
from app.schemas.offre import OffreCreate, OffreUpdate, OffreResponse, OffreResponseAvecLien, TypeTestEnum
from app.core.auth import get_entreprise_from_token

router = APIRouter(prefix="/offres", tags=["Offres"])


def _lien_candidature(request: Request, lien_uuid: str) -> str:
    """Construit l'URL absolue du portail candidat pour une offre."""
    base = request.base_url
    return f"{base}portal/{lien_uuid}".rstrip("/")


@router.post("", response_model=OffreResponseAvecLien)
def creer_offre(
    data: OffreCreate,
    request: Request,
    db: Session = Depends(get_db),
    entreprise: Entreprise = Depends(get_entreprise_from_token),
):
    lien_uuid = str(uuid.uuid4())
    offre = Offre(
        entreprise_id=entreprise.id,
        titre=data.titre,
        description=data.description,
        type_test=data.type_test.value,
        lien_uuid=lien_uuid,
    )
    db.add(offre)
    db.commit()
    db.refresh(offre)
    response = OffreResponseAvecLien.model_validate(offre)
    response.lien_candidature = _lien_candidature(request, lien_uuid)
    return response


@router.get("", response_model=list[OffreResponse])
def lister_offres(
    db: Session = Depends(get_db),
    entreprise: Entreprise = Depends(get_entreprise_from_token),
):
    return db.query(Offre).filter(Offre.entreprise_id == entreprise.id).order_by(Offre.created_at.desc()).all()


@router.get("/dashboard/stats")
def stats_dashboard(
    db: Session = Depends(get_db),
    entreprise: Entreprise = Depends(get_entreprise_from_token),
):
    """Statistiques : nombre de CV/candidatures par offre."""
    offres = db.query(Offre).filter(Offre.entreprise_id == entreprise.id).all()
    stats = []
    total_cv = 0
    for o in offres:
        count = db.query(Candidature).filter(Candidature.offre_id == o.id).count()
        total_cv += count
        stats.append({"offre_id": o.id, "titre": o.titre, "nombre_cv": count})
    return {"total_candidatures": total_cv, "par_offre": stats}


@router.get("/{offre_id}", response_model=OffreResponse)
def get_offre(
    offre_id: int,
    db: Session = Depends(get_db),
    entreprise: Entreprise = Depends(get_entreprise_from_token),
):
    offre = db.query(Offre).filter(Offre.id == offre_id, Offre.entreprise_id == entreprise.id).first()
    if not offre:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Offre introuvable")
    return offre


@router.patch("/{offre_id}", response_model=OffreResponse)
def modifier_offre(
    offre_id: int,
    data: OffreUpdate,
    db: Session = Depends(get_db),
    entreprise: Entreprise = Depends(get_entreprise_from_token),
):
    offre = db.query(Offre).filter(Offre.id == offre_id, Offre.entreprise_id == entreprise.id).first()
    if not offre:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Offre introuvable")
    update = data.model_dump(exclude_unset=True)
    if "type_test" in update and isinstance(update["type_test"], TypeTestEnum):
        update["type_test"] = update["type_test"].value
    for k, v in update.items():
        setattr(offre, k, v)
    db.commit()
    db.refresh(offre)
    return offre


@router.get("/lien/{lien_uuid}", response_model=dict)
def get_offre_par_lien(
    lien_uuid: str,
    request: Request,
    db: Session = Depends(get_db),
):
    """Portail candidat : récupérer les infos de l'offre à partir du lien UUID (sans auth)."""
    offre = db.query(Offre).filter(Offre.lien_uuid == lien_uuid, Offre.actif == True).first()
    if not offre:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Offre introuvable ou inactive")
    return {
        "offre_id": offre.id,
        "titre": offre.titre,
        "description": offre.description,
        "type_test": offre.type_test.value,
        "lien_uuid": offre.lien_uuid,
    }
