import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ForecastService, ForecastData } from './forecast.service';
import { environment } from '../../../environments/environment';

describe('ForecastService', () => {
  let service: ForecastService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ForecastService]
    });
    service = TestBed.inject(ForecastService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get forecast by coordinates', () => {
    const mockForecast: ForecastData = {
      list: [
        {
          dt: 1620000000,
          main: {
            temp: 20,
            feels_like: 18,
            temp_min: 18,
            temp_max: 22,
            pressure: 1015,
            humidity: 70
          },
          weather: [
            {
              id: 800,
              main: 'Clear',
              description: 'cielo claro',
              icon: '01d'
            }
          ],
          clouds: { all: 10 },
          wind: { speed: 2.5, deg: 180 },
          visibility: 10000,
          pop: 0.1,
          dt_txt: '2023-05-03 12:00:00'
        }
      ],
      city: {
        id: 3871336,
        name: 'Santiago',
        coord: { lat: -33.4569, lon: -70.6483 },
        country: 'CL',
        population: 4837295,
        timezone: -10800,
        sunrise: 1620034111,
        sunset: 1620073516
      }
    };

    service.getForecastByCoords(-33.4569, -70.6483).subscribe(forecast => {
      expect(forecast).toEqual(mockForecast);
    });

    const req = httpMock.expectOne(
      `${environment.openWeatherForecastUrl}?lat=-33.4569&lon=-70.6483&appid=${environment.openWeatherApiKey}&units=metric&lang=es`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockForecast);
  });

  it('should get forecast by city name', () => {
    const mockForecast: ForecastData = {
      list: [
        {
          dt: 1620000000,
          main: {
            temp: 20,
            feels_like: 18,
            temp_min: 18,
            temp_max: 22,
            pressure: 1015,
            humidity: 70
          },
          weather: [
            {
              id: 800,
              main: 'Clear',
              description: 'cielo claro',
              icon: '01d'
            }
          ],
          clouds: { all: 10 },
          wind: { speed: 2.5, deg: 180 },
          visibility: 10000,
          pop: 0.1,
          dt_txt: '2023-05-03 12:00:00'
        }
      ],
      city: {
        id: 3871336,
        name: 'Santiago',
        coord: { lat: -33.4569, lon: -70.6483 },
        country: 'CL',
        population: 4837295,
        timezone: -10800,
        sunrise: 1620034111,
        sunset: 1620073516
      }
    };

    service.getForecastByCity('Santiago').subscribe(forecast => {
      expect(forecast).toEqual(mockForecast);
    });

    const req = httpMock.expectOne(
      `${environment.openWeatherForecastUrl}?q=Santiago&appid=${environment.openWeatherApiKey}&units=metric&lang=es`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockForecast);
  });

  it('should get current location forecast', (done) => {
    const mockForecast: ForecastData = {
      list: [],
      city: {
        id: 3871336,
        name: 'Santiago',
        coord: { lat: -33.4569, lon: -70.6483 },
        country: 'CL',
        population: 4837295,
        timezone: -10800,
        sunrise: 1620034111,
        sunset: 1620073516
      }
    };

    // Primero obtenemos el pronóstico para establecer un valor
    service.getForecastByCity('Santiago').subscribe(() => {
      // Luego comprobamos que getCurrentLocationForecast devuelve ese valor
      service.getCurrentLocationForecast().subscribe(forecast => {
        expect(forecast).toEqual(mockForecast);
        done();
      });
    });

    const req = httpMock.expectOne(
      `${environment.openWeatherForecastUrl}?q=Santiago&appid=${environment.openWeatherApiKey}&units=metric&lang=es`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockForecast);
  });
});
