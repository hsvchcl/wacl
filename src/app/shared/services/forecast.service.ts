import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

interface ForecastItem {
  dt: number; // Timestamp
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
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  visibility: number;
  pop: number; // Probabilidad de precipitación
  dt_txt: string; // Fecha y hora en formato texto
}

export interface ForecastData {
  list: ForecastItem[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ForecastService {
  private forecastSubject = new BehaviorSubject<ForecastData | null>(null);
  public forecast$ = this.forecastSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Obtiene el pronóstico de 5 días por coordenadas geográficas
   * @param lat Latitud
   * @param lon Longitud
   * @returns Observable con los datos del pronóstico de 5 días
   */
  getForecastByCoords(lat: number, lon: number): Observable<ForecastData> {
    const params = {
      lat: lat.toString(),
      lon: lon.toString(),
      appid: environment.openWeatherApiKey,
      units: 'metric',
      lang: 'es'
    };

    return this.http.get<ForecastData>(`${environment.openWeatherForecastUrl}`, { params })
      .pipe(
        switchMap(forecastData => {
          this.forecastSubject.next(forecastData);
          return of(forecastData);
        })
      );
  }

  /**
   * Obtiene el pronóstico de 5 días por nombre de ciudad
   * @param city Nombre de la ciudad
   * @returns Observable con los datos del pronóstico de 5 días
   */
  getForecastByCity(city: string): Observable<ForecastData> {
    const params = {
      q: city,
      appid: environment.openWeatherApiKey,
      units: 'metric',
      lang: 'es'
    };

    return this.http.get<ForecastData>(`${environment.openWeatherForecastUrl}`, { params })
      .pipe(
        switchMap(forecastData => {
          this.forecastSubject.next(forecastData);
          return of(forecastData);
        })
      );
  }

  /**
   * Obtiene el pronóstico de 5 días para la ubicación actual
   * @returns Observable con los datos del pronóstico de 5 días
   */
  getCurrentLocationForecast(): Observable<ForecastData | null> {
    return this.forecast$;
  }
}
