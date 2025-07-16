import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface SlideData {
  title: string;
  imagePath: string;
}

@Component({
  selector: 'app-intro-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './intro.html',
  styleUrls: ['./intro.css']
})
export class IntroComponent implements OnInit {

  @Output() continueClicked = new EventEmitter<void>();

  slides: SlideData[] = [
    {
      title: 'Simplificamos la gestión agropecuaria de enfermedades y plagas que afectan el campo Colombiano.',
      imagePath: 'images/enfermedades.png'
    },
    {
      title: 'Simplificamos la gestión agropecuaria de enfermedades y plagas que afectan el campo Colombiano.',
      imagePath: 'images/cultivos.png' 
    },
    {
      title: 'Simplificamos la gestión agropecuaria de enfermedades y plagas que afectan el campo Colombiano.',
      imagePath: 'images/calidad.png' 
    }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Aquí puedes agregar lógica de inicialización si es necesaria
  }

  onContinue(): void {
    // Navegar a la ruta /form
    this.router.navigate(['/form']);
    
    // También emite el evento para que el componente padre pueda manejarlo si es necesario
    this.continueClicked.emit();
  }

  // Método opcional para navegar programáticamente entre slides
  goToSlide(slideIndex: number): void {
    const carousel = document.getElementById('introCarousel');
    if (carousel) {
      const bootstrapCarousel = new (window as any).bootstrap.Carousel(carousel);
      bootstrapCarousel.to(slideIndex);
    }
  }

  // Método opcional para ir al siguiente slide
  nextSlide(): void {
    const carousel = document.getElementById('introCarousel');
    if (carousel) {
      const bootstrapCarousel = new (window as any).bootstrap.Carousel(carousel);
      bootstrapCarousel.next();
    }
  }

  // Método opcional para ir al slide anterior
  prevSlide(): void {
    const carousel = document.getElementById('introCarousel');
    if (carousel) {
      const bootstrapCarousel = new (window as any).bootstrap.Carousel(carousel);
      bootstrapCarousel.prev();
    }
  }
}