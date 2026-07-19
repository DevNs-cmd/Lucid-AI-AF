# Multi-stage build target for minimal size and high performance
FROM python:3.12-slim AS builder

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    POETRY_VERSION=1.8.3 \
    POETRY_HOME="/opt/poetry" \
    POETRY_VIRTUALENVS_IN_PROJECT=true \
    POETRY_NO_INTERACTION=1

ENV PATH="$POETRY_HOME/bin:$PATH"

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry to manage dependencies
RUN curl -sSL https://install.python-poetry.org | python3 -

WORKDIR /app

# Copy dependency configuration files
COPY pyproject.toml ./

# Install execution environment dependencies (excluding development packages)
RUN poetry install --no-root --only main

# Stage 2: Final runner stage
FROM python:3.12-slim AS runner

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PATH="/app/.venv/bin:$PATH"

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Import constructed python execution environment from builder
COPY --from=builder /app/.venv /app/.venv

# Establish a low-privileged system user for container execution context
RUN useradd -u 8888 lucid && chown -R lucid:lucid /app
USER lucid

# Import package definition to runtime scope
COPY --chown=lucid:lucid ./app /app/app

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]