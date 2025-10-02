export interface Movie {
  id: number;
  titulo: string;
  ano_lancamento: number;
  genero: string;
  pais: string;
  diretor: string;
  atores: string;
  nota_media: number;
  qtd_avaliacoes: number;
}

export interface MovieCreate {
  titulo: string;
  ano_lancamento: number;
  genero: string;
  pais: string;
  diretor: string;
  atores: string;
}

export interface RatingCreate {
  movie_id: number;
  usuario: string;
  rating: number;
}

export interface RatingResponse {
  movie_id: number;
  nota_media: number;
  qtd_avaliacoes: number;
}

export interface HealthResponse {
  status: string;
}
