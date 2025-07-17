import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-access-places',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './access-place.html',
  styleUrls: ['./access-place.css']
})
export class AccessPlacesComponent implements OnInit {

  placesForm: FormGroup;
  isSubmitting = false;
  selectedDepartamento = '';
  availableCities: Array<{value: string, label: string}> = [];

  // Datos de departamentos y ciudades de Colombia
  private departamentosData = {
    santander: [
      { value: 'bucaramanga', label: 'Bucaramanga' },
      { value: 'floridablanca', label: 'Floridablanca' },
      { value: 'giron', label: 'Girón' },
      { value: 'piedecuesta', label: 'Piedecuesta' },
      { value: 'barrancabermeja', label: 'Barrancabermeja' },
      { value: 'san_gil', label: 'San Gil' },
      { value: 'socorro', label: 'Socorro' },
      { value: 'barbosa', label: 'Barbosa' },
      { value: 'malaga', label: 'Málaga' },
      { value: 'velez', label: 'Vélez' }
    ],
    antioquia: [
      { value: 'medellin', label: 'Medellín' },
      { value: 'bello', label: 'Bello' },
      { value: 'itagui', label: 'Itagüí' },
      { value: 'envigado', label: 'Envigado' },
      { value: 'sabaneta', label: 'Sabaneta' },
      { value: 'la_estrella', label: 'La Estrella' },
      { value: 'copacabana', label: 'Copacabana' },
      { value: 'caldas', label: 'Caldas' },
      { value: 'rionegro', label: 'Rionegro' },
      { value: 'apartado', label: 'Apartadó' }
    ],
    cundinamarca: [
      { value: 'bogota', label: 'Bogotá' },
      { value: 'soacha', label: 'Soacha' },
      { value: 'chia', label: 'Chía' },
      { value: 'zipaquira', label: 'Zipaquirá' },
      { value: 'facatativa', label: 'Facatativá' },
      { value: 'madrid', label: 'Madrid' },
      { value: 'mosquera', label: 'Mosquera' },
      { value: 'funza', label: 'Funza' },
      { value: 'cajica', label: 'Cajicá' },
      { value: 'fusagasuga', label: 'Fusagasugá' }
    ],
    valle: [
      { value: 'cali', label: 'Cali' },
      { value: 'palmira', label: 'Palmira' },
      { value: 'buenaventura', label: 'Buenaventura' },
      { value: 'tulua', label: 'Tuluá' },
      { value: 'cartago', label: 'Cartago' },
      { value: 'buga', label: 'Buga' },
      { value: 'jamundi', label: 'Jamundí' },
      { value: 'yumbo', label: 'Yumbo' },
      { value: 'candelaria', label: 'Candelaria' },
      { value: 'pradera', label: 'Pradera' }
    ],
    atlantico: [
      { value: 'barranquilla', label: 'Barranquilla' },
      { value: 'soledad', label: 'Soledad' },
      { value: 'malambo', label: 'Malambo' },
      { value: 'puerto_colombia', label: 'Puerto Colombia' },
      { value: 'galapa', label: 'Galapa' },
      { value: 'sabanagrande', label: 'Sabanagrande' },
      { value: 'santo_tomas', label: 'Santo Tomás' },
      { value: 'palmar_de_varela', label: 'Palmar de Varela' },
      { value: 'sabanalarga', label: 'Sabanalarga' },
      { value: 'ponedera', label: 'Ponedera' }
    ],
    otros: [
      { value: 'otra_ciudad', label: 'Otra ciudad' }
    ]
  };

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.placesForm = this.createForm();
  }

  ngOnInit(): void {
    this.initializeComponent();
    this.setDefaultValues();
  }

  /**
   * Crea el formulario reactivo con validaciones
   */
  private createForm(): FormGroup {
    return this.formBuilder.group({
      departamento: ['', [Validators.required]],
      ciudad: ['', [Validators.required]]
    });
  }

  /**
   * Inicializa el componente
   */
  private initializeComponent(): void {
    console.log('AccessPlaces component initialized for Capacitor');
    
    // Escuchar cambios en el formulario
    this.placesForm.valueChanges.subscribe(() => {
      console.log('Form status:', this.placesForm.status);
      console.log('Form valid:', this.placesForm.valid);
    });
  }

  /**
   * Establece valores por defecto
   */
  private setDefaultValues(): void {
    // Establecer Santander como departamento por defecto
    this.placesForm.patchValue({
      departamento: 'santander'
    });
    
    // Cargar ciudades de Santander
    this.selectedDepartamento = 'santander';
    this.loadCitiesForDepartamento('santander');
    
    // Establecer Bucaramanga como ciudad por defecto
    setTimeout(() => {
      this.placesForm.patchValue({
        ciudad: 'bucaramanga'
      });
    }, 100);
  }

  /**
   * Maneja el cambio de departamento
   */
  onDepartamentoChange(): void {
    const departamento = this.placesForm.get('departamento')?.value;
    
    if (departamento) {
      console.log('Departamento selected:', departamento);
      
      // Limpiar ciudad seleccionada
      this.placesForm.patchValue({
        ciudad: ''
      });
      
      // Cargar ciudades para el nuevo departamento
      this.loadCitiesForDepartamento(departamento);
      this.selectedDepartamento = departamento;
    } else {
      this.availableCities = [];
      this.selectedDepartamento = '';
    }
  }

  /**
   * Carga ciudades para el departamento seleccionado
   */
  private loadCitiesForDepartamento(departamento: string): void {
    const cities = this.departamentosData[departamento as keyof typeof this.departamentosData];
    
    if (cities) {
      this.availableCities = cities;
      console.log('Cities loaded for', departamento, ':', cities);
    } else {
      this.availableCities = [];
      console.log('No cities found for departamento:', departamento);
    }
  }

  /**
   * Maneja el cambio de ciudad
   */
  onCiudadChange(): void {
    const ciudad = this.placesForm.get('ciudad')?.value;
    console.log('Ciudad selected:', ciudad);
  }

  /**
   * Verifica si un campo es inválido y ha sido tocado
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.placesForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Maneja el envío del formulario
   */
  async onSubmit(): Promise<void> {
    if (this.placesForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      try {
        const formData = this.placesForm.value;
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
      }
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      this.markFormGroupTouched();
    }
  }

  /**
   * Procesa los datos del formulario
   */
  private async processFormData(data: any): Promise<void> {
    // Simular procesamiento
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Processing places data:', data);
        
        // Obtener nombres legibles
        const departamentoLabel = this.getDepartamentoLabel(data.departamento);
        const ciudadLabel = this.getCiudadLabel(data.ciudad);
        
        console.log('Processed data:', {
          departamento: data.departamento,
          departamentoLabel,
          ciudad: data.ciudad,
          ciudadLabel,
          timestamp: new Date().toISOString()
        });
        
        resolve();
      }, 1000);
    });
  }

  /**
   * Obtiene el label del departamento
   */
  private getDepartamentoLabel(departamentoValue: string): string {
    const departamentos = {
      santander: 'Santander',
      antioquia: 'Antioquia',
      cundinamarca: 'Cundinamarca',
      valle: 'Valle del Cauca',
      atlantico: 'Atlántico',
      otros: 'Otros'
    };
    
    return departamentos[departamentoValue as keyof typeof departamentos] || departamentoValue;
  }

  /**
   * Obtiene el label de la ciudad
   */
  private getCiudadLabel(ciudadValue: string): string {
    const ciudad = this.availableCities.find(c => c.value === ciudadValue);
    return ciudad?.label || ciudadValue;
  }

  /**
   * Maneja el éxito del envío
   */
  private handleSubmitSuccess(): void {
    console.log('Places form submitted successfully');
    
    // Aquí puedes agregar:
    // - Mostrar mensaje de éxito
    // - Navegar a la siguiente vista
    // - Guardar en localStorage/servicio
    
    // Ejemplo de navegación:
    // this.router.navigate(['/dashboard']);
    
    console.log('Registration process completed!');
  }

  /**
   * Maneja errores en el envío
   */
  private handleSubmitError(error: any): void {
    console.error('Places form submission error:', error);
    
    // Aquí puedes agregar:
    // - Mostrar mensaje de error
    // - Reintentar lógica
    // - Log de errores
  }

  /**
   * Marca todos los campos como tocados
   */
  private markFormGroupTouched(): void {
    Object.keys(this.placesForm.controls).forEach(key => {
      const control = this.placesForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
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
   * Getter para facilitar acceso a controles
   */
  get formControls() {
    return this.placesForm.controls;
  }

  /**
   * Verifica si se puede enviar el formulario
   */
  get canSubmit(): boolean {
    return this.placesForm.valid && !this.isSubmitting;
  }

  /**
   * Obtiene el departamento seleccionado
   */
  get selectedDepartamentoLabel(): string {
    const departamento = this.placesForm.get('departamento')?.value;
    return departamento ? this.getDepartamentoLabel(departamento) : '';
  }

  /**
   * Obtiene la ciudad seleccionada
   */
  get selectedCiudadLabel(): string {
    const ciudad = this.placesForm.get('ciudad')?.value;
    return ciudad ? this.getCiudadLabel(ciudad) : '';
  }
}