/**
 * @file app.js
 * @module app
 * @description Punto de entrada principal del servidor Express.
 *
 * Responsabilidades:
 *  - Cargar variables de entorno desde .env con dotenv.
 *  - Configurar middlewares globales (JSON parser, CORS, logger).
 *  - Registrar las rutas de la API.
 *  - Arrancar el servidor en el puerto configurado.
 *
 * Arquitectura en Capas (flujo de una petición):
 *
 *   Cliente HTTP
 *       │
 *       ▼
 *   [Presentación] bookController.fetchBooks()
 *       │
 *       ▼
 *   [Negocio]      BookManager.getAvailableCatalog()
 *       │
 *       ▼
 *   [Persistencia] BookRepository.getAllBooks()
 *       │
 *       ▼
 *   [Base de Datos] MySQL via Pool (connection.js)
 *
 * @requires express
 * @requires dotenv
 * @requires ./presentation/bookController
 */

'use strict';

// Cargar variables de entorno ANTES de cualquier otra importación
// que pueda leerlas (ej: connection.js lee DB_HOST, etc.)
require('dotenv').config();

const express = require('express');
const bookController = require('./presentation/bookController');

// ----------------------------------------------------------------------------
// Instancia de la aplicación Express
// ----------------------------------------------------------------------------
const app = express();

/** Puerto del servidor. Se prioriza la variable de entorno PORT. */
const PORT = process.env.PORT || 3000;

// ----------------------------------------------------------------------------
// Middlewares globales
// ----------------------------------------------------------------------------

/**
 * Habilita el parseo automático de cuerpos JSON en las peticiones entrantes.
 * Permite acceder al body como `req.body` en los controladores.
 */
app.use(express.json());

/**
 * Habilita el parseo de cuerpos con formato URL-encoded
 * (formularios HTML clásicos).
 */
app.use(express.urlencoded({ extended: true }));

// ----------------------------------------------------------------------------
// Rutas de la API
// ----------------------------------------------------------------------------

/**
 * GET /api/books
 *
 * Retorna el catálogo de libros disponibles en formato JSON.
 * El controlador delega a la capa de Negocio y esta a la de Persistencia.
 *
 * @example
 * // Respuesta:
 * // { "success": true, "count": 2, "data": [...] }
 */
app.get('/api/books', bookController.fetchBooks);

/**
 * GET /health
 *
 * Endpoint de salud para comprobaciones de liveness en Docker/Kubernetes.
 * No depende de la base de datos: siempre responde 200 si el proceso corre.
 */
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * Middleware de ruta no encontrada (404).
 * Se registra al final, después de todas las rutas válidas.
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta '${req.method} ${req.path}' no encontrada.`,
  });
});

// ----------------------------------------------------------------------------
// Arranque del servidor
// ----------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`[App] 🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`[App] 📚 API de libros disponible en http://localhost:${PORT}/api/books`);
  console.log(`[App] 🏃 Entorno: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app; // Exportar para tests de integración

