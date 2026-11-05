/**
 * @file BookRepository.js
 * @module persistence/BookRepository
 * @description Capa de Persistencia — único punto de contacto con la base de datos.
 *
 * Principios aplicados:
 *  - Single Responsibility: este módulo solo traduce peticiones de negocio
 *    a queries SQL y devuelve resultados crudos.
 *  - Dependency Injection implícita: recibe el pool desde connection.js,
 *    facilitando mocks en pruebas unitarias.
 *
 * Esta capa NO contiene lógica de negocio ni construye respuestas HTTP.
 *
 * @requires ../database/connection
 */

'use strict';

const pool = require('../database/connection');

/**
 * @namespace BookRepository
 * @description Repositorio de acceso a datos para la entidad Book.
 */
const BookRepository = {

  /**
   * Recupera todos los libros almacenados en la base de datos.
   *
   * Ejecuta un SELECT simple sobre la tabla `books` y devuelve los registros
   * tal como MySQL los retorna (array de objetos planos).
   *
   * @async
   * @function getAllBooks
   * @returns {Promise<Array<Object>>} Array con todos los registros de libros.
   *   Cada objeto contiene: { id, title, author, isbn, year, available, created_at }
   * @throws {Error} Si la query falla (conexión perdida, tabla inexistente, etc.).
   *
   * @example
   * const books = await BookRepository.getAllBooks();
   * // => [{ id: 1, title: 'El Señor de los Anillos', author: 'J.R.R. Tolkien', ... }, ...]
   */
  async getAllBooks() {
    const query = `
      SELECT
        id,
        title,
        author,
        isbn,
        year,
        available,
        created_at
      FROM books
      ORDER BY id ASC
    `;

    // pool.execute usa prepared statements internamente → más seguro y eficiente
    const [rows] = await pool.execute(query);
    return rows;
  },

};

module.exports = BookRepository;

