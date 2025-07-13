import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { observer } from "mobx-react-lite";
import { favoritesStore } from "../stores/favoritesStore";
import useIsMobile from "../hooks/useIsMobile";
interface MovieDetail {
  id: string;
  name: string;
  description?: string;
  year: number;
  rating?: { kp?: number };
  poster?: { url?: string };
  genres?: { name: string }[];
  premiere?: { world?: string };
}

const MovieDetails = observer(() => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showConfirmId, setShowConfirmId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError("");
    axios
      .get(`https://api.kinopoisk.dev/v1.4/movie/${id}`, {
        headers: {
          "X-API-KEY": process.env.REACT_APP_KINOPOISK_DEV_API_KEY || "",
        },
      })
      .then((res) => setMovie(res.data))
      .catch(() => setError("Ошибка загрузки данных о фильме"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;
  if (!movie) return <div>Фильм не найден</div>;

  const isFav = favoritesStore.isFavorite(movie.id);

  const handleAddFavorite = () => setShowModal(true);
  const handleConfirmAdd = () => {
    favoritesStore.add({
      id: movie.id,
      name: movie.name,
      year: movie.year,
      poster: movie.poster,
      rating: movie.rating,
      genres: movie.genres,
    });
    setShowModal(false);
  };
  const handleRemoveFavorite = () => setShowConfirmId(movie.id);
  const handleConfirmRemove = () => {
    favoritesStore.remove(showConfirmId!);
    setShowConfirmId(null);
    setShowModal(false);
  };

  return (
    <div
      style={{
        maxWidth: isMobile ? "100vw" : 600,
        margin: isMobile ? 0 : "0 auto",
        padding: isMobile ? 8 : 0,
      }}
    >
      <h2 style={{ fontSize: isMobile ? 20 : 28 }}>
        {movie.name} ({movie.year})
      </h2>
      {movie.poster?.url && (
        <img
          src={movie.poster.url}
          alt={movie.name}
          style={{
            width: isMobile ? 240 : 200,
            marginBottom: 16,
            borderRadius: 8,
            alignSelf: "center",
            display: "block",
            margin: "0 auto 1rem",
          }}
        />
      )}
      <div style={{ fontSize: isMobile ? 16 : 18 }}>
        <b>Рейтинг:</b> {movie.rating?.kp ?? "—"}
      </div>
      <div style={{ fontSize: isMobile ? 16 : 18 }}>
        <b>Дата выхода:</b>{" "}
        {movie.premiere?.world
          ? new Date(movie.premiere.world).toLocaleDateString("ru-RU", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "—"}
      </div>
      <div style={{ fontSize: isMobile ? 16 : 18 }}>
        <b>Жанры:</b> {movie.genres?.map((g) => g.name).join(", ")}
      </div>
      <div style={{ fontSize: isMobile ? 16 : 18, marginTop: 16 }}>
        <b>Описание:</b>
        <br />
        {movie.description || "—"}
      </div>
      <div style={{ marginTop: 24, fontSize: isMobile ? 16 : 18 }}>
        {isFav ? (
          <button
            onClick={handleRemoveFavorite}
            style={{
              background: "#f66",
              color: "#fff",
              padding: isMobile ? "6px 12px" : "8px 16px",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Удалить из избранного
          </button>
        ) : (
          <button
            onClick={handleAddFavorite}
            style={{
              background: "#007bff",
              color: "#fff",
              padding: isMobile ? "6px 12px" : "8px 16px",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            В избранное
          </button>
        )}
      </div>
      {showModal &&
        (isFav ? (
          <div className="modal-backdrop">
            <div className="modal-content">
              <div style={{ marginBottom: 16, fontSize: isMobile ? 16 : 18 }}>
                Удалить фильм из избранного?
              </div>
              <button
                onClick={handleConfirmRemove}
                style={{ marginRight: 8, fontSize: isMobile ? 16 : 18 }}
              >
                Удалить
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: "#eee",
                  color: "#333",
                  fontSize: isMobile ? 16 : 18,
                }}
              >
                Отмена
              </button>
            </div>
          </div>
        ) : (
          <div className="modal-backdrop">
            <div className="modal-content">
              <div style={{ marginBottom: 16, fontSize: isMobile ? 16 : 18 }}>
                Добавить фильм в избранное?
              </div>
              <button
                onClick={handleConfirmAdd}
                style={{ marginRight: 8, fontSize: isMobile ? 16 : 18 }}
              >
                Добавить
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: "#eee",
                  color: "#333",
                  fontSize: isMobile ? 16 : 18,
                }}
              >
                Отмена
              </button>
            </div>
          </div>
        ))}
    </div>
  );
});

export default MovieDetails;
