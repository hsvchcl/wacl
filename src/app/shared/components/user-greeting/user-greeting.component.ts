import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserPreferencesService } from '../../services/user-preferences.service';
import { FavoriteCitiesComponent } from '../favorite-cities/favorite-cities.component';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { WelcomeDialogComponent } from '../welcome/welcome-dialog.component';

@Component({
  selector: 'app-user-greeting',
  standalone: true,
  imports: [
    CommonModule,
    FavoriteCitiesComponent,
    MatDialogModule,
    MatIconModule
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
    ]),
    trigger('pulseAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px) scale(0.95)' }),
        animate('0.6s 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)', 
          style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
      ]),
      transition('* => in', [
        style({ transform: 'scale(1)' }),
        animate('2s cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ transform: 'scale(1)' })),
      ])
    ])
  ]
})
export class UserGreetingComponent implements OnInit {
  userName: string = '';
  userEmail: string = '';
  greeting: string = '';
  currentDate: string = '';
  showEditIcon: boolean = false;

  constructor(
    private userPreferences: UserPreferencesService,
    private dialog: MatDialog
  ) {
    this.updateCurrentDate();
  }

  ngOnInit(): void {
    this.userPreferences.userInfo$.subscribe(userInfo => {
      if (userInfo) {
        this.userName = userInfo.name;
        this.userEmail = userInfo.email;
        this.updateGreeting();
      }
    });
  }
  
  openEditProfileDialog(): void {
    const dialogRef = this.dialog.open(WelcomeDialogComponent, {
      width: '400px',
      hasBackdrop: true,
      backdropClass: ['backdrop-blur'],
      panelClass: ['modern-dialog']
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
