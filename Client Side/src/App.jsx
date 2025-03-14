import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [movies, setMovies] = useState([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [formData, setFormData] = useState({
    movie_name: "",
    release_date: "",
    theatre: "",
    genre: "",
    img_link: "",
  });
  const [editingMovie, setEditingMovie] = useState(null); // Track editing movie

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const res = await axios.get("http://localhost:5000/movies");
      setMovies(res.data);
    } catch (error) {
      console.error("❌ Error fetching movies:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add or Update Movie
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMovie) {
        // Update existing movie
        await axios.put(
          `http://localhost:5000/movies/${editingMovie.id}`,
          formData
        );
      } else {
        // Add new movie
        await axios.post("http://localhost:5000/movies", formData);
      }

      fetchMovies(); // Refresh movies
      setFormData({
        movie_name: "",
        release_date: "",
        theatre: "",
        genre: "",
        img_link: "",
      });
      setEditingMovie(null);
    } catch (error) {
      console.error("❌ Error saving movie:", error);
    }
  };

  // Delete Movie
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/movies/${id}`);
      fetchMovies();
    } catch (error) {
      console.error("❌ Error deleting movie:", error);
    }
  };

  // Edit Movie
  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setFormData(movie);
  };

  // Format date to DD-MM-YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // "DD/MM/YYYY"
  };

  return (
    <div style={{ padding: "20px", textAlign: "center", fontFamily: "Arial" }}>
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setShowAdmin(false)} style={buttonStyle}>
          User Panel
        </button>
        <button onClick={() => setShowAdmin(true)} style={buttonStyle}>
          Admin Panel
        </button>
      </div>

      {/* User Panel */}
      {!showAdmin ? (
        <div>
          <div style={gridStyle}>
            {movies.length > 0 ? (
              movies.map((movie) => (
                <div key={movie.id} style={cardStyle}>
                  <img
                    src={movie.img_link}
                    alt={movie.movie_name}
                    style={imgStyle}
                  />
                  <h3>{movie.movie_name}</h3>
                  <p>
                    <strong>ID:</strong> {movie.id}
                  </p>
                  <p>
                    <strong>Release Date:</strong>{" "}
                    {formatDate(movie.release_date)}
                  </p>
                  <p>
                    <strong>Theatre:</strong> {movie.theatre}
                  </p>
                  <p>
                    <strong>Genre:</strong> {movie.genre}
                  </p>
                </div>
              ))
            ) : (
              <p>No movies available</p>
            )}
          </div>
        </div>
      ) : (
        /* Admin Panel */
        <div>
          <h2>🎬 Admin Panel - {editingMovie ? "Edit" : "Add"} Movie</h2>
          <form onSubmit={handleSubmit} style={formStyle}>
            <input
              type="text"
              name="movie_name"
              placeholder="Movie Name"
              value={formData.movie_name}
              onChange={handleChange}
              required
            />
            <input
              type="date"
              name="release_date"
              value={formData.release_date}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="theatre"
              placeholder="Theatre Name"
              value={formData.theatre}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="genre"
              placeholder="Genre"
              value={formData.genre}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="img_link"
              placeholder="Image URL"
              value={formData.img_link}
              onChange={handleChange}
              required
            />
            <button type="submit" style={buttonStyle}>
              {editingMovie ? "Update" : "Add"} Movie
            </button>
          </form>

          <h2>🎬 Existing Movies</h2>
          <div style={gridStyle}>
            {movies.length > 0 ? (
              movies.map((movie) => (
                <div key={movie.id} style={cardStyle}>
                  <img
                    src={movie.img_link}
                    alt={movie.movie_name}
                    style={imgStyle}
                  />
                  <h3>{movie.movie_name}</h3>
                  <p>
                    <strong>Release Date:</strong>{" "}
                    {formatDate(movie.release_date)}
                  </p>
                  <p>
                    <strong>Theatre:</strong> {movie.theatre}
                  </p>
                  <p>
                    <strong>Genre:</strong> {movie.genre}
                  </p>
                  <button
                    onClick={() => handleEdit(movie)}
                    style={editButtonStyle}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(movie.id)}
                    style={deleteButtonStyle}
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <p>No movies available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* Styles */
const buttonStyle = {
  margin: "10px",
  padding: "10px 20px",
  fontSize: "16px",
  cursor: "pointer",
  border: "none",
  borderRadius: "5px",
  background: "#007bff",
  color: "white",
};
const editButtonStyle = { ...buttonStyle, background: "#28a745" };
const deleteButtonStyle = { ...buttonStyle, background: "#dc3545" };
const gridStyle = {
  display: "flex",
  overflowX: "auto", // Enables horizontal scrolling if needed
  gap: "20px",
  padding: "20px",
  color: "black",
  whiteSpace: "nowrap", // Ensures cards stay in one line
};

const cardStyle = {
  border: "1px solid #ddd",
  borderRadius: "10px",
  padding: "15px",
  textAlign: "center",
  background: "#f9f9f9",
};
const imgStyle = {
  width: "100%",
  height: "200px",
  objectFit: "cover",
  borderRadius: "5px",
};
const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  maxWidth: "400px",
  margin: "auto",
};

export default App;
