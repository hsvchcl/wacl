import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-uv-indicator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './uv-indicator.component.html',
  styleUrl: './uv-indicator.component.scss'
})
export class UvIndicatorComponent {
  @Input() uvIndex: number = 0;
  @Input() currentDate: Date = new Date();

  // Método para determinar el nivel de riesgo basado en el índice UV
  get uvRiskLevel(): string {
    if (this.uvIndex < 3) {
      return 'Bajo';
    } else if (this.uvIndex < 6) {
      return 'Moderado';
    } else if (this.uvIndex < 8) {
      return 'Alto';
    } else if (this.uvIndex < 11) {
      return 'Muy Alto';
    } else {
      return 'Extremo';
    }
  }

  // Método para determinar el color basado en el nivel de riesgo
  get uvRiskColor(): string {
    if (this.uvIndex < 3) {
      return 'green';
    } else if (this.uvIndex < 6) {
      return 'yellow';
    } else if (this.uvIndex < 8) {
      return 'orange';
    } else if (this.uvIndex < 11) {
      return 'red';
    } else {
      return 'purple';
    }
  }
  
  // Método para obtener el gradiente de fondo según el índice UV
  get backgroundGradient(): string {
    if (this.uvIndex < 3) {
      return 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #388e3c 100%)';  // Verde oscuro
    } else if (this.uvIndex < 6) {
      return 'linear-gradient(135deg, #33691e 0%, #558b2f 50%, #689f38 100%)';  // Verde-amarillo oscuro
    } else if (this.uvIndex < 8) {
      return 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #388e3c 100%)';  // Verde oscuro
    } else if (this.uvIndex < 11) {
      return 'linear-gradient(135deg, #004d40 0%, #00695c 50%, #00796b 100%)';  // Verde-azulado oscuro
    } else {
      return 'linear-gradient(135deg, #1b5e20 0%, #33691e 50%, #1b5e20 100%)';  // Verde muy oscuro
    }
  }
}
