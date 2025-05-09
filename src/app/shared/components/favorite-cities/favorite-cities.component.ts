import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { FavoriteCitiesService } from '../../services/favorite-cities.service';
import { WeatherService } from '../../services/weather.service';
import { ForecastService } from '../../services/forecast.service';

@Component({
  selector: 'app-favorite-cities',
  standalone: true,
  imports: [
    CommonModule,
    MatChipsModule,
    MatIconModule
  ],
  templateUrl: './favorite-cities.component.html',
  styleUrls: ['./favorite-cities.component.scss']
})
export class FavoriteCitiesComponent implements OnInit {
  favoriteCities: string[] = [];

  constructor(
    private favoriteCitiesService: FavoriteCitiesService,
    private weatherService: WeatherService,
    private forecastService: ForecastService
  ) { }

  ngOnInit(): void {
    this.favoriteCitiesService.favoriteCities$.subscribe(cities => {
      this.favoriteCities = cities;
    });
  }

  selectCity(cityName: string): void {
    // Actualizamos el clima para la ciudad seleccionada
    this.weatherService.getWeatherByCity(cityName).subscribe({
      next: (weatherData) => {
        // Actualizamos también el pronóstico
        this.forecastService.getForecastByCity(cityName).subscribe({
          next: (forecastData) => {
          },
          error: (error) => {
            console.error(`Error al obtener el pronóstico para ${cityName}:`, error);
          }
        });
      },
      error: (error) => {
        console.error(`Error al obtener el clima para ${cityName}:`, error);
      }
    });
  }

  removeCity(cityName: string, event: Event): void {
    event.stopPropagation(); // Evitar que se active el chip
    this.favoriteCitiesService.removeFavoriteCity(cityName);
  }
}