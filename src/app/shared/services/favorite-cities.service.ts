import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoriteCitiesService {
  private readonly STORAGE_KEY = 'favorite_cities';
  private favoriteCitiesSubject = new BehaviorSubject<string[]>([]);
  public favoriteCities$ = this.favoriteCitiesSubject.asObservable();

  constructor() {
    this.loadFavoriteCities();
  }

  private loadFavoriteCities(): void {
    const storedCities = localStorage.getItem(this.STORAGE_KEY);
    if (storedCities) {
      this.favoriteCitiesSubject.next(JSON.parse(storedCities));
    }
  }

  addFavoriteCity(cityName: string): void {
    const currentCities = this.getFavoriteCities();
    // Evitar duplicados
    if (!currentCities.includes(cityName)) {
      const updatedCities = [...currentCities, cityName];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedCities));
      this.favoriteCitiesSubject.next(updatedCities);
    }
  }

  removeFavoriteCity(cityName: string): void {
    const currentCities = this.getFavoriteCities();
    const updatedCities = currentCities.filter(city => city !== cityName);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedCities));
    this.favoriteCitiesSubject.next(updatedCities);
  }

  getFavoriteCities(): string[] {
    const storedCities = localStorage.getItem(this.STORAGE_KEY);
    try {
      const cities = storedCities ? JSON.parse(storedCities) : [];
      // Asegurarse de que cities es un array
      return Array.isArray(cities) ? cities : [];
    } catch (e) {
      console.error('Error al obtener ciudades favoritas:', e);
      return [];
    }
  }

  hasFavoriteCities(): boolean {
    const cities = this.getFavoriteCities();
    return cities.length > 0;
  }
}
