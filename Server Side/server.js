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
    console.error("❌ Database Connection Failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL Database");
});

// Test API
app.get("/", (req, res) => {
  res.send("🎬 Welcome to Movie Ticket API!");
});

// Fetch all movies
app.get("/movies", (req, res) => {
  const sql = "SELECT * FROM movies";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching movies:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(results);
  });
});

// Add a new movie (No need to send 'id', MySQL handles it)
app.post("/movies", (req, res) => {
  const { movie_name, release_date, theatre, genre, img_link } = req.body;

  if (!movie_name || !release_date || !theatre || !genre || !img_link) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  const sql =
    "INSERT INTO movies (movie_name, release_date, theatre, genre, img_link) VALUES (?, ?, ?, ?, ?)";

  db.query(
    sql,
    [movie_name, release_date, theatre, genre, img_link],
    (err, result) => {
      if (err) {
        console.error("❌ Error adding movie:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json({
        message: "✅ Movie added successfully!",
        movieId: result.insertId,
      });
    }
  );
});

// Update an existing movie
app.put("/movies/:id", (req, res) => {
  const { movie_name, release_date, theatre, genre, img_link } = req.body;
  const sql =
    "UPDATE movies SET movie_name = ?, release_date = ?, theatre = ?, genre = ?, img_link = ? WHERE id = ?";

  db.query(
    sql,
    [movie_name, release_date, theatre, genre, img_link, req.params.id],
    (err, result) => {
      if (err) {
        console.error("❌ Error updating movie:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json({ message: "✅ Movie updated successfully!" });
    }
  );
});

// Delete a movie
app.delete("/movies/:id", (req, res) => {
  const sql = "DELETE FROM movies WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error("❌ Error deleting movie:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json({ message: "✅ Movie deleted successfully!" });
  });
});


// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
