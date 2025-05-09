import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sunrise-sunset',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sunrise-sunset.component.html',
  styleUrl: './sunrise-sunset.component.scss'
})
export class SunriseSunsetComponent implements OnChanges, OnInit {
  @Input() currentDate: Date = new Date();
  @Input() sunrise: number = 0;
  @Input() sunset: number = 0;
  @Input() loading: boolean = true;

  sunriseTime: string = '';
  sunsetTime: string = '';
  dayDuration: string = '';
  sunProgressPercentage: number = 0;
  isNight: boolean = false;
  
  private updateInterval: any;

  ngOnInit(): void {
    this.updateSunPosition();
    // Actualizar la posición cada minuto
    this.updateInterval = setInterval(() => {
      this.updateSunPosition();
    }, 60000);
  }
  
  ngOnDestroy(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sunrise'] || changes['sunset'] || changes['currentDate']) {
      this.formatTimes();
      this.updateSunPosition();
      
      // Si tenemos datos de sunrise y sunset, consideramos que los datos están cargados
      if (this.sunrise && this.sunset) {
        setTimeout(() => {
          this.loading = false;
        }, 500); // Pequeño delay para dar tiempo a que se vea el skeleton
      }
    }
  }

  private updateSunPosition(): void {
    const now = Math.floor(new Date().getTime() / 1000); // Tiempo actual en segundos
    
    // Comprueba si es de noche (antes del amanecer o después del atardecer)
    if (this.sunrise && this.sunset) {
      if (now < this.sunrise) {
        // Antes del amanecer
        this.isNight = true;
        this.sunProgressPercentage = 0;
      } else if (now > this.sunset) {
        // Después del atardecer
        this.isNight = true;
        this.sunProgressPercentage = 100;
      } else {
        // Durante el día
        this.isNight = false;
        // Calcular el porcentaje del día que ha pasado
        const totalDayTime = this.sunset - this.sunrise;
        const elapsedTime = now - this.sunrise;
        this.sunProgressPercentage = Math.min(100, Math.max(0, (elapsedTime / totalDayTime) * 100));
      }
    }
  }

  private formatTimes(): void {
    if (this.sunrise) {
      const sunriseDate = new Date(this.sunrise * 1000);
      this.sunriseTime = sunriseDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    if (this.sunset) {
      const sunsetDate = new Date(this.sunset * 1000);
      this.sunsetTime = sunsetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    if (this.sunrise && this.sunset) {
      const durationMs = (this.sunset - this.sunrise) * 1000;
      const hours = Math.floor(durationMs / (1000 * 60 * 60));
      const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
      this.dayDuration = `${hours}h ${minutes}m`;
    }
  }
}
