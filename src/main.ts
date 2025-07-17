import 'zone.js'; // ← AGREGAR esta línea al inicio
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideZoneChangeDetection } from '@angular/core'; // ← AGREGAR
import { importProvidersFrom } from '@angular/core'; // ← AGREGAR
import { ReactiveFormsModule } from '@angular/forms'; // ← AGREGAR

import { App } from './app/app';
import { routes } from './app/app.routes';

bootstrapApplication(App, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), // ← AGREGAR
    provideHttpClient(),
    provideRouter(routes),
    importProvidersFrom(ReactiveFormsModule) // ← AGREGAR
  ]
});