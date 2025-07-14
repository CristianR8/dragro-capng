// main.ts
import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app';           
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

console.log('► main.ts ejecutado con Zone.js'); 

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule, FormsModule)
  ]
})
.catch(err => console.error(err));
