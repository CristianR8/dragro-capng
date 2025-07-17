import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-access-places',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './access-places.html',
  styleUrls: ['./access-places.css']
})
export class AccessPlacesComponent implements OnInit, OnDestroy {

  // Subject para cancelar subscripciones
  private destroy$ = new Subject<void>();
  
  // Flag para verificar si el componente está activo
  private isComponentActive = false;

  // Inyección de dependencias traditional para asegurar compatibilidad
  constructor(
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  // Datos del formulario
  departamento: string = '';
  ciudad: string = '';
  
  // Estados del componente
  isSubmitting: boolean = false;
  showErrors: boolean = false;
  isLoadingDepartamentos: boolean = false;
  isLoadingCiudades: boolean = false;
  
  // Datos de las APIs
  departamentos: Array<{id: string, nombre: string}> = [];
  ciudades: Array<{id: string, nombre: string, departamento_id: string}> = [];
  availableCities: Array<{id: string, nombre: string}> = [];
  
  // Errores de validación
  errors = {
    departamento: '',
    ciudad: ''
  };

  // URLs de las APIs
  private readonly API_BASE = 'https://62a10e5cf2bc.ngrok-free.app';
  private readonly API_DEPARTAMENTOS = `${this.API_BASE}/general/get_departamentos`;
  private readonly API_CIUDADES = `${this.API_BASE}/general/get_ciudades`;

  ngOnInit(): void {
    this.isComponentActive = true;
    
    // Verificar que HttpClient esté disponible
    console.log('AccessPlaces: ngOnInit called');
    console.log('HttpClient available:', !!this.http);
    console.log('Component active:', this.isComponentActive);
    
    // Inicializar inmediatamente sin setTimeout
    this.initializeComponent();
    
    // Cargar datos inmediatamente
    this.loadDepartamentos();
  }

  ngOnDestroy(): void {
    console.log('AccessPlaces component destroyed');
    
    // Marcar componente como inactivo
    this.isComponentActive = false;
    
    // Cancelar todas las subscripciones pendientes
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Inicializa el componente
   */
  private initializeComponent(): void {
    console.log('AccessPlaces component initialized for Capacitor');
    
    // Limpiar estado inicial
    this.clearFormData();
    
    // Forzar detección de cambios
    this.cdr.detectChanges();
  }

  /**
   * Limpia los datos del formulario
   */
  private clearFormData(): void {
    this.departamento = '';
    this.ciudad = '';
    this.availableCities = [];
    this.showErrors = false;
    this.errors = {
      departamento: '',
      ciudad: ''
    };
  }

  /**
   * Carga los departamentos desde la API
   */
  private async loadDepartamentos(): Promise<void> {
    this.isLoadingDepartamentos = true;
    
    // Definir headers fuera del try para que esté disponible en catch
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true'
    });
    
    try {
      // Probar con POST en lugar de GET
      const response = await this.http.post<any>(this.API_DEPARTAMENTOS, {}, { headers }).toPromise();
      
      console.log('Raw API response for departamentos:', response);
      
      if (response && response.code === 1 && response.data && Array.isArray(response.data)) {
        // Transformar la respuesta de la API al formato esperado
        this.departamentos = response.data.map((dept: any) => ({
          id: dept.id.toString(),     // Convertir number a string
          nombre: dept.name           // Usar 'name' de la API
        }));
        
        console.log('Departamentos transformed:', this.departamentos);
        
        // Forzar detección de cambios
        this.cdr.detectChanges();
      } else {
        console.error('Invalid response structure for departamentos:', response);
        throw new Error('Invalid API response structure');
      }
      
    } catch (error) {
      console.error('Error loading departamentos with POST:', error);
      
      // Si POST falla, intentar con GET
      console.log('POST failed, trying GET...');
      try {
        const getResponse = await this.http.get<any>(this.API_DEPARTAMENTOS, { headers }).toPromise();
        
        console.log('Raw GET response for departamentos:', getResponse);
        
        if (getResponse && getResponse.code === 1 && getResponse.data && Array.isArray(getResponse.data)) {
          // Transformar la respuesta de la API al formato esperado
          this.departamentos = getResponse.data.map((dept: any) => ({
            id: dept.id.toString(),     // Convertir number a string
            nombre: dept.name           // Usar 'name' de la API
          }));
          
          console.log('Departamentos transformed with GET:', this.departamentos);
          
          // Forzar detección de cambios
          this.cdr.detectChanges();
        } else {
          throw new Error('GET also failed - invalid response structure');
        }
      } catch (getError) {
        console.error('Both POST and GET failed:', getError);
        this.handleApiError('Error al cargar departamentos');
        this.loadFallbackDepartamentos();
      }
    } finally {
      this.isLoadingDepartamentos = false;
      this.cdr.detectChanges();
    }
  }

