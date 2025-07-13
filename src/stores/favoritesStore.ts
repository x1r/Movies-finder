import { makeAutoObservable, runInAction } from "mobx";

export interface FavoriteMovie {
  id: string;
  name: string;
  year: number;
  poster?: { url?: string };
  rating?: { kp?: number };
  genres?: { name: string }[];
}

class FavoritesStore {
  favorites: FavoriteMovie[] = [];

  constructor() {
    makeAutoObservable(this);
    this.loadFromStorage();
  }

  add(movie: FavoriteMovie) {
    if (!this.favorites.find((f) => f.id === movie.id)) {
      this.favorites.push(movie);
      this.saveToStorage();
    }
  }

  remove(id: string) {
    this.favorites = this.favorites.filter((f) => f.id !== id);
    this.saveToStorage();
  }

  isFavorite(id: string) {
    return this.favorites.some((f) => f.id === id);
  }

  saveToStorage() {
    localStorage.setItem("favorites", JSON.stringify(this.favorites));
  }

  loadFromStorage() {
    const data = localStorage.getItem("favorites");
    if (data) {
      try {
        runInAction(() => {
          this.favorites = JSON.parse(data);
        });
      } catch {}
    }
  }
}

export const favoritesStore = new FavoritesStore();
