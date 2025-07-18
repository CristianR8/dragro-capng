import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../components/spinner/spinner';
import { SpinnerService } from '../services/spinner.service';

interface Cultivo {
  nombre: string;
  img: string;
  descripcion?: string;
}

interface Enfermedad {
  nombre: string;
  img: string;
  severidad?: 'baja' | 'media' | 'alta';
  tipo?: 'plaga' | 'enfermedad' | 'hongo';
}

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './welcome.html',
  styleUrls: ['./welcome.css']
})
export class WelcomeComponent implements OnInit, AfterViewInit, OnDestroy {
  
  cultivos: Cultivo[] = [
    { 
      nombre: 'Cacao', 
      img: 'images/cacao-2.png',
      descripcion: 'Cultivo tropical de alto valor'
    },
    { 
      nombre: 'Aguacate', 
      img: 'images/aguacate-2.png',
      descripcion: 'Fruto nutritivo y versátil'
    },
    { 
      nombre: 'Caucho', 
      img: 'images/caucho-2.png',
      descripcion: 'Fuente de látex natural'
    },
    { 
      nombre: 'Algodón', 
      img: 'images/algodon-2.png',
      descripcion: 'Cultivo básico para textiles'
    },
    {
      nombre: 'Mango',
      img: 'images/mango.png',
      descripcion: 'Fruta tropical dulce y jugosa' 
    },
    {
      nombre: 'Papa',
      img: 'images/papa.png',
      descripcion: 'Cultivo de alto valor'
    },
    {
      nombre: 'Tomate',
      img: 'images/tomate.png',
      descripcion: 'Cultivo de alto valor'
    },
  ];

  enfermedades: Enfermedad[] = [
    { 
      nombre: 'Mosca blanca', 
      img: 'images/algodon-2.png',
      severidad: 'alta',
      tipo: 'plaga'
    },
    { 
      nombre: 'Oídio', 
      img: 'images/algodon-2.png',
      severidad: 'media',
      tipo: 'hongo'
    },
    { 
      nombre: 'Marchitez', 
      img: 'images/algodon-2.png',
      severidad: 'alta',
      tipo: 'enfermedad'
    },
    { 
      nombre: 'Barrenador', 
      img: 'images/algodon-2.png',
      severidad: 'alta',
      tipo: 'plaga'
    },
    { 
      nombre: 'Tizón', 
      img: 'images/algodon-2.png',
      severidad: 'media',
      tipo: 'hongo'
    },
    { 
      nombre: 'Escoba de bruja', 
      img: 'images/algodon-2.png',
      severidad: 'alta',
      tipo: 'hongo'
    },
    { 
      nombre: 'Roya', 
      img: 'images/algodon-2.png',
      severidad: 'alta',
      tipo: 'hongo'
    },
    { 
      nombre: 'Trips', 
      img: 'images/algodon-2.png',
      severidad: 'media',
      tipo: 'plaga'
    },
    { 
      nombre: 'Áfidos', 
      img: 'images/algodon-2.png',
      severidad: 'media',
      tipo: 'plaga'
    },
    { 
      nombre: 'Antracnosis', 
      img: 'images/algodon-2.png',
      severidad: 'alta',
      tipo: 'hongo'
    },
    { 
      nombre: 'Nematodos', 
      img: 'images/algodon-2.png',
      severidad: 'alta',
      tipo: 'plaga'
    },
    { 
      nombre: 'Mildiu', 
      img: 'images/algodon-2.png',
      severidad: 'media',
      tipo: 'hongo'
    }
  ];

  private screenWidth = 0;

  constructor(private spinnerService: SpinnerService) {}

  ngOnInit(): void {
    this.updateScreenWidth();
  }

  ngAfterViewInit(): void {
    // Capacitor maneja automáticamente los carousels de Bootstrap
    if (typeof window !== 'undefined') {
      this.updateScreenWidth();
      window.addEventListener('resize', () => this.updateScreenWidth());
    }
    
    // Activar spinner después de que la vista esté inicializada
    this.loadInitialData();
  }

