import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sunrise-sunset',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sunrise-sunset.component.html',
  styleUrl: './sunrise-sunset.component.scss'
})
export class SunriseSunsetComponent implements OnChanges {
  @Input() currentDate: Date = new Date();
  @Input() sunrise: number = 0;
  @Input() sunset: number = 0;

  sunriseTime: string = '';
  sunsetTime: string = '';
  dayDuration: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sunrise'] || changes['sunset']) {
      this.formatTimes();
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
