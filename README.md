# 🎬 MovieFlix Analytics

**MovieFlix Analytics** é uma plataforma fictícia de streaming de filmes, desenvolvida para demonstrar **o ciclo completo de desenvolvimento de uma aplicação web + pipeline de dados + CI/CD com Docker**.  
O sistema permite cadastrar filmes, avaliá-los e extrair **insights de negócio** a partir dessas avaliações através de um fluxo ETL com Data Lake, Data Warehouse e Data Marts.

---

## Sumário

- [Arquitetura Geral](#-arquitetura-geral)
- [1. Aplicação Web](#1-aplicação-web)
- [2. Pipeline ETL + Data Lake/DW/Data Marts](#2-pipeline-etl--data-lakedwdata-marts)
- [3. Containerização com Docker](#3-containerização-com-docker)
- [4. Pipeline CI/CD (GitHub Actions + DockerHub)](#4-pipeline-cicd-github-actions--dockerhub)
- [5. Visões de Negócio - Data Marts](#5-visões-de-negócio---data-marts)
- [6. Como Executar o Projeto](#6-como-executar-o-projeto)


---

## Arquitetura Geral


    ┌───────────────────┐
    │  Frontend (React) │  ← roda localmente (npm run dev)
    └─────────┬─────────┘
              │
       Reverse Proxy (Nginx)
              │
    ┌─────────▼──────────┐
    │  Backend (FastAPI) │  ← Container Docker
    └─────────┬──────────┘
              │
    ┌─────────▼───────────┐
    │ Banco de Dados (PG) │  ← Volume persistente
    └─────────┬───────────┘
              │
    ┌─────────▼────────────┐
    │     ETL Container    │ ← Extrai/Agrupa dados → DW/Data Mart
    └──────────────────────┘




- **Frontend:** Interface para cadastro e avaliação de filmes (React).
- **Backend:** API REST para gerenciar filmes e avaliações (FastAPI ou Node, containerizado).
- **ETL:** Processo em container que simula ingestão de dados no Data Lake, transformação no DW e geração de visões de negócio nos Data Marts.
- **Docker Compose:** Orquestra containers do backend, ETL e banco de dados.
- **GitHub Actions:** Faz build & push automático das imagens para o DockerHub a cada push na branch `main`.

---

## 1. Aplicação Web

###  Funcionalidades
- Cadastro de filmes (título, ano, gênero).
- Avaliação de filmes com notas de 0 a 5.
- Listagem de filmes com médias atualizadas em tempo real.
- Dashboard básico com estatísticas de avaliações.

### Stack
- **Frontend:** React + Vite (roda localmente com `npm run dev`).
- **Backend:** FastAPI (Python) com SQLAlchemy.
- **Banco de Dados:** PostgreSQL.

---

## 2.  Pipeline ETL + Data Lake/DW/Data Marts


###  Data Lake (Dataset movies do Kaggle)
- Recebe os dados brutos das avaliações em formato CSV ou JSON.
- Simula a chegada de dados de uso real da plataforma.

### Data Warehouse (DW)
- Realiza limpeza e padronização dos dados.
- Cria tabelas dimensionais e de fatos (ex: `dim_filme`, `fact_avaliacoes`).

### Data Marts
- Gera visões agregadas específicas para **análise de negócio**, como:
  - Média de notas por gênero.
  - Filmes mais bem avaliados por faixa etária.
  - Volume de avaliações por período.

Os dados são armazenados em tabelas separadas no banco de dados, permitindo que **dashboards analíticos** ou queries SQL simples entreguem insights rapidamente para decisões estratégicas.

---

## 3. Containerização com Docker

###  Estrutura de Pastas


.
├── app/ # Backend FastAPI
│ ├── Dockerfile
│ └── ...
├── etl/ # ETL Pipeline (Python)
│ ├── Dockerfile
│ └── ...
├── frontend/ # React App (roda localmente)
│ └── ...
├── docker-compose.yml
└── .github/workflows/ci-cd.yml



### Backend - `Dockerfile`

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

--

## 4. Pipeline CI/CD (GitHub Actions + DockerHub)

Sempre que houver um git push na branch main:

- O pipeline constrói as imagens Docker do backend e ETL.
- Publica as imagens no DockerHub.


--

## 5. Visões de Negócio - Data Marts

Data Mart	Descrição
dm_genero_media_notas	Média de notas por gênero (identifica gêneros mais bem avaliados).
dm_filmes_top_avaliados	Top filmes por nota média (apoia recomendações).
dm_avaliacoes_por_periodo	Volume de avaliações por mês/ano (identifica sazonalidades de uso).
dm_engajamento_usuarios	Agrupa usuários por quantidade de avaliações (identifica heavy users).


--

## 6. Como executar o Projeto


1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/movieflix-analytics.git
cd movieflix-analytics
```

2. Suba o backend, ETL e banco

```bash
docker-compose up -d --build
```

3. Rode o frontend localmente

```bash
cd frontend
npm install
npm run dev
```

