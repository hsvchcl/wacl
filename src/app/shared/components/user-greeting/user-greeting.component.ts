import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserPreferencesService } from '../../services/user-preferences.service';
import { FavoriteCitiesComponent } from '../favorite-cities/favorite-cities.component';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-user-greeting',
  standalone: true,
  imports: [
    CommonModule,
    FavoriteCitiesComponent
  ],
  templateUrl: './user-greeting.component.html',
  styleUrls: ['./user-greeting.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)', filter: 'blur(8px)' }),
        animate('0.7s cubic-bezier(0.16, 1, 0.3, 1)', 
          style({ opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' }))
      ])
    ])
  ]
})
export class UserGreetingComponent implements OnInit {
  userName: string = '';
  greeting: string = '';
  currentDate: string = '';

  constructor(private userPreferences: UserPreferencesService) {
    this.updateCurrentDate();
  }

  ngOnInit(): void {
    this.userPreferences.userInfo$.subscribe(userInfo => {
      if (userInfo) {
        this.userName = userInfo.name;
        this.updateGreeting();
      }
    });
  }

  private updateCurrentDate(): void {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    this.currentDate = new Date().toLocaleDateString('es-ES', options);
    // Capitalizar primera letra
    this.currentDate = this.currentDate.charAt(0).toUpperCase() + this.currentDate.slice(1);
  }

  private updateGreeting(): void {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      this.greeting = 'Buenos días';
    } else if (hour >= 12 && hour < 20) {
      this.greeting = 'Buenas tardes';
    } else {
      this.greeting = 'Buenas noches';
    }
  }
}
