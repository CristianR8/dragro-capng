import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-access-email',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './access-email.html',
  styleUrls: ['./access-email.css']
})
export class AccessEmailComponent implements OnInit {

  // Datos del formulario
  email: string = '';
  termsAccepted: boolean = false;
  privacyAccepted: boolean = false;
  
  // Estados del componente
  isSubmitting: boolean = false;
  showErrors: boolean = false;
  
  // Errores de validación
  errors = {
    email: '',
    terms: '',
    privacy: ''
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.initializeComponent();
  }

  /**
   * Inicializa el componente
   */
  private initializeComponent(): void {
    console.log('AccessEmail component initialized for Capacitor');
  }

  /**
   * Valida el email en tiempo real
   */
  onEmailChange(): void {
    this.validateEmail();
    console.log('Email changed to:', this.email);
  }

  /**
   * Maneja cambios en checkbox de términos
   */
  onTermsChange(): void {
    this.validateTerms();
    console.log('Terms accepted:', this.termsAccepted);
  }

  /**
   * Maneja cambios en checkbox de privacidad
   */
  onPrivacyChange(): void {
    this.validatePrivacy();
    console.log('Privacy accepted:', this.privacyAccepted);
  }

  /**
   * Valida el campo email
   */
  private validateEmail(): void {
    this.errors.email = '';
    
    if (!this.email) {
      this.errors.email = 'El email es requerido';
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errors.email = 'Ingresa un email válido';
      return;
    }
  }

  /**
   * Valida términos de uso
   */
  private validateTerms(): void {
    this.errors.terms = '';
    
    if (!this.termsAccepted) {
      this.errors.terms = 'Debes aceptar los términos de uso';
    }
  }

  /**
   * Valida política de privacidad
   */
  private validatePrivacy(): void {
    this.errors.privacy = '';
    
    if (!this.privacyAccepted) {
      this.errors.privacy = 'Debes aceptar la política de privacidad';
    }
  }

  /**
   * Valida todo el formulario
   */
  private validateForm(): boolean {
    this.validateEmail();
    this.validateTerms();
    this.validatePrivacy();
    
    return !this.errors.email && !this.errors.terms && !this.errors.privacy;
  }

  /**
   * Verifica si el formulario es válido
   */
  get isFormValid(): boolean {
    return !!this.email && 
           this.email.includes('@') && 
           this.termsAccepted && 
           this.privacyAccepted;
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
        email: this.email,
        termsAccepted: this.termsAccepted,
        privacyAccepted: this.privacyAccepted
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
    }
  }

  /**
   * Procesa los datos del formulario
   */
  private async processFormData(data: any): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Processing form data:', data);
        resolve();
      }, 1000);
    });
  }

  /**
   * Maneja el éxito del envío
   */
  private handleSubmitSuccess(): void {
    console.log('Form submitted successfully');
    this.router.navigate(['/access-users']);
  }

  /**
   * Maneja errores en el envío
   */
  private handleSubmitError(error: any): void {
    console.error('Form submission error:', error);
  }

  /**
   * Limpia el formulario
   */
  clearForm(): void {
    this.email = '';
    this.termsAccepted = false;
    this.privacyAccepted = false;
    this.showErrors = false;
    this.errors = {
      email: '',
      terms: '',
      privacy: ''
    };
  }

  /**
   * Llena el formulario para testing
   */
  fillFormForTest(): void {
    this.email = 'test@example.com';
    this.termsAccepted = true;
    this.privacyAccepted = true;
    this.showErrors = false;
    
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
    console.log('=== FORM DEBUG ===');
    console.log('Email:', this.email);
    console.log('Terms accepted:', this.termsAccepted);
    console.log('Privacy accepted:', this.privacyAccepted);
    console.log('Is form valid:', this.isFormValid);
    console.log('Show errors:', this.showErrors);
    console.log('Errors:', this.errors);
  }
}