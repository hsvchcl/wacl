# Aplicación del Clima - Prueba Técnica Tinet

![Versión de Angular](https://img.shields.io/badge/angular-19.2.11-red)
![Material UI](https://img.shields.io/badge/angular%20material-19.2.15-blue)

Una aplicación web desarrollada en Angular que permite consultar información meteorológica en tiempo real, utilizando la API de OpenWeatherMap y servicios de geolocalización.

## 📋 Características

- **Detección automática de ubicación** del usuario
- **Información meteorológica actual** con detalles como:
  - Temperatura actual y sensación térmica
  - Presión atmosférica
  - Humedad
  - Velocidad y dirección del viento
- **Pronóstico extendido** para los próximos días
- **Fases lunares** 
- **Información de amanecer y atardecer**
- **Indicador de índice UV**
- **Ciudades favoritas** que pueden ser guardadas por el usuario
- **Interfaz responsiva** adaptada a diferentes dispositivos
- **Traducciones de condiciones meteorológicas** al español

## 🛠️ Tecnologías Utilizadas

- **Angular 19.2.11** - Framework de desarrollo frontend
- **Angular Material 19.2.15** - Componentes UI
- **RxJS** - Programación reactiva
- **OpenWeatherMap API** - Datos meteorológicos
- **ipinfo.io** - Servicio de geolocalización
- **Firebase Hosting** - Despliegue de la aplicación

## 🚀 Instalación y Ejecución

### Requisitos previos

- Node.js (v16.x o superior)
- npm (v7.x o superior) o yarn
- Angular CLI v19.x

### Pasos para la instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/hsvchcl/PruebaTecnicaTinet/prueba-tecnica-tinet-angular.git
   cd prueba-tecnica-tinet-angular
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm start
   # o
   ng serve
   ```

4. Abre tu navegador y visita:
   ```
   http://localhost:4200/
   ```

## 📦 Compilación para producción

Para generar una versión optimizada para producción:

```bash
npm run build
# o
ng build
```

Los archivos compilados se encontrarán en el directorio `dist/prueba-tecnica-tinet-angular/browser/`.

## 🔧 Configuración

Las variables de entorno se encuentran en los archivos:
- `src/environments/environment.ts` (desarrollo)
- `src/environments/environment.prod.ts` (producción)

Puedes modificar las API keys y URLs según tus necesidades:

```typescript
export const environment = {
  production: false, // o true para environment.prod.ts
  geoApiUrl: 'https://ipinfo.io/json',
  geoApiKey: 'tu_api_key_aquí',
  openWeatherApiUrl: 'https://api.openweathermap.org/data/2.5/weather',
  openWeatherForecastUrl: 'https://api.openweathermap.org/data/2.5/forecast',
  openWeatherApiKey: 'tu_api_key_aquí',
};
```

## 🧪 Pruebas

### Pruebas unitarias

Para ejecutar las pruebas unitarias con Karma:

```bash
npm test
# o
ng test
```

### Pruebas end-to-end

Para ejecutar pruebas e2e (requiere configuración previa):

```bash
npm run e2e
# o
ng e2e
```

## 📱 Despliegue

La aplicación está configurada para ser desplegada en Firebase Hosting:

```bash
npm install -g firebase-tools
firebase login
firebase deploy
```

## 📚 Estructura del Proyecto

```
src/
├── app/
│   ├── features/           # Características principales
│   │   └── weather/        # Módulos relacionados con el clima
│   │       ├── current-weather/  # Clima actual
│   │       └── main-cities/      # Ciudades principales
│   ├── shared/             # Componentes y servicios compartidos
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pipes/          # Pipes personalizados
│   │   └── services/       # Servicios de la aplicación
│   ├── app.component.*     # Componente raíz
│   └── app.routes.ts       # Configuración de rutas
└── environments/           # Variables de entorno
```

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para contribuir:

1. Haz un fork del proyecto
2. Crea una rama para tu característica (`git checkout -b feature/amazing-feature`)
3. Realiza tus cambios y haz commits (`git commit -m 'Add some amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo LICENSE.md para más detalles.

## 👨‍💻 Autor

- Hans Vega - [hsvchcl](https://github.com/hsvchcl)

---

Desarrollado como parte de una prueba técnica para Tinet.
