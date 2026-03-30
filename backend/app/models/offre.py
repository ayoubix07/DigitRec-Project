"""
Modèle Offre d'emploi.
"""
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.database import Base


class TypeTest(str, enum.Enum):
    QCM = "QCM"
    Exercice = "Exercice"


class Offre(Base):
    __tablename__ = "offres"

    id = Column(Integer, primary_key=True, autoincrement=True)
    entreprise_id = Column(Integer, ForeignKey("entreprises.id", ondelete="CASCADE"), nullable=False)
    titre = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    type_test = Column(Enum(TypeTest), nullable=False, default=TypeTest.QCM)
    lien_uuid = Column(String(36), unique=True, nullable=False, index=True)
    actif = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relations
    entreprise = relationship("Entreprise", back_populates="offres")
    candidatures = relationship("Candidature", back_populates="offre", cascade="all, delete-orphan")
