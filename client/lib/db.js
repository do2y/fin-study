import mariadb from "mariadb";

// Reuse pool across hot reloads in development
const globalForMariadb = global;
if (!globalForMariadb._mariadbPool) {
  globalForMariadb._mariadbPool = mariadb.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "1234",
    database: process.env.DB_NAME || "finword",
    connectionLimit: 5,
  });
}

const pool = globalForMariadb._mariadbPool;

function normalizeBigInts(value) {
  if (typeof value === "bigint") return Number(value);
  if (Array.isArray(value)) return value.map(normalizeBigInts);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, normalizeBigInts(v)])
    );
  }
  return value;
}

export async function query(sql, params) {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(sql, params);
    return normalizeBigInts(result);
  } finally {
    if (conn) conn.release();
  }
}

let schemaInitialized = false;

export async function ensureSchema() {
  if (schemaInitialized) return;
  await query(`
    CREATE TABLE IF NOT EXISTS Users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(100),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await query(`
    CREATE TABLE IF NOT EXISTS Vocabulary (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      word VARCHAR(100) NOT NULL,
      meaning TEXT NOT NULL,
      category VARCHAR(50) DEFAULT '기타',
      status ENUM('unknown','learning','mastered') DEFAULT 'unknown',
      is_important TINYINT(1) DEFAULT 0,
      memo TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY unique_user_word (user_id, word),
      FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
    )
  `);
  schemaInitialized = true;
}
