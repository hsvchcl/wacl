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
}
