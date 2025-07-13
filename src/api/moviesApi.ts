import axios from "axios";

const API_URL = "https://api.kinopoisk.dev/v1.4/movie";
const API_KEY = process.env.REACT_APP_KINOPOISK_DEV_API_KEY || "";

export interface MovieFilters {
  genres?: string[];
  rating?: { gte?: number; lte?: number };
  year?: { gte?: number; lte?: number };
}

export interface MovieApiResponse {
  docs: Array<{
    id: string;
    name: string;
    year: number;
    rating?: { kp?: number };
    poster?: { url?: string };
    genres?: { name: string }[];
  }>;
  total: number;
  limit: number;
  page: number;
  pages: number;
}

function serializeParams(params: Record<string, any>): string {
  const parts: string[] = [];
  for (const key in params) {
    const value = params[key];
    if (Array.isArray(value)) {
      value.forEach((v) =>
        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(v)}`)
      );
    } else if (value !== undefined && value !== null) {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }
  }
  return parts.join("&");
}

export async function fetchMovies(
  page = 1,
  limit = 50,
  filters: MovieFilters = {}
): Promise<MovieApiResponse> {
  const params: any = {
    page,
    limit,
  };
  if (filters.genres && filters.genres.length > 0) {
    params["genres.name"] = filters.genres.map((g) => `+${g}`);
  }
  if (filters.rating) {
    if (filters.rating.gte !== undefined && filters.rating.lte !== undefined) {
      params["rating.kp"] = `${filters.rating.gte}-${filters.rating.lte}`;
    } else if (filters.rating.gte !== undefined) {
      params["rating.kp"] = `${filters.rating.gte}-10`;
    } else if (filters.rating.lte !== undefined) {
      params["rating.kp"] = `0-${filters.rating.lte}`;
    }
  }
  if (filters.year) {
    const isValidYear = (y: any) =>
      typeof y === "number" && /^\d{4}$/.test(String(y));
    if (
      filters.year.gte !== undefined &&
      filters.year.lte !== undefined &&
      isValidYear(filters.year.gte) &&
      isValidYear(filters.year.lte)
    ) {
      params["year"] = `${filters.year.gte}-${filters.year.lte}`;
    } else if (
      filters.year.gte !== undefined &&
      isValidYear(filters.year.gte)
    ) {
      params["year"] = `${filters.year.gte}-2025`;
    } else if (
      filters.year.lte !== undefined &&
      isValidYear(filters.year.lte)
    ) {
      params["year"] = `1990-${filters.year.lte}`;
    }
  }
  try {
    const response = await axios.get(API_URL, {
      params,
      headers: {
        "X-API-KEY": API_KEY,
      },
      paramsSerializer: serializeParams,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Ошибка запроса к API");
  }
}
