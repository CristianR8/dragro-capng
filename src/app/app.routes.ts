import { Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome';

export const routes: Routes = [
    { path: 'welcome', component: WelcomeComponent },
    { path: '', redirectTo: 'welcome', pathMatch: 'full' }
];
