import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-wind-info',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './wind-info.component.html',
  styleUrl: './wind-info.component.scss'
})
export class WindInfoComponent {
  @Input() currentDate: Date = new Date();
  @Input() windSpeed: number = 0;
  @Input() windDirection: string = '';
  @Input() windGust: number = 0;
  @Input() windPressure: number = 0;
  @Input() beaufortScale: number = 0;
}
