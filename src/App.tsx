import { BrowserRouter, Routes, Route } from "react-router-dom";
import MoviesList from "./pages/MoviesList";
import MovieDetails from "./pages/MovieDetails";
import Favorites from "./pages/Favorites";

function App() {
  return (
    <BrowserRouter>
      <div
        style={{
          background: "#222",
          color: "#fff",
          padding: "12px 0",
          marginBottom: 24,
        }}
      >
        <nav style={{ display: "flex", justifyContent: "center", gap: 32 }}>
          <a
            href="/"
            style={{
              color: window.location.pathname === "/" ? "#f5c518" : "#fff",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: 20,
              letterSpacing: 1,
            }}
          >
            Фильмы
          </a>
          <a
            href="/favorites"
            style={{
              color:
                window.location.pathname === "/favorites" ? "#f5c518" : "#fff",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: 20,
              letterSpacing: 1,
            }}
          >
            Избранное
          </a>
        </nav>
      </div>
      <Routes>
        <Route path="/" element={<MoviesList />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
