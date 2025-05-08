import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WelcomeDialogComponent } from './welcome-dialog.component';
import { UserPreferencesService } from '../../services/user-preferences.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule],
  template: '',
})
export class WelcomeComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private userPreferences: UserPreferencesService
  ) {}

  ngOnInit() {
    // Verificar si el usuario ya ha ingresado sus datos
    const userInfo = this.userPreferences.getUserInfo();
    
    if (!userInfo) {
      // Si no hay datos de usuario, mostrar el diálogo
      this.openWelcomeDialog();
    }
  }

  private openWelcomeDialog(): void {
    this.dialog.open(WelcomeDialogComponent, {
      width: '400px',
      disableClose: true, // Evita que el usuario cierre el diálogo haciendo clic fuera
      hasBackdrop: true,
      backdropClass: ['backdrop-blur'], // Aplicar efecto blur al fondo (como array para mayor compatibilidad)
      panelClass: ['modern-dialog'] // Aplicar la clase para animación
    });
  }
}
