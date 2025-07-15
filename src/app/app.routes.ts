import { Routes } from '@angular/router';
import { FormComponent } from './form/form';
import { WelcomeComponent } from './welcome/welcome';
import { IntroComponent } from './intro/intro';

export const routes: Routes = [
  { path: 'form', component: FormComponent },          // << raíz: muestra el formulario
  { path: 'welcome', component: WelcomeComponent }, // << ruta secundaria
  { path: '', component: IntroComponent } // << ruta para la introducción
];
