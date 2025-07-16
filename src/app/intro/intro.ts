import { Component, OnInit, Output, EventEmitter, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
export class IntroComponent implements OnInit, OnDestroy {

  @Output() continueClicked = new EventEmitter<void>();

  currentSlide = 0;
  private carouselInterval: any;
  private isTransitioning = false;

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

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    // Solo inicializar en el navegador
    if (isPlatformBrowser(this.platformId)) {
      this.initializeCarousel();
      // Asegurar que el primer slide esté visible
      this.ensureSlideVisibility();
    }
  }

  ngOnDestroy(): void {
    // Limpiar intervalos al destruir el componente
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }

    // Detener el carousel de Bootstrap si está activo
    if (isPlatformBrowser(this.platformId) && typeof document !== 'undefined') {
      const carousel = document.getElementById('introCarousel');
      if (carousel && typeof (window as any).bootstrap !== 'undefined') {
        try {
          const bootstrapCarousel = (window as any).bootstrap.Carousel.getInstance(carousel);
          if (bootstrapCarousel) {
            bootstrapCarousel.dispose();
          }
        } catch (error) {
          console.log('Error disposing Bootstrap carousel:', error);
        }
      }
    }
  }

  private initializeCarousel(): void {
    // Esperar a que el DOM esté completamente cargado
    setTimeout(() => {
      if (typeof document !== 'undefined') {
        const carousel = document.getElementById('introCarousel');
        if (carousel) {
          // Inicializar el carousel de Bootstrap si está disponible
          if (typeof (window as any).bootstrap !== 'undefined') {
            try {
              const bootstrapCarousel = new (window as any).bootstrap.Carousel(carousel, {
                interval: 5000,
                wrap: true,
                touch: true
              });

              // Escuchar eventos del carousel
              carousel.addEventListener('slide.bs.carousel', (event: any) => {
                this.currentSlide = event.to;
                this.isTransitioning = true;
              });

              carousel.addEventListener('slid.bs.carousel', (event: any) => {
                this.isTransitioning = false;
              });

              // Pausar cuando el usuario interactúa
              carousel.addEventListener('mouseenter', () => {
                bootstrapCarousel.pause();
              });

              carousel.addEventListener('mouseleave', () => {
                bootstrapCarousel.cycle();
              });

            } catch (error) {
              console.log('Error inicializando Bootstrap carousel:', error);
              this.setupFallbackCarousel();
            }
          } else {
            console.log('Bootstrap no disponible, usando fallback');
            this.setupFallbackCarousel();
          }
        }
      }
    }, 500);
  }

  private setupFallbackCarousel(): void {
    // Configurar auto-avance cada 5 segundos
    this.resumeAutoAdvance();
  }

  onContinue(): void {
    // Navegar a la ruta /form
    this.router.navigate(['/form']);
    
    // También emite el evento para que el componente padre pueda manejarlo si es necesario
    this.continueClicked.emit();
  }

  goToSlide(slideIndex: number): void {
    console.log('goToSlide called with index:', slideIndex, 'current:', this.currentSlide);
    
    if (slideIndex === this.currentSlide || this.isTransitioning) {
      console.log('Skipping slide change - same slide or transitioning');
      return;
    }
    
    this.isTransitioning = true;
    this.currentSlide = slideIndex;
    
    // Usar método directo en lugar de Bootstrap
    this.fallbackSlideChange(slideIndex);
  }

  private fallbackSlideChange(slideIndex: number): void {
    console.log('Using fallback slide change to:', slideIndex);
    
    // Método fallback para cambiar slides manualmente
    if (typeof document !== 'undefined') {
      const slides = document.querySelectorAll('.carousel-item');
      slides.forEach((slide, index) => {
        const element = slide as HTMLElement;
        if (index === slideIndex) {
          element.classList.add('active');
          element.style.display = 'block';
          element.style.opacity = '1';
        } else {
          element.classList.remove('active');
          element.style.display = 'none';
          element.style.opacity = '0';
        }
      });
      
      // Resetear la transición después de un breve delay
      setTimeout(() => {
        this.isTransitioning = false;
      }, 300);
    }
  }

  // Método adicional para asegurar que el slide correcto esté visible
  private ensureSlideVisibility(): void {
    if (typeof document !== 'undefined') {
      setTimeout(() => {
        const slides = document.querySelectorAll('.carousel-item');
        slides.forEach((slide, index) => {
          const element = slide as HTMLElement;
          if (index === this.currentSlide) {
            element.classList.add('active');
            element.style.display = 'block';
          } else {
            element.classList.remove('active');
            element.style.display = 'none';
          }
        });
      }, 100);
    }
  }

  nextSlide(): void {
    const nextIndex = (this.currentSlide + 1) % this.slides.length;
    this.goToSlide(nextIndex);
  }

  prevSlide(): void {
    const prevIndex = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
    this.goToSlide(prevIndex);
  }

  private pauseAutoAdvance(): void {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
      this.carouselInterval = null;
    }
  }

  private resumeAutoAdvance(): void {
    this.pauseAutoAdvance();
    this.carouselInterval = setInterval(() => {
      const nextSlide = (this.currentSlide + 1) % this.slides.length;
      this.goToSlide(nextSlide);
    }, 5000);
  }

  // Método simplificado para el click en indicadores
  onIndicatorClick(slideIndex: number): void {
    console.log('Indicator clicked:', slideIndex);
    
    // Pausar auto-avance
    this.pauseAutoAdvance();
    
    // Cambiar directamente el slide sin usar Bootstrap
    this.currentSlide = slideIndex;
    
    // Forzar la actualización del DOM
    this.forceSlideUpdate();
    
    // Reanudar auto-avance después de 3 segundos
    setTimeout(() => {
      this.resumeAutoAdvance();
    }, 3000);
  }

  // Método para forzar actualización del slide
  private forceSlideUpdate(): void {
    if (isPlatformBrowser(this.platformId) && typeof document !== 'undefined') {
      setTimeout(() => {
        const slides = document.querySelectorAll('.carousel-item');
        slides.forEach((slide, index) => {
          const element = slide as HTMLElement;
          if (index === this.currentSlide) {
            element.classList.add('active');
          } else {
            element.classList.remove('active');
          }
        });
      }, 50);
    }
  }
}