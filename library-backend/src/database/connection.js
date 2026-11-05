/**
 * @file connection.js
 * @module database/connection
 * @description Crea y exporta un Pool de conexiones a MySQL usando mysql2/promise.
 *
 * Un Pool reutiliza conexiones existentes en lugar de abrir/cerrar una
 * conexión nueva por cada query, lo que mejora el rendimiento bajo carga.
 *
 * Las credenciales se leen desde variables de entorno para evitar
 * hardcodear datos sensibles en el código fuente (12-Factor App).
 *
 * @requires mysql2/promise
 * @requires dotenv
 */

'use strict';

const mysql = require('mysql2/promise');

/**
 * Configuración del Pool leída desde variables de entorno.
 * Los valores por defecto (|| '...') solo son válidos para desarrollo local.
 *
 * Variables esperadas en el archivo .env o en el entorno Docker:
 *   DB_HOST     - Host donde corre MySQL       (ej: "localhost" o "db")
 *   DB_PORT     - Puerto de MySQL              (ej: 3306)
 *   DB_USER     - Usuario de MySQL             (ej: "library_user")
 *   DB_PASSWORD - Contraseña del usuario       (ej: "secret")
 *   DB_NAME     - Nombre de la base de datos   (ej: "library_db")
 *   DB_POOL_LIMIT - Nº máximo de conexiones simultáneas (ej: 10)
 */
const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'library_user',
  password: process.env.DB_PASSWORD || 'secret',
  database: process.env.DB_NAME || 'library_db',
  waitForConnections: true,         // Encola peticiones si el pool está lleno
  connectionLimit: parseInt(process.env.DB_POOL_LIMIT || '10', 10),
  queueLimit: 0,                    // 0 = cola ilimitada
  charset: 'utf8mb4',
};

/**
 * Pool de conexiones compartido en toda la aplicación.
 * Se crea una única instancia (Singleton) al importar este módulo.
 *
 * @type {mysql.Pool}
 */
const pool = mysql.createPool(poolConfig);

// ---- Verificación rápida de conectividad al arrancar -------------------------
pool.getConnection()
  .then((conn) => {
    console.log('[DB] ✅ Pool de conexiones MySQL listo en', poolConfig.host);
    conn.release(); // Devuelve la conexión al pool inmediatamente
  })
  .catch((err) => {
    console.error('[DB] ❌ No se pudo conectar a MySQL:', err.message);
    // No cerramos el proceso aquí; el pool reintentará cuando lleguen queries.
  });

module.exports = pool;

