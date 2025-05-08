import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { Subject, Subscription } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { takeUntil } from 'rxjs/operators';
import { WeatherCardComponent } from '../../../shared/components/weather-card/weather-card.component';
import { ForecastComponent } from '../../../shared/components/forecast/forecast.component';
import { WindInfoComponent } from '../../../shared/components/wind-info/wind-info.component';
import { UvIndicatorComponent } from '../../../shared/components/uv-indicator/uv-indicator.component';
import { MoonPhaseComponent } from '../../../shared/components/moon-phase/moon-phase.component';
import { PressureInfoComponent } from '../../../shared/components/pressure-info/pressure-info.component';
import { SunriseSunsetComponent } from '../../../shared/components/sunrise-sunset/sunrise-sunset.component';
import { WeatherService } from '../../../shared/services/weather.service';
import { UserGreetingComponent } from '../../../shared/components/user-greeting/user-greeting.component';

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

  isMobile = false;
  private destroy$ = new Subject<void>();
  private weatherSubscription?: Subscription;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private weatherService: WeatherService
  ) {}

  ngOnInit(): void {
    // Monitor de cambios en el viewport
    this.breakpointObserver
      .observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape])
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        this.isMobile = result.matches;
      });

    this.weatherSubscription = this.weatherService
      .getCurrentLocationWeather()
      .subscribe((weatherData) => {
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
          if (weatherData.sys && weatherData.sys.sunrise && weatherData.sys.sunset) {
            this.sunrise = weatherData.sys.sunrise;
            this.sunset = weatherData.sys.sunset;
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.weatherSubscription) {
      this.weatherSubscription.unsubscribe();
    }
  }

  private getWindDirection(degrees: number): string {
    const directions = [
      'Norte',
      'Noreste',
      'Este',
      'Sureste',
      'Sur',
      'Suroeste',
      'Oeste',
      'Noroeste',
    ];
    const index = Math.round(degrees / 45) % 8;
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
