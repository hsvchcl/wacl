import { Routes } from '@angular/router';
import { CurrentWeatherComponent } from './features/weather/current-weather/current-weather.component';

export const routes: Routes = [
  { path: '', redirectTo: 'current', pathMatch: 'full' },
  { path: 'current', component: CurrentWeatherComponent },
];
