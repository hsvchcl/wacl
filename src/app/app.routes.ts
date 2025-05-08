import { Routes } from '@angular/router';
import { CurrentWeatherComponent } from './features/weather/current-weather/current-weather.component';
import { ForecastComponent } from './features/weather/forecast/forecast.component';
import { MainCitiesComponent } from './features/weather/main-cities/main-cities.component';

export const routes: Routes = [
  { path: '', redirectTo: 'current', pathMatch: 'full' },
  { path: 'current', component: CurrentWeatherComponent },
  { path: 'forecast', component: ForecastComponent },
  { path: 'cities', component: MainCitiesComponent },
];
