import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { UserPreferencesService } from '../../services/user-preferences.service';
import { trigger, transition, style, animate, AnimationEvent } from '@angular/animations';

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
  styleUrls: ['./welcome-dialog.styles.scss'],
  animations: [
    trigger('dialogFade', [
      // Cuando el diálogo entra (aparece)
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('400ms ease-out', 
          style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      // Cuando el diálogo sale (desaparece)
      transition(':leave', [
        animate('300ms ease-in', 
          style({ opacity: 0, transform: 'scale(0.95)' }))
      ])
    ])
  ]
})
export class WelcomeDialogComponent {
  userName: string = '';
  userEmail: string = '';
  animationState: 'visible' | 'hidden' = 'visible';

  constructor(
    private dialogRef: MatDialogRef<WelcomeDialogComponent>,
    private userPreferences: UserPreferencesService
  ) {
    // Configurar el diálogo para usar nuestra animación personalizada al cerrar
    this.dialogRef.addPanelClass('fade-dialog');
  }

  save(): void {
    if (this.userName && this.userEmail) {
      this.userPreferences.saveUserInfo({
        name: this.userName,
        email: this.userEmail
      });
      this.closeWithAnimation();
    }
  }

  // Método para cerrar el diálogo con animación
  closeWithAnimation(): void {
    this.animationState = 'hidden';
    // Esperar a que la animación termine antes de cerrar el diálogo
    setTimeout(() => {
      this.dialogRef.close();
    }, 300);
  }

  // Método para manejar eventos de animación (opcional, para futuras mejoras)
  onAnimationDone(event: AnimationEvent): void {
    // Se puede usar para lógica adicional después de que la animación termina
  }
}
