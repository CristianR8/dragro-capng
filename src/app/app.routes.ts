import { Routes } from '@angular/router';
import { FormComponent } from './form/form';
import { WelcomeComponent } from './welcome/welcome';
import { IntroComponent } from './intro/intro';
import { AccessEmailComponent } from './access-email/access-email';
import { AccessUsersComponent } from './access-users/access-users';
import { AccessPlacesComponent } from './access-place/access-place';

export const routes: Routes = [
  { path: 'form', component: FormComponent },          // << raíz: muestra el formulario
  { path: 'welcome', component: WelcomeComponent }, // << ruta secundaria
  { path: '', component: IntroComponent }, // << ruta para la introducción
  { path: 'access-email', component: AccessEmailComponent },
  { path: 'access-users', component: AccessUsersComponent },
  { path: 'access-places', component: AccessPlacesComponent }, // ← NUEVO
  { path: '', redirectTo: '/access-email', pathMatch: 'full' },
];
