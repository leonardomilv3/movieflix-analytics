from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, TIMESTAMP, func
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.dialects.postgresql import JSONB

Base = declarative_base()

class Movie(Base):
    __tablename__ = "filme"  # integrando com a tabela gerada pelo ETL
    id = Column(Integer, primary_key=True, autoincrement=True)
    titulo = Column(Text)
    nota_media = Column(Float, default=0.0)
    qtd_avaliacoes = Column(Integer, default=0)
    genero = Column(Text)
    pais = Column(Text)
    ano_lancamento = Column(Integer)
    diretor = Column(Text)
    atores = Column(Text)  # array-string ou JSON text
    # Observação: esta model mapeia a tabela criada pelo ETL.

class Rating(Base):
    __tablename__ = "ratings_user"
    id = Column(Integer, primary_key=True, autoincrement=True)
    movie_id = Column(Integer, ForeignKey("filme.id", ondelete="CASCADE"), nullable=False)
    usuario = Column(String(128), nullable=True)
    rating = Column(Float, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    movie = relationship("Movie", backref="ratings")
