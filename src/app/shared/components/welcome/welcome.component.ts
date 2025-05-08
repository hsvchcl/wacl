import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { WelcomeDialogComponent } from './welcome-dialog.component';
import { UserPreferencesService } from '../../services/user-preferences.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule],
  template: '',
})
export class WelcomeComponent implements OnChanges {
  @Input() isLoading: boolean = true;
  private dialogRef: MatDialogRef<WelcomeDialogComponent> | undefined;
  private dialogShown = false;
  
  constructor(
    private dialog: MatDialog,
    private userPreferences: UserPreferencesService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    // Solo mostramos el diálogo cuando la carga ha terminado (isLoading cambia a false)
    if (changes['isLoading'] && changes['isLoading'].currentValue === false && !this.dialogShown) {
      // Verificar si el usuario ya ha ingresado sus datos
      const userInfo = this.userPreferences.getUserInfo();
      
      if (!userInfo) {
        // Si no hay datos de usuario, mostrar el diálogo después de un pequeño retraso
        // para asegurarnos de que la animación de carga haya terminado
        setTimeout(() => {
          this.openWelcomeDialog();
        }, 300);
      }
    }
  }

  private openWelcomeDialog(): void {
    this.dialogShown = true;
    this.dialogRef = this.dialog.open(WelcomeDialogComponent, {
      width: '400px',
      disableClose: true, // Evita que el usuario cierre el diálogo haciendo clic fuera
      hasBackdrop: true,
      backdropClass: ['backdrop-blur'], // Aplicar efecto blur al fondo (como array para mayor compatibilidad)
      panelClass: ['modern-dialog'] // Aplicar la clase para animación
    });
  }
}
