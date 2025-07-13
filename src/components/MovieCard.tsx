import React from "react";
import useIsMobile from "../hooks/useIsMobile";

export interface MovieCardProps {
  movie: {
    id: string;
    name: string;
    year: number;
    rating?: { kp?: number };
    poster?: { url?: string };
    genres?: { name: string }[];
  };
  onClick?: (id: string) => void;
  refProp?: React.Ref<HTMLDivElement>;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick, refProp }) => {
  const isMobile = useIsMobile();
  return (
    <div
      className="movie-card"
      ref={refProp}
      onClick={() => onClick && onClick(movie.id)}
      style={{
        cursor: onClick ? "pointer" : undefined,
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "flex-start" : "center",
        gap: isMobile ? 8 : 16,
      }}
    >
      {movie.poster?.url && (
        <img
          src={movie.poster.url}
          alt={movie.name}
          width={isMobile ? 240 : 60}
          style={{
            borderRadius: 6,
            alignSelf: isMobile ? "center" : undefined,
            marginBottom: isMobile ? 8 : 0,
          }}
        />
      )}
      <div className="movie-info" style={{ fontSize: isMobile ? 16 : 18 }}>
        <div className="movie-title" style={{ fontSize: isMobile ? 16 : 18 }}>
          {movie.name} ({movie.year})
        </div>
        <div className="movie-meta" style={{ fontSize: isMobile ? 16 : 18 }}>
          Рейтинг: {movie.rating?.kp ?? "—"}
        </div>
        <div className="movie-meta" style={{ fontSize: isMobile ? 16 : 18 }}>
          Жанры: {movie.genres?.map((g) => g.name).join(", ")}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
