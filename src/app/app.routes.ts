import { Routes } from '@angular/router';
import { FormComponent } from './form/form';
import { WelcomeComponent } from './welcome/welcome';

export const routes: Routes = [
  { path: '', component: FormComponent },          // << raíz: muestra el formulario
  { path: 'welcome', component: WelcomeComponent } // << ruta secundaria
];
