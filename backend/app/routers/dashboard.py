"""
Endpoint Dashboard (données filtrées par entreprise via token JWT).
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.auth import get_entreprise_from_token
from app.models.offre import Offre
from app.models.candidature import Candidature
router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("", response_model=dict)
def get_dashboard(
    entreprise=Depends(get_entreprise_from_token),
    db: Session = Depends(get_db),
):
    """Retourne les données du dashboard de l'entreprise connectée."""
    offres = (
        db.query(Offre)
        .filter(Offre.entreprise_id == entreprise.id)
        .order_by(Offre.created_at.desc())
        .all()
    )
    offres_ids = [o.id for o in offres]
    candidats = (
        db.query(Candidature)
        .filter(Candidature.offre_id.in_(offres_ids))
        .order_by(Candidature.created_at.desc())
        .all()
    )
    return {
        "id_entreprise": entreprise.id_entreprise,
        "nom_entreprise": entreprise.nom_entreprise,
        "email": entreprise.email,
        "offres": [
            {
                "id": o.id,
                "titre": o.titre,
                "lien_uuid": o.lien_uuid,
                "created_at": o.created_at,
            }
            for o in offres
        ],
        "candidatures": [
            {
                "id": c.id,
                "offre_id": c.offre_id,
                "created_at": c.created_at,
            }
            for c in candidats
        ],
        "message": f"Dashboard de l'entreprise {entreprise.id_entreprise}",
    }
