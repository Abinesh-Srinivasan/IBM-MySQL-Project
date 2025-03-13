import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [movies, setMovies] = useState([]); // Stores movies data
  const [showAdmin, setShowAdmin] = useState(false); // Toggle panels
  const [formData, setFormData] = useState({
    id: "",
    movie_name: "",
    release_date: "",
    theatre: "",
    genre: "",
    img_link: "",
  });

  // Fetch movies from backend
  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const res = await axios.get("http://localhost:5000/movies");
      setMovies(res.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add new movie with generated ID
  const addMovie = async (e) => {
    e.preventDefault();

    // Generate unique ID based on timestamp
    const generatedID = `${Date.now()}`;

    try {
      await axios.post("http://localhost:5000/movies", {
        id: generatedID, // Send ID correctly
        movie_name: formData.movie_name,
        release_date: formData.release_date,
        theatre: formData.theatre,
        genre: formData.genre,
        img_link: formData.img_link,
      });

      fetchMovies(); // Refresh movie list
      setFormData({
        id: "",
        movie_name: "",
        release_date: "",
        theatre: "",
        genre: "",
        img_link: "",
      }); // Clear form
    } catch (error) {
      console.error("Error adding movie:", error);
    }
  };


  return (
    <div style={{ padding: "20px", textAlign: "center", fontFamily: "Arial" }}>
      {/* Toggle Buttons */}
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
                    <strong>Release Date:</strong> {movie.release_date}
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
          <h2>🎬 Admin Panel - Add Movie</h2>
          <form onSubmit={addMovie} style={formStyle}>
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
              Add Movie
            </button>
          </form>
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

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "20px",
  padding: "20px",
  color:"black"
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
