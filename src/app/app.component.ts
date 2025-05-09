import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { WelcomeComponent } from './shared/components/welcome/welcome.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, CommonModule, WelcomeComponent]
})
export class AppComponent implements OnInit {
  title = 'Weather App';
  isLoading = true;

  ngOnInit() {
    this.getLocation();

    // Limpiar localStorage al cargar la página
    localStorage.clear();
  }

  private getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Aquí puedes usar la posición para obtener el clima
          setTimeout(() => {
            this.isLoading = false;
          }, 1000);
        },
        (error) => {
          console.error('Error getting location:', error);
          this.isLoading = false;
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      this.isLoading = false;
    }
  }
}
