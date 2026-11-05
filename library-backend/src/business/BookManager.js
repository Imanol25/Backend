/**
 * @file BookManager.js
 * @module business/BookManager
 * @description Capa de Negocio — contiene la lógica de dominio relacionada con libros.
 *
 * Principios aplicados:
 *  - Esta capa es completamente independiente de Express (sin req/res).
 *  - Se comunica HACIA ABAJO únicamente con la capa de Persistencia.
 *  - La capa de Presentación se comunica HACIA ABAJO únicamente con esta capa.
 *
 * Aquí se colocan reglas como:
 *  - Filtros de disponibilidad
 *  - Transformaciones de datos (formateo, enriquecimiento)
 *  - Validaciones de reglas de negocio
 *
 * @requires ../persistence/BookRepository
 */

'use strict';

const BookRepository = require('../persistence/BookRepository');

/**
 * @namespace BookManager
 * @description Manager (servicio de dominio) para la entidad Book.
 */
const BookManager = {

  /**
   * Obtiene el catálogo de libros disponibles para préstamo.
   *
   * Lógica de negocio aplicada:
   *  1. Solicita TODOS los libros a la capa de Persistencia.
   *  2. Filtra únicamente los que tienen el campo `available === 1`.
   *  3. Mapea los registros a un DTO (Data Transfer Object) limpio,
   *     ocultando campos internos como `created_at` o `available`.
   *
   * Si en el futuro se necesita mostrar libros no disponibles o agregar
   * más lógica (ej: paginación, rankings), se hace aquí sin tocar las
   * otras capas.
   *
   * @async
   * @function getAvailableCatalog
   * @returns {Promise<Array<Object>>} Array de libros disponibles como DTOs.
   *   Cada objeto contiene: { id, title, author, isbn, year }
   * @throws {Error} Propaga cualquier error de la capa de Persistencia.
   *
   * @example
   * const catalog = await BookManager.getAvailableCatalog();
   * // => [{ id: 1, title: 'El Señor de los Anillos', author: 'J.R.R. Tolkien', isbn: '...', year: 1954 }]
   */
  async getAvailableCatalog() {
    // 1. Obtener todos los libros desde la capa de persistencia
    const allBooks = await BookRepository.getAllBooks();

    // 2. Regla de negocio: solo libros marcados como disponibles (available = 1)
    const availableBooks = allBooks.filter((book) => book.available === 1);

    // 3. Transformar a DTO: exponer solo los campos relevantes para el cliente
    const catalog = availableBooks.map((book) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      year: book.year,
    }));

    return catalog;
  },

};

module.exports = BookManager;

