import { observer } from "mobx-react-lite";
import { favoritesStore } from "../stores/favoritesStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useIsMobile from "../hooks/useIsMobile";

const Favorites = observer(() => {
  const navigate = useNavigate();
  const { favorites } = favoritesStore;
  const [showConfirmId, setShowConfirmId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const handleConfirm = (id: string) => {
    favoritesStore.remove(id);
    setShowConfirmId(null);
  };
  const handleCancel = () => {
    setShowConfirmId(null);
  };

  if (favorites.length === 0) {
    return (
      <div
        style={{
          marginTop: 32,
          textAlign: "center",
          fontSize: 20,
          fontWeight: "bold",
        }}
      >
        <h2>Нет избранных фильмов</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: isMobile ? "100vw" : 700,
        margin: isMobile ? 0 : "0 auto",
        padding: isMobile ? 8 : 0,
      }}
    >
      <h2 style={{ textAlign: "center", fontSize: isMobile ? 20 : 28 }}>
        Избранные фильмы
      </h2>
      {favorites.map((movie) => (
        <div
          key={movie.id}
          className="movie-card"
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "center",
            gap: isMobile ? 8 : 16,
            padding: isMobile ? 8 : 16,
            marginBottom: isMobile ? 12 : 20,
            borderRadius: 8,
            boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
            background: "#fff",
          }}
        >
          {movie.poster?.url && (
            <img
              src={movie.poster.url}
              alt={movie.name}
              width={isMobile ? 240 : 120}
              style={{
                borderRadius: 6,
                alignSelf: isMobile ? "center" : undefined,
                marginBottom: isMobile ? 8 : 0,
              }}
            />
          )}
          <div
            className="movie-info"
            style={{
              flex: 1,
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              gap: isMobile ? 6 : 10,
              fontSize: isMobile ? 15 : 16,
            }}
            onClick={() => navigate(`/movie/${movie.id}`)}
          >
            <div
              className="movie-title"
              style={{
                fontSize: isMobile ? 18 : 24,
                fontWeight: "bold",
                alignSelf: "flex-start",
              }}
            >
              {movie.name} ({movie.year})
            </div>
            <div
              className="movie-meta"
              style={{
                display: "flex",
                gap: isMobile ? 6 : 10,
                flexDirection: isMobile ? "column" : "row",
                fontSize: isMobile ? 14 : 16,
              }}
            >
              <div className="movie-meta">
                Рейтинг: {movie.rating?.kp ?? "—"}
              </div>
              <div className="movie-meta">
                Жанры: {movie.genres?.map((g) => g.name).join(", ")}
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowConfirmId(movie.id)}
            disabled={showConfirmId === movie.id}
            style={{
              background: "#f66",
              color: "#fff",
              padding: isMobile ? "6px 10px" : "8px 12px",
              border: "none",
              borderRadius: 4,
              marginLeft: isMobile ? 0 : 8,
              marginTop: isMobile ? 8 : 0,
              fontSize: isMobile ? 14 : 16,
              alignSelf: isMobile ? "stretch" : "center",
            }}
          >
            Удалить
          </button>
        </div>
      ))}
      {showConfirmId && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.35)",
              zIndex: 1000,
            }}
            onClick={handleCancel}
          />
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "#fff",
              color: "#222",
              padding: isMobile ? 16 : 32,
              borderRadius: 8,
              border: "none",
              boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
              textAlign: "center",
              zIndex: 1001,
              minWidth: isMobile ? 220 : 320,
              maxWidth: "90vw",
            }}
            role="dialog"
            aria-modal="true"
          >
            <h2
              style={{
                marginBottom: isMobile ? 16 : 24,
                fontSize: isMobile ? 16 : 20,
              }}
            >
              Вы уверены, что хотите удалить этот фильм из избранного?
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                justifyContent: "center",
                gap: isMobile ? 12 : 24,
              }}
            >
              <button
                onClick={() => handleConfirm(showConfirmId)}
                style={{
                  background: "#d32f2f",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  padding: isMobile ? "8px 0" : "10px 24px",
                  fontSize: isMobile ? 15 : 16,
                  cursor: "pointer",
                  marginBottom: isMobile ? 8 : 0,
                }}
              >
                Да
              </button>
              <button
                onClick={handleCancel}
                style={{
                  background: "#eee",
                  color: "#222",
                  border: "none",
                  borderRadius: 4,
                  padding: isMobile ? "8px 0" : "10px 24px",
                  fontSize: isMobile ? 15 : 16,
                  cursor: "pointer",
                }}
              >
                Нет
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
});

export default Favorites;
