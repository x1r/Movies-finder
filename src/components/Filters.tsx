import React from "react";
import { MovieFilters } from "../api/moviesApi";
import useIsMobile from "../hooks/useIsMobile";

const genresList = [
  "драма",
  "комедия",
  "боевик",
  "триллер",
  "мелодрама",
  "фантастика",
  "ужасы",
  "приключения",
];

interface FiltersProps {
  filters: MovieFilters;
  onChange: (filters: MovieFilters) => void;
}

const Filters: React.FC<FiltersProps> = ({ filters, onChange }) => {
  const isMobile = useIsMobile();
  const handleGenreChange = (genre: string) => {
    const genres = filters.genres || [];
    onChange({
      ...filters,
      genres: genres.includes(genre)
        ? genres.filter((g) => g !== genre)
        : [...genres, genre],
    });
  };
  const handleRatingChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    bound: "gte" | "lte"
  ) => {
    const value = Number(e.target.value);
    onChange({
      ...filters,
      rating: { ...filters.rating, [bound]: value },
    });
  };
  const handleYearChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    bound: "gte" | "lte"
  ) => {
    const value = Number(e.target.value);
    onChange({
      ...filters,
      year: { ...filters.year, [bound]: value },
    });
  };

  return (
    <div className="filters">
      <div
        style={{
          fontSize: isMobile ? 16 : 18,
          display: "flex",
          flexWrap: "wrap",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "flex-start" : "center",
          maxHeight: isMobile ? 120 : undefined,
          overflowY: isMobile ? "auto" : undefined,
        }}
      >
        <b>Жанры:</b>
        {genresList.map((genre) => (
          <label
            key={genre}
            style={{
              marginRight: 8,
              fontSize: isMobile ? 16 : 18,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <input
              type="checkbox"
              checked={filters.genres?.includes(genre) || false}
              onChange={() => handleGenreChange(genre)}
            />
            {genre}
          </label>
        ))}
      </div>
      <div
        style={{
          fontSize: isMobile ? 16 : 18,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <b>Рейтинг:</b>
        <input
          type="number"
          min={0}
          max={10}
          placeholder="от"
          value={filters.rating?.gte ?? ""}
          onChange={(e) => handleRatingChange(e, "gte")}
          style={{
            width: isMobile ? 40 : 60,
          }}
        />
        -
        <input
          type="number"
          min={0}
          max={10}
          placeholder="до"
          value={filters.rating?.lte ?? ""}
          onChange={(e) => handleRatingChange(e, "lte")}
          style={{
            width: isMobile ? 40 : 60,
          }}
        />
      </div>
      <div
        style={{
          fontSize: isMobile ? 16 : 18,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <b>Год:</b>
        <input
          type="number"
          min={1990}
          max={2025}
          placeholder="от"
          value={filters.year?.gte ?? ""}
          onChange={(e) => handleYearChange(e, "gte")}
          style={{
            width: isMobile ? 40 : 60,
          }}
        />
        -
        <input
          type="number"
          min={1990}
          max={2025}
          placeholder="до"
          value={filters.year?.lte ?? ""}
          onChange={(e) => handleYearChange(e, "lte")}
          style={{
            width: isMobile ? 40 : 60,
          }}
        />
      </div>
    </div>
  );
};

export default Filters;
