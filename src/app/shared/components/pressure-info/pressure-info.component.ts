import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pressure-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pressure-info.component.html',
  styleUrl: './pressure-info.component.scss'
})
export class PressureInfoComponent {
  @Input() currentDate: Date = new Date();
  @Input() pressure: number = 1013; // Presión en hPa (hectopascales)
  @Input() trend: string = 'stable'; // 'rising', 'falling', 'stable'

  // Método para obtener descripción de la presión atmosférica
  get pressureCategory(): string {
    if (this.pressure < 980) {
      return 'Baja';
    } else if (this.pressure >= 980 && this.pressure < 1000) {
      return 'Moderadamente baja';
    } else if (this.pressure >= 1000 && this.pressure < 1020) {
      return 'Normal';
    } else if (this.pressure >= 1020 && this.pressure < 1040) {
      return 'Moderadamente alta';
    } else {
      return 'Alta';
    }
  }

  // Método para obtener pronóstico basado en presión y tendencia
  get weatherForecast(): string {
    if (this.pressure < 1000 && this.trend === 'falling') {
      return 'Probablemente lluvia o tormenta';
    } else if (this.pressure < 1000 && this.trend === 'rising') {
      return 'Mejora del clima';
    } else if (this.pressure > 1020 && this.trend === 'rising') {
      return 'Clima seco y estable';
    } else if (this.pressure > 1020 && this.trend === 'falling') {
      return 'Clima cambiante';
    } else {
      return 'Clima estable';
    }
  }

  // Método para obtener el ícono según tendencia
  get trendIcon(): string {
    if (this.trend === 'rising') {
      return '↑'; // flecha hacia arriba
    } else if (this.trend === 'falling') {
      return '↓'; // flecha hacia abajo
    } else {
      return '→'; // flecha horizontal
    }
  }
}
