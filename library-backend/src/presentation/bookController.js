/**
 * @file bookController.js
 * @module presentation/bookController
 * @description Capa de Presentación — maneja las peticiones HTTP y construye respuestas.
 *
 * Principios aplicados:
 *  - Esta capa es la única que conoce los objetos `req` y `res` de Express.
 *  - Solo delega la lógica de negocio a BookManager; nunca la implementa.
 *  - Gestiona códigos de estado HTTP y el formato de la respuesta JSON.
 *  - Captura errores y retorna respuestas de error estructuradas.
 *
 * @requires ../business/BookManager
 */

'use strict';

const BookManager = require('../business/BookManager');

/**
 * @namespace bookController
 * @description Controlador HTTP para los endpoints relacionados con libros.
 */
const bookController = {

  /**
   * Maneja GET /api/books
   *
   * Solicita el catálogo de libros disponibles a la capa de negocio
   * y retorna una respuesta JSON estandarizada al cliente.
   *
   * Formato de respuesta exitosa (200 OK):
   * ```json
   * {
   *   "success": true,
   *   "count": 2,
   *   "data": [
   *     { "id": 1, "title": "...", "author": "...", "isbn": "...", "year": 1954 },
   *     { "id": 2, "title": "...", "author": "...", "isbn": "...", "year": 1967 }
   *   ]
   * }
   * ```
   *
   * Formato de respuesta de error (500 Internal Server Error):
   * ```json
   * {
   *   "success": false,
   *   "message": "No se pudo obtener el catálogo de libros.",
   *   "error": "Detalle técnico del error"
   * }
   * ```
   *
   * @async
   * @function fetchBooks
   * @param {import('express').Request}  req - Objeto de solicitud de Express.
   * @param {import('express').Response} res - Objeto de respuesta de Express.
   * @returns {Promise<void>} Envía la respuesta JSON directamente al cliente.
   */
  async fetchBooks(req, res) {
    try {
      // Delegar a la capa de Negocio — el controlador no sabe cómo se obtienen
      const catalog = await BookManager.getAvailableCatalog();

      // Respuesta exitosa con envelope estándar
      return res.status(200).json({
        success: true,
        count: catalog.length,
        data: catalog,
      });

    } catch (error) {
      // Registrar el error completo en el servidor (no exponer stack al cliente)
      console.error('[bookController] Error en fetchBooks:', error);

      return res.status(500).json({
        success: false,
        message: 'No se pudo obtener el catálogo de libros.',
        error: error.message,
      });
    }
  },

};

module.exports = bookController;

