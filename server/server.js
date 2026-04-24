const express = require("express");
const mariadb = require("mariadb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cors = require("cors");
const newsData = require("./data/news");
const termsData = require("./data/terms");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = mariadb.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "1234",
  database: process.env.DB_NAME || "finword",
  connectionLimit: 5,
  allowPublicKeyRetrieval: true,
});

async function initializeSchema() {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS Users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS Vocabulary (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        word VARCHAR(100) NOT NULL,
        meaning TEXT NOT NULL,
        category VARCHAR(50) DEFAULT '기타',
        status ENUM('unknown', 'learning', 'mastered') DEFAULT 'unknown',
        is_important TINYINT(1) DEFAULT 0,
        memo TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_word (user_id, word),
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
      )
    `);
  } finally {
    if (conn) conn.release();
  }
}

function authenticateToken(req, res, next) {
  const token = (req.headers.authorization || "").split(" ")[1];
  if (!token) return res.status(401).json({ message: "로그인이 필요합니다." });
  jwt.verify(token, process.env.JWT_SECRET || "finword_secret", (err, user) => {
    if (err)
      return res.status(403).json({ message: "토큰이 유효하지 않습니다." });
    req.user = user;
    next();
  });
}

function normalizeBigInts(value) {
  if (typeof value === "bigint") return Number(value);
  if (Array.isArray(value)) return value.map(normalizeBigInts);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, normalizeBigInts(v)]),
    );
  }
  return value;
}

// --- Auth ---

app.post("/api/register", async (req, res) => {
  let conn;
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ message: "이메일, 비밀번호, 이름은 필수입니다." });
    }
    const hashed = await bcrypt.hash(password, 10);
    conn = await pool.getConnection();
    await conn.query(
      "INSERT INTO Users (email, password, name) VALUES (?, ?, ?)",
      [email, hashed, name],
    );
    res.status(201).json({ message: "회원가입이 완료되었습니다." });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "이미 가입된 이메일입니다." });
    }
    console.error(err);
    res.status(500).json({ message: "서버 에러" });
  } finally {
    if (conn) conn.release();
  }
});

app.post("/api/login", async (req, res) => {
  let conn;
  try {
    const { email, password } = req.body;
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM Users WHERE email = ?", [
      email,
    ]);
    if (rows.length === 0) {
      return res.status(401).json({ message: "사용자를 찾을 수 없습니다." });
    }
    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
    }
    const token = jwt.sign(
      { id: Number(user.id), email: user.email },
      process.env.JWT_SECRET || "finword_secret",
      { expiresIn: "24h" },
    );
    res.json({ message: "로그인 성공", token, name: user.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 에러" });
  } finally {
    if (conn) conn.release();
  }
});

// --- News (dummy data, read only) ---

app.get("/api/news", (req, res) => {
  const list = newsData.map(({ id, title, source, published_at, terms }) => ({
    id,
    title,
    source,
    published_at,
    terms,
  }));
  res.json(list);
});

app.get("/api/news/:id", (req, res) => {
  const item = newsData.find((n) => n.id === Number(req.params.id));
  if (!item)
    return res.status(404).json({ message: "뉴스를 찾을 수 없습니다." });
  res.json(item);
});

// --- Financial Terms ---

app.get("/api/terms/:word", (req, res) => {
  const term = termsData[req.params.word];
  if (!term)
    return res.status(404).json({ message: "단어를 찾을 수 없습니다." });
  res.json(term);
});

// --- Vocabulary CRUD ---

// Check must come before /:id to prevent 'check' matching as an id
app.get("/api/vocabulary/check/:word", authenticateToken, async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      "SELECT id FROM Vocabulary WHERE user_id = ? AND word = ?",
      [req.user.id, req.params.word],
    );
    res.json({
      saved: rows.length > 0,
      id: rows.length > 0 ? Number(rows[0].id) : null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "조회 실패" });
  } finally {
    if (conn) conn.release();
  }
});

app.get("/api/vocabulary", authenticateToken, async (req, res) => {
  let conn;
  try {
    const { category, status, important } = req.query;
    let query = "SELECT * FROM Vocabulary WHERE user_id = ?";
    const params = [req.user.id];
    if (category) {
      query += " AND category = ?";
      params.push(category);
    }
    if (status) {
      query += " AND status = ?";
      params.push(status);
    }
    if (important === "true") {
      query += " AND is_important = 1";
    }
    query += " ORDER BY created_at DESC";
    conn = await pool.getConnection();
    const rows = await conn.query(query, params);
    res.json(normalizeBigInts(rows));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "조회 실패" });
  } finally {
    if (conn) conn.release();
  }
});

app.post("/api/vocabulary", authenticateToken, async (req, res) => {
  let conn;
  try {
    const { word, meaning, category, memo } = req.body;
    if (!word || !meaning) {
      return res.status(400).json({ message: "단어와 의미는 필수입니다." });
    }
    conn = await pool.getConnection();
    const existing = await conn.query(
      "SELECT id FROM Vocabulary WHERE user_id = ? AND word = ?",
      [req.user.id, word],
    );
    if (existing.length > 0) {
      return res
        .status(400)
        .json({ message: "이미 단어장에 저장된 단어입니다." });
    }
    const result = await conn.query(
      "INSERT INTO Vocabulary (user_id, word, meaning, category, memo) VALUES (?, ?, ?, ?, ?)",
      [req.user.id, word, meaning, category || "기타", memo || null],
    );
    res.status(201).json({
      message: "단어장에 저장되었습니다.",
      id: Number(result.insertId),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "저장 실패" });
  } finally {
    if (conn) conn.release();
  }
});

app.put("/api/vocabulary/:id", authenticateToken, async (req, res) => {
  let conn;
  try {
    const { id } = req.params;
    const { status, category, is_important, memo } = req.body;
    conn = await pool.getConnection();
    const rows = await conn.query(
      "SELECT * FROM Vocabulary WHERE id = ? AND user_id = ?",
      [id, req.user.id],
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "단어를 찾을 수 없습니다." });
    }
    const cur = rows[0];
    await conn.query(
      "UPDATE Vocabulary SET status = ?, category = ?, is_important = ?, memo = ?, updated_at = NOW() WHERE id = ? AND user_id = ?",
      [
        status !== undefined ? status : cur.status,
        category !== undefined ? category : cur.category,
        is_important !== undefined ? (is_important ? 1 : 0) : cur.is_important,
        memo !== undefined ? memo : cur.memo,
        id,
        req.user.id,
      ],
    );
    const updated = await conn.query("SELECT * FROM Vocabulary WHERE id = ?", [
      id,
    ]);
    res.json({
      message: "수정 완료",
      vocabulary: normalizeBigInts(updated[0]),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "수정 실패" });
  } finally {
    if (conn) conn.release();
  }
});

app.delete("/api/vocabulary/:id", authenticateToken, async (req, res) => {
  let conn;
  try {
    const { id } = req.params;
    conn = await pool.getConnection();
    const result = await conn.query(
      "DELETE FROM Vocabulary WHERE id = ? AND user_id = ?",
      [id, req.user.id],
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "삭제할 단어가 없습니다." });
    }
    res.json({ message: "삭제 완료" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "삭제 실패" });
  } finally {
    if (conn) conn.release();
  }
});

const PORT = process.env.PORT || 3001;

initializeSchema()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`FinWord server running on port ${PORT}`),
    );
  })
  .catch((err) => {
    console.error("Schema init failed:", err);
    process.exit(1);
  });
