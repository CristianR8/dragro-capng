import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-access-places',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, NgSelectModule],
  templateUrl: './access-places.html',
  styleUrls: ['./access-places.css']
})
export class AccessPlacesComponent implements OnInit, OnDestroy {
  
  // Flag para verificar si el componente está activo
  private isComponentActive = false;

  // Inyección de dependencias
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
    console.log('AccessPlaces: ngOnInit called');
    
    // Inicializar componente
    this.initializeComponent();
    
    // Cargar departamentos y ciudades al inicio
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    console.log('AccessPlaces component destroyed');
    this.isComponentActive = false;
  }

  /**
   * Inicializa el componente
   */
  private initializeComponent(): void {
    console.log('AccessPlaces component initialized');
    this.clearFormData();
    this.cdr.detectChanges();
  }

  /**
   * Carga los datos iniciales (solo departamentos)
   */
  private async loadInitialData(): Promise<void> {
    try {
      // Solo cargar departamentos al inicio
      // Las ciudades se cargarán cuando se seleccione un departamento
      await this.loadDepartamentos();
      
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
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
    if (this.isLoadingDepartamentos) {
      return; // Evitar carga múltiple
    }

    this.isLoadingDepartamentos = true;
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true'
    });
    
    try {
      // Intentar con POST primero
      const response = await this.http.post<any>(this.API_DEPARTAMENTOS, {}, { headers }).toPromise();
      
      console.log('Raw API response for departamentos:', response);
      
      if (response && response.code === 1 && response.data && Array.isArray(response.data)) {
        // Asegurar que todos los IDs sean strings
        this.departamentos = response.data.map((dept: any) => ({
          id: dept.id ? dept.id.toString() : '',
          nombre: dept.nombre || dept.name || ''
        }));
        
        console.log('Departamentos loaded and processed:', this.departamentos);
        this.cdr.detectChanges();
      } else {
        console.error('Invalid response structure for departamentos:', response);
        throw new Error('Invalid API response structure');
      }
      
    } catch (error) {
      console.error('Error loading departamentos with POST:', error);
      
      // Si POST falla, intentar con GET
      try {
        const getResponse = await this.http.get<any>(this.API_DEPARTAMENTOS, { headers }).toPromise();
        
        if (getResponse && getResponse.code === 1 && getResponse.data && Array.isArray(getResponse.data)) {
          this.departamentos = getResponse.data.map((dept: any) => ({
            id: dept.id ? dept.id.toString() : '',
            nombre: dept.nombre || dept.name || ''
          }));
          console.log('Departamentos loaded with GET:', this.departamentos);
          this.cdr.detectChanges();
        } else {
          throw new Error('GET also failed - invalid response structure');
        }
      } catch (getError) {
        console.error('Both POST and GET failed for departamentos:', getError);
        this.handleApiError('Error cargando departamentos', 'departamentos');
      }
    } finally {
      this.isLoadingDepartamentos = false;
      this.cdr.detectChanges();
    }
  }

  /**
   * Carga las ciudades desde la API para un departamento específico
   */
  private async loadCiudades(departamentoId?: string): Promise<void> {
    if (this.isLoadingCiudades) {
      return;
    }

    const deptId = departamentoId || this.departamento;
    if (!deptId) {
      console.log('No departamento provided, skipping ciudades load');
      return;
    }

    this.isLoadingCiudades = true;
    console.log('=== STARTING CIUDADES LOAD ===');
    console.log('Loading cities for departamento:', deptId);
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true'
    });
    
    // Intentar múltiples formatos de payload
    const payloads = [
      { departamento_id: parseInt(deptId) },
      { departmentId: parseInt(deptId) },
      { id: parseInt(deptId) },
      { dept_id: parseInt(deptId) },
      { departamento: parseInt(deptId) }
    ];
    
    try {
      // Probar cada payload
      for (let i = 0; i < payloads.length; i++) {
        const payload = payloads[i];
        console.log(`Trying payload ${i + 1}:`, payload);
        
        try {
          const response = await this.http.post<any>(this.API_CIUDADES, payload, { headers }).toPromise();
          console.log('Success with payload:', payload);
          console.log('Raw API response for ciudades:', response);
          
          if (response && response.code === 1 && response.data && Array.isArray(response.data)) {
            const ciudadesFromApi = response.data.map((city: any) => ({
              id: city.id ? city.id.toString() : '',
              nombre: city.name || city.nombre || '',
              departamento_id: city.departmentId ? city.departmentId.toString() : 
                             (city.departamento_id ? city.departamento_id.toString() : deptId)
            }));
            
            console.log('Ciudades loaded and processed:', ciudadesFromApi);
            this.availableCities = ciudadesFromApi;
            
            // Actualizar cache
            if (this.ciudades.length === 0) {
              this.ciudades = ciudadesFromApi;
            } else {
              this.ciudades = this.ciudades.filter(c => c.departamento_id !== deptId);
              this.ciudades.push(...ciudadesFromApi);
            }
            
            this.cdr.detectChanges();
            return; // Éxito, salir del método
          } else {
            console.log('Invalid response structure, trying next payload...');
          }
        } catch (payloadError: any) {
          console.log(`Payload ${i + 1} failed:`, payloadError.status, payloadError.statusText);
          if (payloadError.status === 422 || payloadError.status === 400) {
            continue; // Probar siguiente payload
          } else {
            throw payloadError; // Otro tipo de error, fallar inmediatamente
          }
        }
      }
      
      // Si llegamos aquí, todos los payloads fallaron
      throw new Error('All POST payloads failed');
      
    } catch (error: any) {
      console.error('All POST attempts failed:', error);
      
      // Intentar con GET y diferentes formatos de parámetros
      const getUrls = [
        `${this.API_CIUDADES}?departamento_id=${deptId}`,
        `${this.API_CIUDADES}?departmentId=${deptId}`,
        `${this.API_CIUDADES}?id=${deptId}`,
        `${this.API_CIUDADES}?dept_id=${deptId}`,
        `${this.API_CIUDADES}?departamento=${deptId}`,
        `${this.API_CIUDADES}/${deptId}`,
        this.API_CIUDADES // Sin parámetros
      ];
      
      for (let i = 0; i < getUrls.length; i++) {
        const url = getUrls[i];
        console.log(`Trying GET ${i + 1}:`, url);
        
        try {
          const getResponse = await this.http.get<any>(url, { headers }).toPromise();
          console.log('Success with GET URL:', url);
          console.log('GET response:', getResponse);
          
          if (getResponse && getResponse.code === 1 && getResponse.data && Array.isArray(getResponse.data)) {
            let ciudadesFromApi = getResponse.data.map((city: any) => ({
              id: city.id ? city.id.toString() : '',
              nombre: city.name || city.nombre || '',
              departamento_id: city.departmentId ? city.departmentId.toString() : 
                             (city.departamento_id ? city.departamento_id.toString() : deptId)
            }));
            
            console.log('Ciudades loaded with GET:', ciudadesFromApi);
            this.availableCities = ciudadesFromApi;
            
            if (this.ciudades.length === 0) {
              this.ciudades = ciudadesFromApi;
            } else {
              this.ciudades = this.ciudades.filter(c => c.departamento_id !== deptId);
              this.ciudades.push(...ciudadesFromApi);
            }
            
            this.cdr.detectChanges();
            return; // Éxito
          }
        } catch (getError: any) {
          console.log(`GET ${i + 1} failed:`, getError.status, getError.statusText);
          continue;
        }
      }
      
      // Si llegamos aquí, todo falló
      console.error('All attempts to load cities failed');
      this.handleApiError('No se pudieron cargar las ciudades', 'ciudades');
      this.availableCities = [];
      
    } finally {
      this.isLoadingCiudades = false;
      console.log('=== CIUDADES LOAD FINISHED ===');
      this.cdr.detectChanges();
    }
  }

  /**
   * Filtra las ciudades para el departamento seleccionado
   * (Este método se mantiene para compatibilidad, pero ahora las ciudades 
   * vienen pre-filtradas de la API)
   */
  private filterCitiesForDepartamento(): void {
    console.log('Filtering cities for departamento:', this.departamento);
    console.log('Available cities before filter:', this.ciudades.length);
    
    if (this.departamento && this.ciudades.length > 0) {
      // Asegurar comparación de strings
      const departamentoId = this.departamento.toString();
      
      this.availableCities = this.ciudades.filter(ciudad => {
        const ciudadDeptId = ciudad.departamento_id ? ciudad.departamento_id.toString() : '';
        const match = ciudadDeptId === departamentoId;
        
        if (match) {
          console.log(`Ciudad ${ciudad.nombre} matches departamento ${departamentoId}`);
        }
        
        return match;
      });
      
      console.log('Filtered cities for departamento', departamentoId, ':', this.availableCities);
      
      // Si no hay ciudades disponibles, mostrar información de debug
      if (this.availableCities.length === 0) {
        console.warn('No cities found for departamento:', departamentoId);
        console.log('Available departamento IDs in cities:', 
          [...new Set(this.ciudades.map(c => c.departamento_id))]);
      }
      
    } else {
      this.availableCities = [];
      console.log('No departamento selected or no cities loaded');
    }
    
    // Si había una ciudad seleccionada pero ya no está disponible, limpiarla
    if (this.ciudad && !this.availableCities.find(c => c.id === this.ciudad)) {
      console.log('Clearing selected city as it is no longer available');
      this.ciudad = '';
    }
  }

  /**
   * Maneja errores de la API
   */
  private handleApiError(message: string, type: 'departamentos' | 'ciudades'): void {
    console.error('API Error:', message, 'Type:', type);
    
    // Aquí podrías mostrar un toast o notificación al usuario
    // Por ejemplo, puedes usar una librería de notificaciones o mostrar un alert
    
    this.cdr.detectChanges();
  }

  /**
   * Maneja el cambio de departamento
   */
  onDepartamentoChange(): void {
    console.log('Departamento changed to:', this.departamento);
    
    // Limpiar ciudad seleccionada
    this.ciudad = '';
    this.availableCities = [];
    
    // Validar departamento
    this.validateDepartamento();
    
    // Cargar ciudades para el departamento seleccionado
    if (this.departamento) {
      this.loadCiudades(this.departamento);
    }
    
    this.cdr.detectChanges();
  }

  /**
   * Maneja el cambio de ciudad
   */
  onCiudadChange(): void {
    console.log('Ciudad changed to:', this.ciudad);
    this.validateCiudad();
    this.cdr.detectChanges();
  }

  /**
   * Obtiene el placeholder para el campo ciudad
   */
  getPlaceholderCiudad(): string {
    if (this.isLoadingCiudades) {
      return 'Cargando ciudades...';
    }
    if (!this.departamento) {
      return 'Selecciona primero un departamento';
    }
    if (this.availableCities.length === 0) {
      return 'No hay ciudades disponibles';
    }
    return 'Selecciona una ciudad';
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
   * Limpia el formulario
   */
  clearForm(): void {
    this.clearFormData();
    this.cdr.detectChanges();
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
    
    // Debug específico para el filtrado
    if (this.departamento) {
      console.log('Cities for selected departamento:');
      const filtered = this.ciudades.filter(ciudad => 
        ciudad.departamento_id === this.departamento
      );
      console.log(filtered);
    }
    
    this.cdr.detectChanges();
  }

  /**
   * Debug específico para ciudades - usar cuando no carguen las ciudades
   */
  debugCiudades(): void {
    console.log('=== CIUDADES DEBUG ===');
    console.log('Current departamento:', this.departamento);
    console.log('Is loading ciudades:', this.isLoadingCiudades);
    console.log('Available cities:', this.availableCities);
    console.log('All cities in cache:', this.ciudades);
    console.log('API URL:', this.API_CIUDADES);
    
    // Forzar recarga de ciudades si hay un departamento seleccionado
    if (this.departamento && !this.isLoadingCiudades) {
      console.log('Forcing reload of ciudades...');
      this.loadCiudades(this.departamento);
    } else if (!this.departamento) {
      console.log('No departamento selected - select one first');
    }
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
    
    this.cdr.detectChanges();
    
    // Recargar solo departamentos (las ciudades se cargarán al seleccionar departamento)
    this.loadDepartamentos();
    
    console.log('Data reload initiated');
  }
}