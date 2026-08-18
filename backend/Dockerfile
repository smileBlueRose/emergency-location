FROM alpine:3.24 AS tini
RUN apk add --no-cache tini

FROM python:3.13-alpine AS builder
WORKDIR /backend
COPY --from=docker.io/astral/uv:latest /uv /uvx /bin/
COPY pyproject.toml uv.lock ./
RUN uv sync --locked --no-dev --no-install-project

FROM python:3.13-alpine AS runner
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1

ARG APP_UID
ARG APP_GID
RUN addgroup -g $APP_GID appuser && \
    adduser -D -u $APP_UID -G appuser appuser

WORKDIR /backend
COPY --from=tini /sbin/tini /sbin/tini
COPY --from=builder --chown=appuser:appuser /backend/.venv ./.venv
COPY --chown=appuser:appuser . ./

COPY . ./
EXPOSE 8080
ENTRYPOINT ["/sbin/tini", "--", "./entrypoint.sh"]