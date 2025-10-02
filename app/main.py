import os
from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy import text, select, func
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from typing import List
from fastapi.middleware.cors import CORSMiddleware

from db import SessionLocal, engine
import models, schemas

# criar tabelas se não existirem (ratings_user)
models.Base.metadata.create_all(bind=engine, tables=[models.Rating.__table__])

app = FastAPI(title="MovieFlix Analytics API")

origins = [
    "http://localhost:5173",  # frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # ou ["*"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/movies", response_model=List[schemas.MovieOut])
def list_movies(limit: int = 50, offset: int = 0, db: Session = Depends(get_db)):
    stmt = select(models.Movie).limit(limit).offset(offset)
    movies = db.execute(stmt).scalars().all()
    return movies

@app.get("/movies/{movie_id}", response_model=schemas.MovieOut)
def get_movie(movie_id: int, db: Session = Depends(get_db)):
    movie = db.get(models.Movie, movie_id)
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    return movie

@app.post("/movies", response_model=schemas.MovieOut, status_code=201)
def create_movie(data: schemas.MovieCreate, db: Session = Depends(get_db)):
    # Inserir novo filme na tabela filme (DW)
    try:
        m = models.Movie(
            titulo=data.titulo,
            ano_lancamento=data.ano_lancamento,
            genero=data.genero,
            pais=data.pais,
            diretor=data.diretor,
            atores=data.atores,
            nota_media=0.0,
            qtd_avaliacoes=0
        )
        db.add(m)
        db.commit()
        db.refresh(m)
        return m
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ratings", status_code=201)
def submit_rating(rating_in: schemas.RatingCreate, db: Session = Depends(get_db)):
    # 1) validar existência do filme
    movie = db.get(models.Movie, rating_in.movie_id)
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    # 2) inserir rating
    r = models.Rating(
        movie_id=rating_in.movie_id,
        usuario=rating_in.usuario,
        rating=rating_in.rating
    )
    db.add(r)
    db.flush()  # garante id pra usar em cálculos

    # 3) recalcular agregados com base na tabela ratings_user
    #    (mais seguro que atualizar incrementalmente)
    stmt = select(func.count(models.Rating.id), func.avg(models.Rating.rating)).where(models.Rating.movie_id == rating_in.movie_id)
    count, avg = db.execute(stmt).one()
    # atualizar o filme
    movie.qtd_avaliacoes = int(count or 0)
    movie.nota_media = float(avg or 0.0)
    db.commit()
    return {"movie_id": rating_in.movie_id, "nota_media": movie.nota_media, "qtd_avaliacoes": movie.qtd_avaliacoes}

@app.post("/admin/refresh-materialized-views")
def refresh_materialized_views(db: Session = Depends(get_db)):
    # Roda REFRESH MATERIALIZED VIEW para os data marts criados pelo ETL
    try:
        db.execute(text("REFRESH MATERIALIZED VIEW CONCURRENTLY IF EXISTS filme_top10_nota;"))
        db.execute(text("REFRESH MATERIALIZED VIEW CONCURRENTLY IF EXISTS filme_comedia_top;"))
        db.execute(text("REFRESH MATERIALIZED VIEW CONCURRENTLY IF EXISTS filme_animacao_top;"))
        db.commit()
    except Exception:
        db.rollback()
        # fallback non-concurrent
        db.execute(text("REFRESH MATERIALIZED VIEW IF EXISTS filme_top10_nota;"))
        db.execute(text("REFRESH MATERIALIZED VIEW IF EXISTS filme_comedia_top;"))
        db.execute(text("REFRESH MATERIALIZED VIEW IF EXISTS filme_animacao_top;"))
        db.commit()
    return {"refreshed": True}
