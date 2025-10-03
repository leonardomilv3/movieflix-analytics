import pandas as pd
import os
import ast
from sqlalchemy import create_engine, text
import time
import os
import kagglehub
from dotenv import load_dotenv



# =====================
# 0) Configuração com Banco PostgreSQL
# =====================

# # Carregar variáveis de ambiente do arquivo .env
# load_dotenv()

# # Variáveis de ambiente
# PG_USER = os.getenv("PG_USER")
# PG_PASS = os.getenv("PG_PASS")
# PG_DB   = os.getenv("PG_DB")
# PG_HOST = os.getenv("PG_HOST")
# PG_PORT = os.getenv("PG_PORT")


# # Conexão PostgreSQL
# conn_str = f"postgresql+psycopg2://{PG_USER}:{PG_PASS}@{PG_HOST}:{PG_PORT}/{PG_DB}"
# print("Conexão:", conn_str)

# time.sleep(5)
# engine = create_engine(conn_str, echo=False)




# =====================
# 1) EXTRAIR + TRANSFORMAR
# =====================

print("Início do ETL.")


# Caminho base
base_path = kagglehub.dataset_download("rounakbanik/the-movies-dataset")


# Carregar datasets
movies = pd.read_csv(os.path.join(base_path, "movies_metadata.csv"), low_memory=False)
credits = pd.read_csv(os.path.join(base_path, "credits.csv"))


# Tratamento movies_metadata
# Extrair ano do lançamento
movies["release_year"] = pd.to_numeric(movies["release_date"], errors="coerce")

# Converter colunas JSON (gêneros e países)
def parse_json_column(x, key):
    try:
        items = ast.literal_eval(x) if isinstance(x, str) else []
        return [d.get(key) for d in items if key in d]
    except:
        return []

movies["genres"] = movies["genres"].apply(lambda x: parse_json_column(x, "name"))
print(movies["genres"].head())
movies["countries"] = movies["production_countries"].apply(lambda x: parse_json_column(x, "name"))


# Tratamento credits.csv 
def get_director(crew_str):
    try:
        crew = ast.literal_eval(crew_str)
        for member in crew:
            if member.get("job") == "Director":
                return member.get("name")
    except:
        return None



def get_actors(cast_str, top_n=3):
    try:
        cast = ast.literal_eval(cast_str)
        return [actor.get("name") for actor in cast[:top_n]]
    except:import pandas as pd




credits["director"] = credits["crew"].apply(get_director)
credits["actors"] = credits["cast"].apply(lambda x: get_actors(x, top_n=5))


# Combinar Movies e Credits : Merge final

## O campo de chave é "id" (movies_metadata) e "id" (credits), mas precisa converter para int
movies["id"] = pd.to_numeric(movies["id"], errors="coerce")
credits["id"] = pd.to_numeric(credits["id"], errors="coerce")

df = pd.merge(
    movies,
    credits[["id", "director", "actors"]],
    on="id",
    how="left"
)

# Selecionar apenas as colunas necessárias
df = df[[
    "title",             # nome do filme
    "vote_average",      # nota média
    "vote_count",        # quantidade de avaliações
    "genres",            # gêneros
    "countries",         # países
    "release_year",      # ano de lançamento
    "director",          # diretor
    "actors"             # lista de atores
]]


# Padronizar colunas para DW
df = df.rename(columns={
    "title": "titulo",
    "vote_average": "nota_media",
    "vote_count": "qtd_avaliacoes",
    "genres": "genero",
    "countries": "pais",
    "release_year": "ano_lancamento",
    "director": "diretor",
    "actors": "atores"
})




# =====================
# 2) LOAD - Data Warehouse
# =====================


with engine.begin() as conn:
    create_table_sql = """
    CREATE TABLE IF NOT EXISTS filme (
        id SERIAL PRIMARY KEY,
        titulo TEXT,
        nota_media REAL,
        qtd_avaliacoes INTEGER,
        genero TEXT,
        pais TEXT,
        ano_lancamento INTEGER,
        diretor TEXT,
        atores TEXT
    );
    """
    conn.execute(text(create_table_sql))
    conn.execute(text("TRUNCATE TABLE filme;"))

df.to_sql("filme", engine, if_exists="append", index=False)

print("✅ Dados carregados na tabela 'filme' (Data Warehouse).")




# =====================
# 3) DATA Marts (Views)
# =====================

with engine.begin() as conn:
    # 3.1 Top 10 filmes com maior nota média
    conn.execute(text("""
        CREATE MATERIALIZED VIEW IF NOT EXISTS filme_top10_nota AS
        SELECT titulo, nota_media, qtd_avaliacoes, ano_lancamento, pais
        FROM filme
        ORDER BY qtd_avaliacoes DESC, nota_media DESC
        LIMIT 10;
    """))

    # 3.2 Filmes de comédia com maior nota média e quantidade de avaliações
    conn.execute(text("""
        CREATE MATERIALIZED VIEW IF NOT EXISTS filme_comedia_top AS
        SELECT titulo, genero, nota_media, qtd_avaliacoes, ano_lancamento, pais
        FROM filme
        WHERE genero ILIKE '%Comedy%'
        ORDER BY qtd_avaliacoes DESC, nota_media DESC;
    """))

    # 3.3 Filmes de animação com maior nota média e quantidade de avaliações
    conn.execute(text("""
        CREATE MATERIALIZED VIEW IF NOT EXISTS filme_animacao_top AS
        SELECT titulo, genero, nota_media, qtd_avaliacoes, ano_lancamento, pais
        FROM filme
        WHERE genero ILIKE '%Animation%'
        ORDER BY qtd_avaliacoes DESC, nota_media DESC;
    """))

print("✅ Data Marts criados como Views: filme_top10_nota, filme_comedia_top, filme_animacao_top")


print("Fim do ETL.")