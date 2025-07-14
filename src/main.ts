import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient }    from '@angular/common/http';
import { importProvidersFrom }  from '@angular/core';
import { FormsModule }          from '@angular/forms';
import { HttpClientModule }     from '@angular/common/http';
import { provideRouter }        from '@angular/router'; 

import { App }                  from './app/app';
import { routes }               from './app/app.routes'; 

bootstrapApplication(App, {
  providers: [
    provideHttpClient(),
    importProvidersFrom([FormsModule, HttpClientModule]),
    provideRouter(routes) // ✅ AÑADE ESTO
  ]
}).catch(err => console.error(err));
