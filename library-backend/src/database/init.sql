-- =============================================================================
-- init.sql
-- Script de inicialización de la base de datos para la biblioteca.
-- Se ejecuta automáticamente al crear el contenedor MySQL por primera vez.
--
-- Responsabilidades:
--   1. Crear la base de datos si no existe.
--   2. Definir la tabla `books` con su esquema completo.
--   3. Insertar datos de prueba para validar el sistema.
-- =============================================================================

-- Crear la base de datos si no existe y seleccionarla
CREATE DATABASE IF NOT EXISTS library_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE library_db;

-- -----------------------------------------------------------------------------
-- Tabla: books
-- Almacena el catálogo de libros disponibles en la biblioteca.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS books (
  id          INT           NOT NULL AUTO_INCREMENT,
  title       VARCHAR(255)  NOT NULL COMMENT 'Título del libro',
  author      VARCHAR(255)  NOT NULL COMMENT 'Nombre del autor',
  isbn        VARCHAR(20)   UNIQUE   COMMENT 'Código ISBN único del libro',
  year        YEAR          NULL     COMMENT 'Año de publicación',
  available   TINYINT(1)   NOT NULL DEFAULT 1 COMMENT '1 = disponible, 0 = prestado',
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Datos de prueba: dos libros de ejemplo
-- -----------------------------------------------------------------------------
INSERT INTO books (title, author, isbn, year, available) VALUES
  (
    'El Señor de los Anillos',
    'J.R.R. Tolkien',
    '978-0-618-64015-7',
    1954,
    1
  ),
  (
    'Cien Años de Soledad',
    'Gabriel García Márquez',
    '978-0-06-088328-7',
    1967,
    1
  );

