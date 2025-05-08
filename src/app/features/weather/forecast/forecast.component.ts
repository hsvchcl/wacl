import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

interface DailyForecast {
  date: Date;
  temperature: number;
  condition: string;
}

@Component({
  selector: 'app-forecast',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './forecast.component.html',
  styleUrl: './forecast.component.scss'
})
export class ForecastComponent {
  weeklyForecast: DailyForecast[] = [
    { date: new Date(), temperature: 25, condition: 'Soleado' },
    { date: new Date(Date.now() + 86400000), temperature: 23, condition: 'Parcialmente nublado' },
    { date: new Date(Date.now() + 172800000), temperature: 22, condition: 'Lluvioso' },
    { date: new Date(Date.now() + 259200000), temperature: 24, condition: 'Soleado' },
    { date: new Date(Date.now() + 345600000), temperature: 26, condition: 'Despejado' }
  ];
}
