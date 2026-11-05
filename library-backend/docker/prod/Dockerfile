# =============================================================================
# Dockerfile — Entorno de PRODUCCIÓN
# Ubicación: docker/prod/Dockerfile
#
# Estrategia Multi-Stage Build:
#   Stage 1 (builder): instala TODAS las dependencias y prepara el código.
#   Stage 2 (runner):  copia solo lo necesario → imagen final más pequeña
#                      y sin devDependencies (nodemon, etc.).
#
# Mejores prácticas aplicadas:
#   - Imagen base Alpine (mínima en tamaño y superficie de ataque).
#   - Usuario no-root para ejecutar el proceso (principio de mínimo privilegio).
#   - Variables de entorno definidas en docker-compose.yml, no aquí.
#   - HEALTHCHECK integrado en la imagen.
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Builder — instala dependencias de producción
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar manifiestos de dependencias
COPY package*.json ./

# Instalar SOLO dependencias de producción (sin devDependencies)
RUN npm ci --only=production

# Copiar el código fuente de la aplicación
COPY src/ ./src/

# -----------------------------------------------------------------------------
# Stage 2: Runner — imagen final mínima
# -----------------------------------------------------------------------------
FROM node:20-alpine AS runner

# Metadatos de la imagen
LABEL maintainer="library-backend"
LABEL environment="production"

WORKDIR /app

# Crear usuario no-root para seguridad
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copiar desde el stage builder solo lo estrictamente necesario
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/src          ./src
COPY --from=builder --chown=appuser:appgroup /app/package.json ./package.json

# Cambiar al usuario no-root antes de ejecutar
USER appuser

# Puerto expuesto por la aplicación
EXPOSE 3000

# Healthcheck: comprueba que la API responde correctamente
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

# Comando de inicio: node directo (sin nodemon) para producción
CMD ["node", "src/app.js"]

