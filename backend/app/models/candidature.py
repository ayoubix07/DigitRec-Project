"""
Modèle Candidature (lien Candidat <-> Offre + CV).
"""
from sqlalchemy import Column, Integer, String, DateTime, Enum, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.database import Base


class StatutCandidature(str, enum.Enum):
    nouvelle = "nouvelle"
    en_cours = "en_cours"
    acceptee = "acceptee"
    refusee = "refusee"


class Candidature(Base):
    __tablename__ = "candidatures"
    __table_args__ = (UniqueConstraint("candidat_id", "offre_id", name="uq_candidat_offre"),)

    id = Column(Integer, primary_key=True, autoincrement=True)
    candidat_id = Column(Integer, ForeignKey("candidats.id", ondelete="CASCADE"), nullable=False)
    offre_id = Column(Integer, ForeignKey("offres.id", ondelete="CASCADE"), nullable=False)
    cv_path = Column(String(512), nullable=False)
    statut = Column(Enum(StatutCandidature), default=StatutCandidature.nouvelle)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relations
    candidat = relationship("Candidat", back_populates="candidatures")
    offre = relationship("Offre", back_populates="candidatures")
