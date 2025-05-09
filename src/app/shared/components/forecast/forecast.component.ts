import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

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
  imports: [CommonModule, MatCardModule]
})
export class ForecastComponent implements OnInit {
  @Input() weeklyForecast: ForecastData[] = [];
  @Input() isLoading: boolean = true;

  ngOnInit() {
    // Ya no es necesario cargar los datos desde aquí
  }
}