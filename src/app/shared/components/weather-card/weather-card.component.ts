import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-weather-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './weather-card.component.html',
  styleUrls: ['./weather-card.component.scss']
})
export class WeatherCardComponent {
  @Input() currentDate: Date = new Date();
  @Input() temperature: number = 0;
  @Input() weatherCondition: string = '';
  @Input() humidity: number = 0;
  @Input() windSpeed: number = 0;
}
