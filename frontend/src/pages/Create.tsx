import { useState } from 'react';
import { movieApi } from '../services/api';
import type { MovieCreate, Movie, RatingCreate } from '../types/movie';

const initialMovie: MovieCreate = {
  titulo: '',
  genero: '',
  pais: '',
  ano_lancamento: new Date().getFullYear(),
  diretor: '',
  atores: '',
};

const Create = () => {
  const [movieData, setMovieData] = useState<MovieCreate>(initialMovie);
  const [createdMovie, setCreatedMovie] = useState<Movie | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [username, setUsername] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMovieData(prev => ({
      ...prev,
      [name]: name === 'ano_lancamento' ? Number(value) : value,
    }));
  };

  const handleCreateMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const movie = await movieApi.createMovie(movieData);
      setCreatedMovie(movie);
      setSuccess('Filme criado com sucesso!');
    } catch (err: any) {
      setError('Erro ao criar filme.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRating = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createdMovie) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const ratingPayload: RatingCreate = {
        movie_id: createdMovie.id,
        usuario: username,
        rating,
      };
      await movieApi.submitRating(ratingPayload);
      setSuccess('Avaliação enviada com sucesso!');
      // Atualiza dados do filme após avaliação
      const updatedMovie = await movieApi.getMovie(createdMovie.id);
      setCreatedMovie(updatedMovie);
    } catch (err: any) {
      setError('Erro ao enviar avaliação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6 text-netflix-red">Criar Novo Filme</h2>
      <form onSubmit={handleCreateMovie} className="space-y-4 bg-gray-800 p-6 rounded-lg shadow">
        <input
          type="text"
          name="titulo"
          placeholder="Título"
          value={movieData.titulo}
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        <input
          type="text"
          name="genero"
          placeholder="Gênero"
          value={movieData.genero}
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        <input
          type="text"
          name="pais"
          placeholder="País"
          value={movieData.pais}
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        <input
          type="number"
          name="ano_lancamento"
          placeholder="Ano de Lançamento"
          value={movieData.ano_lancamento}
          onChange={handleChange}
          required
          min={1900}
          max={new Date().getFullYear()}
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        <input
          type="text"
          name="diretor"
          placeholder="Diretor"
          value={movieData.diretor}
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        <input
          type="text"
          name="atores"
          placeholder="Atores"
          value={movieData.atores}
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-netflix-red text-white px-4 py-2 rounded hover:bg-red-700"
        >
          {loading ? 'Criando...' : 'Criar Filme'}
        </button>
      </form>

      {error && <div className="mt-4 text-red-500">{error}</div>}
      {success && <div className="mt-4 text-green-500">{success}</div>}

      {createdMovie && (
        <div className="mt-10 bg-gray-900 p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-2 text-netflix-red">{createdMovie.titulo}</h3>
          <p><strong>Gênero:</strong> {createdMovie.genero}</p>
          <p><strong>País:</strong> {createdMovie.pais}</p>
          <p><strong>Ano:</strong> {createdMovie.ano_lancamento}</p>
          <p><strong>Diretor:</strong> {createdMovie.diretor}</p>
          <p><strong>Atores:</strong> {createdMovie.atores}</p>
          <p><strong>Média de Avaliação:</strong> {createdMovie.nota_media ?? 'Sem avaliações'}</p>
          <p><strong>Qtd. Avaliações:</strong> {createdMovie.qtd_avaliacoes ?? 0}</p>

          <form onSubmit={handleSubmitRating} className="mt-6 space-y-3">
            <h4 className="font-semibold text-lg">Avaliar este filme</h4>
            <input
              type="text"
              placeholder="Seu nome de usuário"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
            <input
              type="number"
              placeholder="Nota (1 a 5)"
              value={rating}
              onChange={e => setRating(Number(e.target.value))}
              required
              min={1}
              max={5}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-netflix-red text-white px-4 py-2 rounded hover:bg-red-700"
            >
              {loading ? 'Enviando...' : 'Enviar Avaliação'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Create;