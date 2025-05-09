import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { Subject, Subscription } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { takeUntil, take } from 'rxjs/operators';
import { WeatherCardComponent } from '../../../shared/components/weather-card/weather-card.component';
import { ForecastComponent } from '../../../shared/components/forecast/forecast.component';
import { WindInfoComponent } from '../../../shared/components/wind-info/wind-info.component';
import { UvIndicatorComponent } from '../../../shared/components/uv-indicator/uv-indicator.component';
import { MoonPhaseComponent } from '../../../shared/components/moon-phase/moon-phase.component';
import { PressureInfoComponent } from '../../../shared/components/pressure-info/pressure-info.component';
import { SunriseSunsetComponent } from '../../../shared/components/sunrise-sunset/sunrise-sunset.component';
import { WeatherService } from '../../../shared/services/weather.service';
import { ForecastService, ForecastData as ApiForcastData } from '../../../shared/services/forecast.service';
import { UserGreetingComponent } from '../../../shared/components/user-greeting/user-greeting.component';

// Agregar la interface ForecastData
interface ForecastData {
  date: Date;
  temperature: number;
  icon: string;
  description: string;
  condition: string;
  maxTemp: number;
  minTemp: number;
}

@Component({
  selector: 'app-current-weather',
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.scss'],
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatGridListModule,
    WeatherCardComponent,
    ForecastComponent,
    WindInfoComponent,
    UvIndicatorComponent,
    MoonPhaseComponent,
    PressureInfoComponent,
    SunriseSunsetComponent,
    UserGreetingComponent,
  ],
})
export class CurrentWeatherComponent implements OnInit, OnDestroy {
  currentDate = new Date();
  temperature = 0;
  weatherCondition = '';
  humidity = 0;
  windSpeed = 0;

  // Propiedades para la información del viento
  windDirection = '';
  windGust = 0;
  windPressure = 0;
  beaufortScale = 0;

  // Propiedad para el índice UV
  uvIndex = 0;

  // Propiedades para la presión atmosférica
  atmosphericPressure = 0;
  pressureTrend = 'stable';

  // Propiedades para la salida y puesta del sol
  sunrise = 0;
  sunset = 0;

  // Propiedad para el pronóstico
  weeklyForecast: ForecastData[] = [];
  isLoadingForecast = true;
  isLoadingWeather = true;

