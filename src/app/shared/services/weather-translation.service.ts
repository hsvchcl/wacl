import { Injectable } from '@angular/core';

/**
 * Servicio para traducir las condiciones meteorológicas
 * devueltas por la API de OpenWeather
 */
@Injectable({
  providedIn: 'root'
})
export class WeatherTranslationService {
  // Mapa de traducciones para las condiciones principales
  private weatherConditions = new Map<string, string>([
    ['Clear', 'Despejado'],
    ['Clouds', 'Nublado'],
    ['Rain', 'Lluvia'],
    ['Drizzle', 'Llovizna'],
    ['Thunderstorm', 'Tormenta'],
    ['Snow', 'Nieve'],
    ['Mist', 'Neblina'],
    ['Smoke', 'Humo'],
    ['Haze', 'Bruma'],
    ['Dust', 'Polvo'],
    ['Fog', 'Niebla'],
    ['Sand', 'Arena'],
    ['Ash', 'Ceniza'],
    ['Squall', 'Chubasco'],
    ['Tornado', 'Tornado']
  ]);

  constructor() { }

  /**
   * Traduce una condición meteorológica del inglés al español
   * @param condition La condición en inglés
   * @returns La condición traducida al español o la condición original si no hay traducción
   */
  translateCondition(condition: string): string {
    return this.weatherConditions.has(condition) 
      ? this.weatherConditions.get(condition)! 
      : condition;
  }
}
