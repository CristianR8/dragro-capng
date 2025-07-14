import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome.html',
  styleUrls: ['./welcome.css']
})
export class WelcomeComponent {
  cultivos = [
    { nombre: 'Cacao', img: 'images/cacao.png' },
    { nombre: 'Aguacate', img: 'images/aguacate.png' },
    { nombre: 'Café', img: 'images/cafe.png' }
  ];

  enfermedades = ['Mosca blanca', 'Oídio', 'Marchitez', 'Barrenador', 'Tizón', 'Escoba de bruja'];
}
