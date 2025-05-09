import { Pipe, PipeTransform } from '@angular/core';
import { WeatherTranslationService } from '../services/weather-translation.service';

@Pipe({
  name: 'weatherCondition',
  standalone: true
})
export class WeatherConditionPipe implements PipeTransform {
  constructor(private weatherTranslation: WeatherTranslationService) {}

  transform(condition: string): string {
    return this.weatherTranslation.translateCondition(condition);
  }
}
