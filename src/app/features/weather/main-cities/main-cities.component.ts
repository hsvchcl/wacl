import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { WeatherService } from '../../../shared/services/weather.service';

interface City {
  name: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-main-cities',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './main-cities.component.html',
  styleUrl: './main-cities.component.scss'
})
export class MainCitiesComponent {
  @Output() citySelected = new EventEmitter<string>();
  @Output() closeDialog = new EventEmitter<void>();

  cities: City[] = [
    { name: 'Santiago', icon: 'location_city', description: 'Capital de Chile' },
    { name: 'Valparaíso', icon: 'sailing', description: 'Ciudad portuaria' },
    { name: 'Concepción', icon: 'beach_access', description: 'Capital del Biobío' },
    { name: 'Antofagasta', icon: 'landscape', description: 'Ciudad minera' },
    { name: 'Viña del Mar', icon: 'beach_access', description: 'Ciudad jardín' },
    { name: 'La Serena', icon: 'terrain', description: 'Ciudad histórica' },
    { name: 'Iquique', icon: 'waves', description: 'Ciudad costera' },
    { name: 'Rancagua', icon: 'agriculture', description: 'Capital de O\'Higgins' },
    { name: 'Puerto Montt', icon: 'sailing', description: 'Puerta a la Patagonia' },
    { name: 'Arica', icon: 'water', description: 'Ciudad fronteriza' },
    { name: 'Temuco', icon: 'forest', description: 'Capital de La Araucanía' },
    { name: 'Punta Arenas', icon: 'ac_unit', description: 'Ciudad austral' }
  ];

  constructor(private weatherService: WeatherService) {}

  selectCity(cityName: string): void {
    // Solo emitimos el evento sin hacer la llamada directa a la API
    this.citySelected.emit(cityName);
    this.close();
  }

  close(): void {
    this.closeDialog.emit();
  }
}