  isMobile = false;
  private destroy$ = new Subject<void>();
  private weatherSubscription?: Subscription;
  private locationSubscription?: Subscription;
  private forecastSubscription?: Subscription;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private weatherService: WeatherService,
    private forecastService: ForecastService
  ) {}

  ngOnInit(): void {
    // Monitor de cambios en el viewport
    this.breakpointObserver
      .observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape])
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        this.isMobile = result.matches;
      });

    // Suscribirse a la ubicación actual para obtener las coordenadas
    this.locationSubscription = this.weatherService.currentLocation$
      .pipe(takeUntil(this.destroy$))
      .subscribe(location => {
        if (location && location.lat && location.lon) {
          // Cargar el pronóstico cuando tengamos las coordenadas
          this.loadForecast(location.lat, location.lon);
        }
      });

    // Suscribirse al clima actual
    this.weatherSubscription = this.weatherService
      .getCurrentLocationWeather()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (weatherData) => {
          console.log('Weather data:', weatherData);

          if (weatherData) {
            // Actualizar la temperatura y condiciones climáticas
            this.temperature = Math.round(weatherData.main.temp);
            this.weatherCondition = weatherData.weather[0].description;
            this.humidity = weatherData.main.humidity;

            // Actualizar información del viento
            this.windSpeed = Math.round(weatherData.wind.speed * 3.6); // Convertir m/s a km/h
            this.windDirection = this.getWindDirection(weatherData.wind.deg);

            // Actualizar presión atmosférica
            this.atmosphericPressure = weatherData.main.pressure;

            // Calcular escala Beaufort
            this.beaufortScale = this.calculateBeaufortScale(
              weatherData.wind.speed
            );

            // Actualizar datos de amanecer y atardecer
            if (
              weatherData.sys &&
              weatherData.sys.sunrise &&
              weatherData.sys.sunset
            ) {
              this.sunrise = weatherData.sys.sunrise;
              this.sunset = weatherData.sys.sunset;
            }
            
            // Marcar como cargado
            this.isLoadingWeather = false;
          }
        },
        error: (error) => {
          console.error('Error al obtener datos del clima:', error);
          this.isLoadingWeather = false; // También marcar como cargado en caso de error
        }
      });
      
    // Suscribirse directamente al observable del pronóstico
    // Esto permitirá que los datos se actualicen cuando cambie el pronóstico desde cualquier componente
    this.forecastSubscription = this.forecastService.forecast$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (forecastData) => {
          if (forecastData) {
            console.log('Forecast data updated from service:', forecastData);
            this.processForecastData(forecastData);
            this.isLoadingForecast = false;
          }
        },
        error: (error) => {
          console.error('Error al obtener el pronóstico:', error);
          this.isLoadingForecast = false;
        }
      });
  }

  loadForecast(lat: number, lon: number): void {
    this.isLoadingForecast = true;
    
    // Utilizamos getForecastByCoords para actualizar el pronóstico basado en coordenadas
    // No necesitamos procesar los datos aquí ya que la suscripción a forecast$ se encargará de ello
    this.forecastService
      .getForecastByCoords(lat, lon)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: (error) => {
          console.error('Error al obtener el pronóstico por coordenadas:', error);
          this.isLoadingForecast = false;
        }
      });
  }

  processForecastData(apiData: ApiForcastData): void {
    // Procesar y agrupar datos por día (una entrada por día)
    const dailyData = new Map<string, ForecastData>();
    const today = new Date();
    const uniqueDays = new Set<string>();
    
    // Primero aseguremos que los pronósticos están ordenados por fecha
    const sortedForecasts = [...apiData.list].sort((a, b) => a.dt - b.dt);
    
    sortedForecasts.forEach(item => {
      const date = new Date(item.dt * 1000);
      
      // Usamos día y mes como clave para asegurar unicidad por día del calendario
      const dayKey = `${date.getDate()}-${date.getMonth()}`;
      
      // Si ya procesamos este día del calendario, lo saltamos
      if (!uniqueDays.has(dayKey)) {
        uniqueDays.add(dayKey);
        
        // Formato de fecha para mostrar
        const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
        
        dailyData.set(dateStr, {
          date: date,
          temperature: Math.round(item.main.temp),
          icon: item.weather[0].icon,
          description: item.weather[0].description,
          condition: item.weather[0].main,
          maxTemp: Math.round(item.main.temp_max),
          minTemp: Math.round(item.main.temp_min)
        });
      }
    });
    
    // Convertir el Map a un array y ordenar por fecha
    this.weeklyForecast = Array.from(dailyData.values())
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 6); // Limitar a 6 días como indica el título del componente
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.weatherSubscription) {
      this.weatherSubscription.unsubscribe();
    }
    if (this.locationSubscription) {
      this.locationSubscription.unsubscribe();
    }
    if (this.forecastSubscription) {
      this.forecastSubscription.unsubscribe();
    }
  }

  private getWindDirection(degrees: number): string {
    const directions = [
      'Norte',
      'NorNoreste',
      'NorEste',
      'EsteNorEste',
      'Este',
      'EsteSurEste',
      'SurEste',
      'SurSurEste',
      'Sur',
      'SurSurOeste',
      'SurOeste',
      'OesteSurOeste',
      'Oeste',
      'OesteNorOeste',
      'NorOeste',
      'NorNorOeste',
    ];

    // Calcular el índice en el array de direcciones
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  }

  private calculateBeaufortScale(windSpeed: number): number {
    // Velocidad del viento en m/s
    if (windSpeed < 0.3) return 0; // Calma
    if (windSpeed < 1.6) return 1; // Ventolina
    if (windSpeed < 3.4) return 2; // Brisa muy débil
    if (windSpeed < 5.5) return 3; // Brisa débil
    if (windSpeed < 8.0) return 4; // Brisa moderada
    if (windSpeed < 10.8) return 5; // Brisa fresca
    if (windSpeed < 13.9) return 6; // Brisa fuerte
    if (windSpeed < 17.2) return 7; // Viento fuerte
    if (windSpeed < 20.8) return 8; // Viento duro
    if (windSpeed < 24.5) return 9; // Viento muy duro
    if (windSpeed < 28.5) return 10; // Temporal
    if (windSpeed < 32.7) return 11; // Borrasca
    return 12; // Huracán
  }
}
