const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json()); // To parse JSON request body

// MySQL Database Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "farith", // Your MySQL root password
  database: "ibm_project",
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Database Connection Failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL Database");
});

// Test API
app.get("/", (req, res) => {
  res.send("Welcome to Movie Ticket API!");
});

app.get("/movies", (req, res) => {
  const sql = "SELECT * FROM movies";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.post("/movies", (req, res) => {
  const { id, movie_name, release_date, theatre, genre, img_link } = req.body;
  const sql =
    "INSERT INTO movies (id,movie_name, release_date, theatre, genre, img_link) VALUES (?, ?, ?, ?, ?, ?)";

  db.query(
    sql,
    [id, movie_name, release_date, theatre, genre, img_link],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Movie added successfully!" });
    }
  );
});

app.delete("/movies/:id", (req, res) => {
  const sql = "DELETE FROM movies WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Movie deleted successfully!" });
  });
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
