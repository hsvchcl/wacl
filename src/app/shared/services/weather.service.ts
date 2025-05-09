import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, switchMap, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserPreferencesService } from './user-preferences.service';

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
  providedIn: 'root',
})
export class WeatherService {
  private currentLocationSubject = new BehaviorSubject<GeoLocation | null>(
    null
  );
  public currentLocation$ = this.currentLocationSubject.asObservable();
  private currentWeatherSubject = new BehaviorSubject<WeatherData | null>(null);
  public currentWeather$ = this.currentWeatherSubject.asObservable();

  constructor(
    private http: HttpClient,
    private userPreferencesService: UserPreferencesService
  ) {
    // Solo inicializamos la obtención de la ubicación del usuario
    // Los métodos getWeatherByCoords y getWeatherByCity actualizan directamente los subjects
    // por lo que no necesitamos suscribirnos adicionalmente a los cambios de location
    this.getUserLocation();
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
            lon,
          };
          this.currentLocationSubject.next(location);
          this.getLocationNameByCoords(lat, lon).then(fullLocation => {
            // Guardar como ubicación del hogar si no existe una previamente
            if (!this.userPreferencesService.hasHomeLocation()) {
              this.userPreferencesService.saveHomeLocation({
                city: fullLocation.city,
                country: fullLocation.country,
                lat: lat,
                lon: lon
              });
            }
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Si falla la geolocalización, intentamos con una ubicación por defecto
          this.getWeatherByCity('Santiago').subscribe((weatherData) => {
            this.currentWeatherSubject.next(weatherData);
            this.currentLocationSubject.next({
              city: 'Santiago',
              country: 'CL',
            });
          });
        }
      );
    } else {
      // Si no hay geolocalización disponible, usar ubicación por defecto
      this.getWeatherByCity('Santiago').subscribe((weatherData) => {
        this.currentWeatherSubject.next(weatherData);
        this.currentLocationSubject.next({
          city: 'Santiago',
          country: 'CL',
        });
      });
    }
  }

  private getLocationNameByCoords(lat: number, lon: number): Promise<GeoLocation> {
    const params = {
      lat: lat.toString(),
      lon: lon.toString(),
      appid: environment.openWeatherApiKey,
      units: 'metric',
      lang: 'es',
    };

    return new Promise((resolve, reject) => {
      this.http.get<WeatherData>(`${environment.openWeatherApiUrl}`, { params })
        .subscribe({
          next: (weatherData) => {
            // Actualizar los datos del clima y la ubicación
            this.currentWeatherSubject.next(weatherData);
            
            // Actualizar la ubicación
            const location: GeoLocation = {
              city: weatherData.name,
              country: weatherData.sys.country,
              lat: lat,
              lon: lon,
            };
            this.currentLocationSubject.next(location);

            resolve(location);
          },
          error: (error) => {
            console.error('Error getting location name:', error);
            reject(error);
          }
        });
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
      lang: 'es',
    };

    return this.http
      .get<WeatherData>(`${environment.openWeatherApiUrl}`, { params })
      .pipe(
        switchMap((weatherData) => {
          // Actualizar la ubicación actual y los datos del clima
          this.currentWeatherSubject.next(weatherData);

          // Actualizar la ubicación en una única operación para evitar múltiples suscripciones
          const location: GeoLocation = {
            city: weatherData.name,
            country: weatherData.sys.country,
            lat: lat,
            lon: lon,
          };
          this.currentLocationSubject.next(location);
          
          return of(weatherData); // Devolver el weatherData para mantener la cadena Observable
        })
      );
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
      lang: 'es',
    };

    return this.http
      .get<WeatherData>(`${environment.openWeatherApiUrl}`, { params })
      .pipe(
        switchMap((weatherData) => {
          // Actualizar la ubicación actual y los datos del clima
          this.currentWeatherSubject.next(weatherData);

          // Actualizar la ubicación en una única operación para evitar múltiples suscripciones
          const location = {
            city: weatherData.name,
            country: weatherData.sys.country,
          };
          this.currentLocationSubject.next(location);
          
          return of(weatherData); // Devolver el weatherData para mantener la cadena Observable
        })
      );
  }

  /**
   * Obtiene el clima de la ubicación actual del usuario
   * @returns Observable con los datos del clima actualizados en tiempo real
   */
  getCurrentLocationWeather(): Observable<WeatherData | null> {
    return this.currentWeather$;
  }
}
