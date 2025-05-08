import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { Subject } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { takeUntil } from 'rxjs/operators';
import { WeatherCardComponent } from '../../../shared/components/weather-card/weather-card.component';
import { ForecastComponent } from '../forecast/forecast.component';

@Component({
  selector: 'app-current-weather',
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.scss'],
  standalone: true,
  imports: [
    MatCardModule, 
    MatIconModule, 
    DatePipe, 
    MatGridListModule,
    WeatherCardComponent,
    ForecastComponent
  ],
})
export class CurrentWeatherComponent implements OnInit, OnDestroy {
  currentDate = new Date();
  temperature = 25;
  weatherCondition = 'Soleado';
  humidity = 65;
  windSpeed = 12;

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
