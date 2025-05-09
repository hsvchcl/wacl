import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { WeatherService } from '../../services/weather.service';
import { ForecastService } from '../../services/forecast.service';
import { FavoriteCitiesService } from '../../services/favorite-cities.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { MainCitiesComponent } from '../../../features/weather/main-cities/main-cities.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatDialogModule,
    HttpClientModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  currentCity: string = '';
  private locationSubscription?: Subscription;

  constructor(
    private weatherService: WeatherService,
    private forecastService: ForecastService,
    private favoriteCitiesService: FavoriteCitiesService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.locationSubscription = this.weatherService.currentLocation$.subscribe(
      (location) => {
        if (location) {
          console.log('Current location:', location);
          this.currentCity = location.city;
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.locationSubscription) {
      this.locationSubscription.unsubscribe();
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  openCitiesModal() {
    const dialogRef = this.dialog.open(MainCitiesComponent, {
      width: '90%',
      maxWidth: '800px',
      panelClass: 'cities-modal-container',
      autoFocus: false,
      disableClose: false,
    });

    dialogRef.componentInstance.citySelected.subscribe((cityName: string) => {
      console.log(`Ciudad seleccionada: ${cityName}`);

      // Guardamos la ciudad en favoritos
      this.favoriteCitiesService.addFavoriteCity(cityName);

      // Hacemos la llamada a la API para actualizar el clima
      this.weatherService.getWeatherByCity(cityName).subscribe({
        next: (weatherData) => {
          console.log(`Clima actualizado para ${cityName}`, weatherData);
          
          // Actualizamos también el pronóstico para la ciudad seleccionada
          this.forecastService.getForecastByCity(cityName).subscribe({
            next: (forecastData) => {
              console.log(`Pronóstico actualizado para ${cityName}`, forecastData);
            },
            error: (error) => {
              console.error(`Error al obtener el pronóstico para ${cityName}:`, error);
            }
          });
        },
        error: (error) => {
          console.error(`Error al obtener el clima para ${cityName}:`, error);
        },
      });
      
      // Cerramos el modal cuando se selecciona una ciudad
      dialogRef.close();
    });

    // Suscripción al evento closeDialog para cerrar el modal
    dialogRef.componentInstance.closeDialog.subscribe(() => {
      dialogRef.close();
    });
  }
}
