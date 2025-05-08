import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { Subject } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { takeUntil } from 'rxjs/operators';
import { WeatherCardComponent } from '../../../shared/components/weather-card/weather-card.component';
import { ForecastComponent } from '../../../shared/components/forecast/forecast.component';
import { WindInfoComponent } from '../../../shared/components/wind-info/wind-info.component';
import { UvIndicatorComponent } from '../../../shared/components/uv-indicator/uv-indicator.component';
import { MoonPhaseComponent } from '../../../shared/components/moon-phase/moon-phase.component';

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
  ],
})
export class CurrentWeatherComponent implements OnInit, OnDestroy {
  currentDate = new Date();
  temperature = 25;
  weatherCondition = 'Soleado';
  humidity = 65;
  windSpeed = 12;
  
  // Nuevas propiedades para la información del viento
  windDirection = 'Noreste';
  windGust = 17; // km/h
  windPressure = 1013; // hPa
  beaufortScale = 4; // Escala de Beaufort
  
  // Propiedad para el índice UV
  uvIndex = 7; // Índice UV (escala 0-11+)

  isMobile = false;
  private destroy$ = new Subject<void>();

  constructor(private breakpointObserver: BreakpointObserver) {}
  ngOnInit() {
    // Monitor de cambios en el viewport
    this.breakpointObserver
      .observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape])
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        this.isMobile = result.matches;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