  // Método para mostrar spinner solo al entrar a la vista
  private async loadInitialData(): Promise<void> {
    // Usar setTimeout para evitar ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(async () => {
      await this.spinnerService.showWhileLoading(
        this.fetchInitialData(),
        {
          message: 'Cargando Dr. Agro...',
          color: 'success',
          overlay: true
        }
      );
    }, 100);
  }

  // Método privado para simular carga de datos (2 segundos)
  private async fetchInitialData(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Vista welcome cargada');
  }

  private updateScreenWidth(): void {
    if (typeof window !== 'undefined') {
      this.screenWidth = window.innerWidth;
    }
  }

  // Determina cuántos elementos mostrar por slide según el ancho de pantalla
  getCurrentSlideSize(): number {
    if (this.screenWidth < 576) return 2;  // xs: 2 columnas
    if (this.screenWidth < 768) return 3;  // sm: 3 columnas  
    if (this.screenWidth < 992) return 4;  // md: 4 columnas
    if (this.screenWidth < 1200) return 5; // lg: 5 columnas
    return 6; // xl: 6 columnas
  }

  // Divide las enfermedades en chunks dinámicos
  getEnfermedadesChunks(): Enfermedad[][] {
    const chunkSize = this.getCurrentSlideSize();
    const chunks: Enfermedad[][] = [];
    
    for (let i = 0; i < this.enfermedades.length; i += chunkSize) {
      chunks.push(this.enfermedades.slice(i, i + chunkSize));
    }
    
    return chunks;
  }

  // Divide los cultivos en chunks dinámicos
  getCultivosChunks(): Cultivo[][] {
    const chunkSize = this.getCurrentSlideSize();
    const chunks: Cultivo[][] = [];
    
    for (let i = 0; i < this.cultivos.length; i += chunkSize) {
      chunks.push(this.cultivos.slice(i, i + chunkSize));
    }
    
    return chunks;
  }

  // TrackBy functions para optimizar performance
  trackByIndex(index: number): number {
    return index;
  }

  trackByEnfermedad(index: number, enfermedad: Enfermedad): string {
    return enfermedad.nombre;
  }

  trackByCultivo(index: number, cultivo: Cultivo): string {
    return cultivo.nombre;
  }

  // Métodos para manejar clicks en las tarjetas (sin spinners adicionales)
  onCultivoClick(cultivo: Cultivo): void {
    console.log('Cultivo seleccionado:', cultivo);
    // Implementar navegación específica para Capacitor
    // Ejemplo: this.router.navigate(['/cultivo', cultivo.nombre.toLowerCase()]);
  }

  onEnfermedadClick(enfermedad: Enfermedad): void {
    console.log('Enfermedad seleccionada:', enfermedad);
    // Implementar navegación específica para Capacitor
    // Ejemplo: this.router.navigate(['/enfermedad', enfermedad.nombre.toLowerCase()]);
  }

  // Método para obtener clase CSS según severidad
  getSeveridadClass(severidad: string): string {
    switch (severidad) {
      case 'alta':
        return 'text-danger fw-bold';
      case 'media':
        return 'text-warning fw-semibold';
      case 'baja':
        return 'text-success';
      default:
        return 'text-muted';
    }
  }

  // Método para obtener icono según tipo
  getTipoIcon(tipo: string): string {
    switch (tipo) {
      case 'plaga':
        return 'bi bi-bug-fill text-danger';
      case 'hongo':
        return 'bi bi-moisture text-info';
      case 'enfermedad':
        return 'bi bi-exclamation-triangle-fill text-warning';
      default:
        return 'bi bi-question-circle text-muted';
    }
  }

  // Método para manejar búsqueda (sin spinner)
  onSearchClick(): void {
    console.log('Búsqueda activada');
    // Implementar lógica de búsqueda para Capacitor
    // Podría abrir un modal o navegar a una página de búsqueda
  }

  // Método para manejar menú (sin spinner)
  onMenuClick(): void {
    console.log('Menú activado');
    // Implementar lógica del menú para Capacitor
    // Podría abrir un drawer/sidebar o menú contextual
  }

  // Cleanup para evitar memory leaks
  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', () => this.updateScreenWidth());
    }
  }
}