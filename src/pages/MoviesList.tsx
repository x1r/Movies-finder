import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchMovies, MovieFilters, MovieApiResponse } from "../api/moviesApi";
import MovieCard from "../components/MovieCard";
import Filters from "../components/Filters";
import useIsMobile from "../hooks/useIsMobile";

function parseFiltersFromSearchParams(
  searchParams: URLSearchParams
): MovieFilters {
  const genres = searchParams.getAll("genre");
  const ratingGte = searchParams.get("rating_gte");
  const ratingLte = searchParams.get("rating_lte");
  const yearGte = searchParams.get("year_gte");
  const yearLte = searchParams.get("year_lte");
  const filters: MovieFilters = {};
  if (genres.length > 0) filters.genres = genres;
  if (ratingGte || ratingLte) filters.rating = {};
  if (ratingGte) filters.rating!.gte = Number(ratingGte);
  if (ratingLte) filters.rating!.lte = Number(ratingLte);
  if (yearGte || yearLte) filters.year = {};
  if (yearGte) filters.year!.gte = Number(yearGte);
  if (yearLte) filters.year!.lte = Number(yearLte);
  return filters;
}

function filtersToSearchParams(filters: MovieFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.genres) {
    filters.genres.forEach((g) => params.append("genre", g));
  }
  if (filters.rating?.gte !== undefined)
    params.set("rating_gte", String(filters.rating.gte));
  if (filters.rating?.lte !== undefined)
    params.set("rating_lte", String(filters.rating.lte));
  if (filters.year?.gte !== undefined)
    params.set("year_gte", String(filters.year.gte));
  if (filters.year?.lte !== undefined)
    params.set("year_lte", String(filters.year.lte));
  return params;
}

function MoviesList() {
  const [movies, setMovies] = useState<MovieApiResponse["docs"]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<MovieFilters>(() =>
    parseFiltersFromSearchParams(searchParams)
  );
  const isMobile = useIsMobile();
  const observer = useRef<IntersectionObserver | null>(null);
  const lastMovieRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    setSearchParams(filtersToSearchParams(filters));
  }, [filters, setSearchParams]);

  useEffect(() => {
    setFilters(parseFiltersFromSearchParams(searchParams));
  }, [searchParams]);

  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, [filters]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchMovies(page, 50, filters)
      .then((data) => {
        setMovies((prev) => (page === 1 ? data.docs : [...prev, ...data.docs]));
        setHasMore(data.docs.length > 0);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message || "Ошибка загрузки фильмов");
        setLoading(false);
      });
  }, [page, filters]);

  const navigate = useNavigate();
  const handleMovieClick = (id: string) => {
    navigate(`/movie/${id}`);
  };

  return (
    <div
      style={{
        padding: isMobile ? 8 : 16,
      }}
    >
      <h2>Список фильмов</h2>
      <Filters filters={filters} onChange={setFilters} />
      {error && (
        <div style={{ color: "red", marginBottom: 16, textAlign: "center" }}>
          {error}
        </div>
      )}
      <div className="movies-grid">
        {movies.map((movie, idx) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onClick={handleMovieClick}
            refProp={idx === movies.length - 1 ? lastMovieRef : undefined}
          />
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: 16, marginBottom: 16 }}>
        {loading && <div>Загрузка...</div>}
        {!hasMore && !loading && movies.length > 0 && (
          <div>Больше фильмов нет</div>
        )}
        {!loading && !error && movies.length === 0 && (
          <div>Фильмы не найдены</div>
        )}
      </div>
    </div>
  );
}

export default MoviesList;
