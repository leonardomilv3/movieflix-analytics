from pydantic import BaseModel
from typing import Optional, List

class MovieCreate(BaseModel):
    titulo: str
    ano_lancamento: Optional[int] = None
    genero: Optional[str] = None
    pais: Optional[str] = None
    diretor: Optional[str] = None
    atores: Optional[str] = None

class MovieOut(BaseModel):
    id: int
    titulo: str
    nota_media: float
    qtd_avaliacoes: int
    genero: Optional[str] = None
    pais: Optional[str] = None
    ano_lancamento: Optional[int] = None
    diretor: Optional[str] = None
    atores: Optional[str] = None

    class Config:
        orm_mode = True

class RatingCreate(BaseModel):
    movie_id: int
    usuario: Optional[str] = None
    rating: float
