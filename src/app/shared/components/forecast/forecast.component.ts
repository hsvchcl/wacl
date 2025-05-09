import { Component, Input, OnInit, LOCALE_ID, Inject } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import localeEs from '@angular/common/locales/es';

// Registrar el locale español para los formatos de fecha
registerLocaleData(localeEs, 'es');

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
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' }
  ]
})
export class ForecastComponent implements OnInit {
  @Input() weeklyForecast: ForecastData[] = [];
  @Input() isLoading: boolean = true;

  ngOnInit() {
    // Componente inicializado con locale español
  }
}