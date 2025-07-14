import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormComponent } from './form/form';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FormComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {}
