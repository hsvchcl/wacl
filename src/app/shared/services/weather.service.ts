import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, switchMap, of } from 'rxjs';
import { environment } from '../../../environments/environment';

interface GeoLocation {
  city: string;
  country: string;
  lat?: number;
  lon?: number;
}

interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  name: string;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private currentLocationSubject = new BehaviorSubject<GeoLocation | null>(null);
  public currentLocation$ = this.currentLocationSubject.asObservable();
  private currentWeatherSubject = new BehaviorSubject<WeatherData | null>(null);
  public currentWeather$ = this.currentWeatherSubject.asObservable();

  constructor(private http: HttpClient) {
    this.getUserLocation();
    
    // Suscribirse a los cambios de ubicación para actualizar el clima
    this.currentLocation$.pipe(
      switchMap(location => {
        if (location?.lat && location?.lon) {
          // Obtener el clima actual
          return this.getWeatherByCoords(location.lat, location.lon);
        } else if (location?.city) {
          // Obtener el clima actual
          return this.getWeatherByCity(location.city);
        }
        return of(null);
      })
    ).subscribe(weatherData => {
      if (weatherData) {
        this.currentWeatherSubject.next(weatherData);
      }
    });
  }

  getUserLocation(): void {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const location: GeoLocation = {
            city: '',
            country: '',
            lat,
            lon
          };
          this.currentLocationSubject.next(location);
          this.getLocationNameByCoords(lat, lon);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Si falla la geolocalización, intentamos con una ubicación por defecto
          this.getWeatherByCity('Santiago').subscribe(
            weatherData => {
              this.currentWeatherSubject.next(weatherData);
              this.currentLocationSubject.next({
                city: 'Santiago',
                country: 'CL'
              });
            }
          );
        }
      );
    } else {
      // Si no hay geolocalización disponible, usar ubicación por defecto
      this.getWeatherByCity('Santiago').subscribe(
        weatherData => {
          this.currentWeatherSubject.next(weatherData);
          this.currentLocationSubject.next({
            city: 'Santiago',
            country: 'CL'
          });
        }
      );
    }
  }

  private getLocationNameByCoords(lat: number, lon: number): void {
    const params = {
      lat: lat.toString(),
      lon: lon.toString(),
      appid: environment.openWeatherApiKey
    };

    this.http.get<WeatherData>(`${environment.openWeatherApiUrl}`, { params })
      .subscribe({
        next: (data) => {
          const location: GeoLocation = {
            city: data.name,
            country: data.sys.country,
            lat: lat,
            lon: lon
          };
          this.currentLocationSubject.next(location);
          this.currentWeatherSubject.next(data);
        },
        error: (error) => {
          console.error('Error getting location name:', error);
        }
      });
  }

  /**
   * Obtiene el clima actual por coordenadas geográficas
   * @param lat Latitud
   * @param lon Longitud
   * @returns Observable con los datos del clima
   */
  getWeatherByCoords(lat: number, lon: number): Observable<WeatherData> {
    const params = {
      lat: lat.toString(),
      lon: lon.toString(),
      appid: environment.openWeatherApiKey,
      units: 'metric',
      lang: 'es'
    };

    return this.http.get<WeatherData>(`${environment.openWeatherApiUrl}`, { params });
  }

  /**
   * Obtiene el clima actual por nombre de ciudad
   * @param city Nombre de la ciudad
   * @returns Observable con los datos del clima
   */
  getWeatherByCity(city: string): Observable<WeatherData> {
    const params = {
      q: city,
      appid: environment.openWeatherApiKey,
      units: 'metric',
      lang: 'es'
    };

    return this.http.get<WeatherData>(`${environment.openWeatherApiUrl}`, { params });
  }

  /**
   * Obtiene el clima de la ubicación actual del usuario
   * @returns Observable con los datos del clima actualizados en tiempo real
   */
  getCurrentLocationWeather(): Observable<WeatherData | null> {
    return this.currentWeather$;
  }
}
