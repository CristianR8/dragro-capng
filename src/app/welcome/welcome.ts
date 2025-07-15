import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Cultivo {
  nombre: string;
  img: string;
  descripcion?: string;
  temporada?: string;
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
  imports: [CommonModule],
  templateUrl: './welcome.html',
  styleUrls: ['./welcome.css']
})
export class WelcomeComponent implements OnInit, AfterViewInit {
  
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
    }
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

  // Carousels divididos para móvil
  cultivosChunks: Cultivo[][] = [];
  enfermedadesChunks: Enfermedad[][] = [];

  ngOnInit(): void {
    this.initializeCarouselData();
  }

  ngAfterViewInit(): void {
    this.initializeBootstrapCarousels();
  }

  private initializeCarouselData(): void {
    // Dividir cultivos en grupos de 2 para móvil
    this.cultivosChunks = this.chunkArray(this.cultivos, 2);
    
    // Dividir enfermedades en grupos de 2 para móvil
    this.enfermedadesChunks = this.chunkArray(this.enfermedades, 2);
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  private initializeBootstrapCarousels(): void {
    // Inicializar carousels de Bootstrap si es necesario
    if (typeof window !== 'undefined') {
      // Verificar si Bootstrap está disponible
      const bootstrap = (window as any).bootstrap;
      if (bootstrap) {
        // Los carousels se inicializan automáticamente con data-bs-ride="carousel"
        console.log('Bootstrap carousels initialized');
      }
    }
  }

  // Métodos para manejar clicks en las tarjetas
  onCultivoClick(cultivo: Cultivo): void {
    console.log('Cultivo seleccionado:', cultivo);
    // Aquí puedes agregar la navegación a la página de detalle del cultivo
    // Por ejemplo: this.router.navigate(['/cultivo', cultivo.nombre.toLowerCase()]);
  }

  onEnfermedadClick(enfermedad: Enfermedad): void {
    console.log('Enfermedad seleccionada:', enfermedad);
    // Aquí puedes agregar la navegación a la página de detalle de la enfermedad
    // Por ejemplo: this.router.navigate(['/enfermedad', enfermedad.nombre.toLowerCase()]);
  }

  // Método para obtener clase CSS según severidad
  getSeveridadClass(severidad: string): string {
    switch (severidad) {
      case 'alta':
        return 'text-danger';
      case 'media':
        return 'text-warning';
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
        return 'bi-bug';
      case 'hongo':
        return 'bi-moisture';
      case 'enfermedad':
        return 'bi-exclamation-triangle';
      default:
        return 'bi-question-circle';
    }
  }

  // Método para manejar búsqueda
  onSearchClick(): void {
    console.log('Búsqueda activada');
    // Implementar lógica de búsqueda
  }

  // Método para manejar menú
  onMenuClick(): void {
    console.log('Menú activado');
    // Implementar lógica del menú lateral o navegación
  }
}