  /**
   * Carga las ciudades desde la API
   */
  private async loadCiudades(): Promise<void> {
    this.isLoadingCiudades = true;
    
    // Definir headers fuera del try para que esté disponible en catch
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true'
    });
    
    try {
      // Probar con POST en lugar de GET
      const response = await this.http.post<any>(this.API_CIUDADES, {}, { headers }).toPromise();
      
      console.log('Raw API response for ciudades:', response);
      
      if (response && response.code === 1 && response.data && Array.isArray(response.data)) {
        // Transformar la respuesta de la API al formato esperado
        this.ciudades = response.data.map((city: any) => ({
          id: city.id.toString(),                           // Convertir number a string
          nombre: city.name,                                // Usar 'name' de la API
          departamento_id: city.departmentId.toString()     // Convertir departmentId a string
        }));
        
        console.log('Ciudades transformed:', this.ciudades);
        
        // Filtrar ciudades para el departamento seleccionado
        this.filterCitiesForDepartamento();
        
        // Forzar detección de cambios
        this.cdr.detectChanges();
      } else {
        console.error('Invalid response structure for ciudades:', response);
        throw new Error('Invalid API response structure');
      }
      
    } catch (error) {
      console.error('Error loading ciudades with POST:', error);
      
      // Si POST falla, intentar con GET
      console.log('POST failed, trying GET...');
      try {
        const getResponse = await this.http.get<any>(this.API_CIUDADES, { headers }).toPromise();
        
        console.log('Raw GET response for ciudades:', getResponse);
        
        if (getResponse && getResponse.code === 1 && getResponse.data && Array.isArray(getResponse.data)) {
          // Transformar la respuesta de la API al formato esperado
          this.ciudades = getResponse.data.map((city: any) => ({
            id: city.id.toString(),                           // Convertir number a string
            nombre: city.name,                                // Usar 'name' de la API
            departamento_id: city.departmentId.toString()     // Convertir departmentId a string
          }));
          
          console.log('Ciudades transformed with GET:', this.ciudades);
          
          // Filtrar ciudades para el departamento seleccionado
          this.filterCitiesForDepartamento();
          
          // Forzar detección de cambios
          this.cdr.detectChanges();
        } else {
          throw new Error('GET also failed - invalid response structure');
        }
      } catch (getError) {
        console.error('Both POST and GET failed:', getError);
        this.handleApiError('Error al cargar ciudades');
        this.loadFallbackCiudades();
      }
    } finally {
      this.isLoadingCiudades = false;
      this.cdr.detectChanges();
    }
  }

  /**
   * Filtra las ciudades para el departamento seleccionado
   */
  private filterCitiesForDepartamento(): void {
    if (this.departamento && this.ciudades.length > 0) {
      this.availableCities = this.ciudades.filter(ciudad => 
        ciudad.departamento_id === this.departamento
      );
      console.log('Filtered cities for', this.departamento, ':', this.availableCities);
    } else {
      this.availableCities = [];
    }
  }

  /**
   * Maneja errores de la API
   */
  private handleApiError(message: string): void {
    console.error('API Error:', message);
    // Aquí podrías mostrar un toast o notificación al usuario
  }

  /**
   * Carga departamentos de respaldo si falla la API
   */
  private loadFallbackDepartamentos(): void {
    this.departamentos = [
      { id: '28', nombre: 'Santander' },
      { id: '5', nombre: 'Antioquia' },
      { id: '11', nombre: 'Cundinamarca' },
      { id: '30', nombre: 'Valle del Cauca' },
      { id: '4', nombre: 'Atlántico' },
      { id: '8', nombre: 'Bolívar' },
      { id: '9', nombre: 'Caldas' },
      { id: '10', nombre: 'Cauca' },
      { id: '12', nombre: 'Cesar' },
      { id: '13', nombre: 'Córdoba' },
      { id: '16', nombre: 'Huila' },
      { id: '18', nombre: 'Magdalena' },
      { id: '19', nombre: 'Meta' },
      { id: '20', nombre: 'Nariño' },
      { id: '21', nombre: 'Norte de Santander' },
      { id: '24', nombre: 'Quindío' },
      { id: '26', nombre: 'Risaralda' },
      { id: '29', nombre: 'Sucre' },
      { id: '31', nombre: 'Tolima' }
    ];
    
    console.log('Fallback departamentos loaded');
    
    // Forzar detección de cambios
    this.cdr.detectChanges();
  }

  /**
   * Carga ciudades de respaldo si falla la API
   */
  private loadFallbackCiudades(): void {
    this.ciudades = [
      // Santander (id: 28)
      { id: '915', nombre: 'Bucaramanga', departamento_id: '28' },
      { id: '916', nombre: 'Floridablanca', departamento_id: '28' },
      { id: '917', nombre: 'Girón', departamento_id: '28' },
      { id: '918', nombre: 'Piedecuesta', departamento_id: '28' },
      { id: '919', nombre: 'Barrancabermeja', departamento_id: '28' },
      
      // Antioquia (id: 5)
      { id: '76', nombre: 'Medellín', departamento_id: '5' },
      { id: '77', nombre: 'Bello', departamento_id: '5' },
      { id: '78', nombre: 'Itagüí', departamento_id: '5' },
      { id: '79', nombre: 'Envigado', departamento_id: '5' },
      { id: '80', nombre: 'Sabaneta', departamento_id: '5' },
      
      // Cundinamarca (id: 11)
      { id: '149', nombre: 'Bogotá', departamento_id: '11' },
      { id: '150', nombre: 'Soacha', departamento_id: '11' },
      { id: '151', nombre: 'Chía', departamento_id: '11' },
      { id: '152', nombre: 'Zipaquirá', departamento_id: '11' },
      { id: '153', nombre: 'Facatativá', departamento_id: '11' },
      
      // Valle del Cauca (id: 30)
      { id: '1129', nombre: 'Cali', departamento_id: '30' },
      { id: '1130', nombre: 'Palmira', departamento_id: '30' },
      { id: '1131', nombre: 'Buenaventura', departamento_id: '30' },
      { id: '1132', nombre: 'Tuluá', departamento_id: '30' },
      { id: '1133', nombre: 'Cartago', departamento_id: '30' },
      
      // Atlántico (id: 4)
      { id: '51', nombre: 'Barranquilla', departamento_id: '4' },
      { id: '52', nombre: 'Soledad', departamento_id: '4' },
      { id: '53', nombre: 'Malambo', departamento_id: '4' },
      { id: '54', nombre: 'Puerto Colombia', departamento_id: '4' },
      { id: '55', nombre: 'Galapa', departamento_id: '4' }
    ];
    
    this.filterCitiesForDepartamento();
    console.log('Fallback ciudades loaded');
    
    // Forzar detección de cambios
    this.cdr.detectChanges();
  }

  /**
   * Maneja el cambio de departamento
   */
  onDepartamentoChange(): void {
    console.log('Departamento changed to:', this.departamento);
    
    // Limpiar ciudad seleccionada
    this.ciudad = '';
    
    // Validar departamento
    this.validateDepartamento();
    
    // Cargar ciudades si aún no están cargadas
    if (this.ciudades.length === 0) {
      this.loadCiudades();
    } else {
      this.filterCitiesForDepartamento();
    }
    
    // Forzar múltiples detecciones de cambios
    this.cdr.detectChanges();
    
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 50);
    
    setTimeout(() => {
      this.cdr.markForCheck();
    }, 100);
  }

  /**
   * Maneja el cambio de ciudad
   */
  onCiudadChange(): void {
    console.log('Ciudad changed to:', this.ciudad);
    this.validateCiudad();
    
    // Forzar detección de cambios
    this.cdr.detectChanges();
    
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 50);
  }

  /**
   * Valida el campo departamento
   */
  private validateDepartamento(): void {
    this.errors.departamento = '';
    
    if (!this.departamento) {
      this.errors.departamento = 'El departamento es requerido';
      return;
    }
  }

  /**
   * Valida el campo ciudad
   */
  private validateCiudad(): void {
    this.errors.ciudad = '';
    
    if (!this.ciudad) {
      this.errors.ciudad = 'La ciudad es requerida';
      return;
    }
  }

  /**
   * Valida todo el formulario
   */
  private validateForm(): boolean {
    this.validateDepartamento();
    this.validateCiudad();
    
    return !this.errors.departamento && !this.errors.ciudad;
  }

  /**
   * Verifica si el formulario es válido
   */
  get isFormValid(): boolean {
    return !!this.departamento && !!this.ciudad;
  }

  /**
   * Verifica si un campo tiene error
   */
  hasError(field: string): boolean {
    return this.showErrors && !!this.errors[field as keyof typeof this.errors];
  }

  /**
   * Obtiene el error de un campo
   */
  getError(field: string): string {
    return this.errors[field as keyof typeof this.errors];
  }

  /**
   * Obtiene el nombre del departamento seleccionado
   */
  get selectedDepartamentoName(): string {
    const dept = this.departamentos.find(d => d.id === this.departamento);
    return dept?.nombre || '';
  }

  /**
   * Obtiene el nombre de la ciudad seleccionada
   */
  get selectedCiudadName(): string {
    const ciudad = this.availableCities.find(c => c.id === this.ciudad);
    return ciudad?.nombre || '';
  }

  /**
   * Maneja el envío del formulario
   */
  async onSubmit(): Promise<void> {
    this.showErrors = true;
    
    if (!this.validateForm() || this.isSubmitting) {
      console.log('Form is invalid, cannot submit');
      return;
    }

    this.isSubmitting = true;
    
    try {
      const formData = {
        departamento: this.departamento,
        departamentoName: this.selectedDepartamentoName,
        ciudad: this.ciudad,
        ciudadName: this.selectedCiudadName
      };
      
      console.log('Form data:', formData);
      
      // Procesar datos del formulario
      await this.processFormData(formData);
      
      // Manejar éxito
      this.handleSubmitSuccess();
      
    } catch (error) {
      console.error('Error submitting form:', error);
      this.handleSubmitError(error);
    } finally {
      this.isSubmitting = false;
      this.cdr.detectChanges();
    }
  }

  /**
   * Procesa los datos del formulario
   */
  private async processFormData(data: any): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Processing places data:', data);
        resolve();
      }, 1000);
    });
  }

  /**
   * Maneja el éxito del envío
   */
  private handleSubmitSuccess(): void {
    console.log('Places form submitted successfully');
    console.log('Registration process completed!');
    
    // Aquí podrías navegar a una página de éxito o dashboard
    // this.router.navigate(['/success']);
  }

  /**
   * Maneja errores en el envío
   */
  private handleSubmitError(error: any): void {
    console.error('Places form submission error:', error);
  }

  /**
   * Limpia el formulario
   */
  clearForm(): void {
    this.clearFormData();
    this.cdr.detectChanges();
  }

  /**
   * Llena el formulario para testing
   */
  fillFormForTest(): void {
    // Asegurar que tengamos departamentos cargados
    if (this.departamentos.length === 0) {
      this.loadFallbackDepartamentos();
    }
    
    if (this.departamentos.length > 0) {
      // Seleccionar Santander por defecto (id: 28)
      const santander = this.departamentos.find(d => d.nombre === 'Santander');
      this.departamento = santander ? santander.id : this.departamentos[0].id;
      
      // Forzar detección de cambios
      this.cdr.detectChanges();
      
      // Disparar el evento de cambio de departamento
      this.onDepartamentoChange();
      
      // Esperar un poco y luego seleccionar una ciudad
      setTimeout(() => {
        if (this.availableCities.length > 0) {
          // Seleccionar Bucaramanga por defecto
          const bucaramanga = this.availableCities.find(c => c.nombre === 'Bucaramanga');
          this.ciudad = bucaramanga ? bucaramanga.id : this.availableCities[0].id;
          
          // Forzar detección de cambios
          this.cdr.detectChanges();
          
          // Disparar el evento de cambio de ciudad
          this.onCiudadChange();
        }
      }, 200);
    }
    
    console.log('Form filled for test');
  }

  /**
   * Maneja el toggle del menú
   */
  toggleMenu(): void {
    console.log('Toggle menu clicked');
  }

  /**
   * Maneja la búsqueda
   */
  openSearch(): void {
    console.log('Search button clicked');
  }

  /**
   * Debug del estado del formulario
   */
  debugFormStatus(): void {
    console.log('=== PLACES FORM DEBUG ===');
    console.log('Departamento:', this.departamento);
    console.log('Ciudad:', this.ciudad);
    console.log('Is form valid:', this.isFormValid);
    console.log('Show errors:', this.showErrors);
    console.log('Errors:', this.errors);
    console.log('Available cities:', this.availableCities);
    console.log('All departamentos:', this.departamentos);
    console.log('All ciudades:', this.ciudades);
    console.log('Loading states:', {
      departamentos: this.isLoadingDepartamentos,
      ciudades: this.isLoadingCiudades,
      submitting: this.isSubmitting
    });
    console.log('Selected names:', {
      departamento: this.selectedDepartamentoName,
      ciudad: this.selectedCiudadName
    });
    
    // Forzar detección de cambios para debug
    this.cdr.detectChanges();
  }

  /**
   * Recarga los datos desde las APIs
   */
  reloadData(): void {
    console.log('Reloading data...');
    
    // Limpiar datos actuales
    this.departamentos = [];
    this.ciudades = [];
    this.availableCities = [];
    this.departamento = '';
    this.ciudad = '';
    
    // Forzar detección de cambios
    this.cdr.detectChanges();
    
    // Recargar departamentos
    this.loadDepartamentos();
    
    console.log('Data reload initiated');
  }
}