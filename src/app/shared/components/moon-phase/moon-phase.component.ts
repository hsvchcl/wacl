import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-moon-phase',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './moon-phase.component.html',
  styleUrl: './moon-phase.component.scss'
})
export class MoonPhaseComponent implements OnInit {
  @Input() currentDate: Date = new Date();
  
  moonPhase: string = '';
  moonPhasePercentage: number = 0;
  moonIllumination: number = 0;
  nextFullMoon: Date = new Date();
  daysUntilFullMoon: number = 0;
  moonPhaseIcon: string = '';

  // Fases lunares en español
  moonPhases = [
    { name: 'Luna Nueva', icon: '🌑' },
    { name: 'Luna Creciente', icon: '🌒' },
    { name: 'Cuarto Creciente', icon: '🌓' },
    { name: 'Gibosa Creciente', icon: '🌔' },
    { name: 'Luna Llena', icon: '🌕' },
    { name: 'Gibosa Menguante', icon: '🌖' },
    { name: 'Cuarto Menguante', icon: '🌗' },
    { name: 'Luna Menguante', icon: '🌘' }
  ];

  ngOnInit(): void {
    this.calculateMoonPhase();
  }

  calculateMoonPhase(): void {
    // Un ciclo lunar completo dura aproximadamente 29.53 días
    const lunarMonth = 29.53; 
    
    // Fecha de referencia conocida de luna nueva (1 de enero de 2000)
    const refDate = new Date(2000, 0, 6, 18, 14, 0);
    
    // Diferencia de tiempo en días
    const diffTime = Math.abs(this.currentDate.getTime() - refDate.getTime());
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
    // Calcular la posición actual en el ciclo lunar (0 a 1)
    let phase = (diffDays % lunarMonth) / lunarMonth;
    
    // Convertir a porcentaje (0 a 100)
    this.moonPhasePercentage = Math.round(phase * 100);
    
    // Determinar la fase lunar basada en el porcentaje
    const phaseIndex = Math.floor(phase * 8) % 8;
    this.moonPhase = this.moonPhases[phaseIndex].name;
    this.moonPhaseIcon = this.moonPhases[phaseIndex].icon;
    
    // Calcular iluminación (simplificado)
    if (phase < 0.5) {
      this.moonIllumination = Math.round(phase * 2 * 100);
    } else {
      this.moonIllumination = Math.round((1 - (phase - 0.5) * 2) * 100);
    }
    
    // Calcular días hasta la próxima luna llena
    let daysToFullMoon = 0;
    if (phaseIndex < 4) {
      daysToFullMoon = (4 - phaseIndex) * (lunarMonth / 8);
    } else {
      daysToFullMoon = (8 - phaseIndex + 4) * (lunarMonth / 8);
    }
    
    this.daysUntilFullMoon = Math.round(daysToFullMoon);
    
    // Calcular la fecha de la próxima luna llena
    const nextFullMoonTime = this.currentDate.getTime() + (daysToFullMoon * 24 * 60 * 60 * 1000);
    this.nextFullMoon = new Date(nextFullMoonTime);
  }
}
