import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserPreferencesService } from '../../services/user-preferences.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-user-greeting',
  standalone: true,
  imports: [CommonModule],
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

  constructor(private userPreferences: UserPreferencesService) {}

  ngOnInit(): void {
    this.userPreferences.userInfo$.subscribe(userInfo => {
      if (userInfo) {
        this.userName = userInfo.name;
        this.updateGreeting();
      }
    });
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
