import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { UserPreferencesService } from '../../services/user-preferences.service';

@Component({
  selector: 'app-welcome-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './welcome-dialog.component.html',
  styleUrls: ['./welcome-dialog.styles.scss']
})
export class WelcomeDialogComponent {
  userName: string = '';
  userEmail: string = '';

  constructor(
    private dialogRef: MatDialogRef<WelcomeDialogComponent>,
    private userPreferences: UserPreferencesService
  ) {}

  save(): void {
    if (this.userName && this.userEmail) {
      this.userPreferences.saveUserInfo({
        name: this.userName,
        email: this.userEmail
      });
      this.dialogRef.close();
    }
  }
}
