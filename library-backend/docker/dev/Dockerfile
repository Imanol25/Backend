# =============================================================================
# Dockerfile — Entorno de DESARROLLO
# Ubicación: docker/dev/Dockerfile
#
# Características del entorno de desarrollo:
#  - Usa la imagen Node LTS completa (con herramientas de compilación).
#  - Instala nodemon para recarga automática al guardar cambios.
#  - El código fuente se monta como volumen (no se copia al build).
#  - No optimiza el tamaño de la imagen (no es prioritario en dev).
# =============================================================================

# Imagen base con Node.js LTS (versión "bullseye" basada en Debian)
FROM node:20-bullseye

# Metadatos de la imagen
LABEL maintainer="library-backend"
LABEL environment="development"

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# -----------------------------------------------------------------------------
# Instalar dependencias PRIMERO (capa cacheada por Docker si package*.json no cambia)
# Se copia solo el package.json antes del código fuente para aprovechar el cache.
# -----------------------------------------------------------------------------
COPY package*.json ./

# Instalar TODAS las dependencias (incluidas devDependencies como nodemon)
RUN npm install

# No se hace COPY del código fuente aquí:
# en desarrollo el código se monta vía volumen en docker-compose.yml,
# lo que permite ver los cambios al instante sin reconstruir la imagen.

# Puerto que expone la aplicación Express
EXPOSE 3000

# Comando de inicio con nodemon para hot-reload
CMD ["npx", "nodemon", "src/app.js"]

