# Usar Python oficial
FROM python:3.11-slim

# Criar diretório de trabalho
WORKDIR /app

# Instalar dependências do sistema para psycopg2
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copiar dependências e instalar
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar script ETL e CSVs tratados
COPY etl.py .

# Rodar script
CMD ["python", "etl.py"]
