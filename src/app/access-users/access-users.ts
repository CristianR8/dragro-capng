import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-access-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './access-users.html',
  styleUrls: ['./access-users.css']
})
export class AccessUsersComponent implements OnInit, OnDestroy {

  selectedUserType: string | null = null;
  isProcessing = false;

  // Definir los tipos de usuario disponibles
  userTypes = [
    { id: 'asistente', label: 'Asistente Técnico', icon: 'asistente-icon.png' },
    { id: 'productor', label: 'Productor', icon: 'productor-icon.png' },
    { id: 'estudiante', label: 'Estudiante', icon: 'estudiante-icon.png' },
    { id: 'docente', label: 'Docente', icon: 'docente-icon.png' },
    { id: 'investigador', label: 'Investigador', icon: 'investigador-icon.png' },
    { id: 'publico', label: 'Público General', icon: 'publico-icon.png' }
  ];

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initializeComponent();
    
    // Agregar listener para cuando la vista se vuelve visible
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        setTimeout(() => {
          this.cdr.detectChanges();
        }, 100);
      }
    });
  }

  ngOnDestroy(): void {
    // Limpiar estado cuando el componente se destruye
    this.selectedUserType = null;
    this.isProcessing = false;
    
    // Limpiar listeners
    document.removeEventListener('visibilitychange', () => {});
    
    console.log('AccessUsers component destroyed');
  }

  /**
   * Inicializa el componente
   */
  private initializeComponent(): void {
    console.log('AccessUsers component initialized for Capacitor');
    
    // Recuperar selección previa si existe
    this.loadPreviousSelection();
    
    // Forzar detección de cambios después de la inicialización
    this.forceChangeDetection();
  }

  /**
   * Fuerza la detección de cambios múltiples veces para asegurar que funcione
   */
  private forceChangeDetection(): void {
    // Múltiples intentos de detección de cambios
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 50);
    
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 100);
    
    setTimeout(() => {
      this.cdr.markForCheck();
    }, 150);
  }

  /**
   * Carga la selección previa del localStorage (si existe)
   */
  private loadPreviousSelection(): void {
    // Limpiar selección previa al entrar a la vista
    this.selectedUserType = null;
    this.isProcessing = false;
    
    // En un entorno real, podrías cargar desde un servicio
    console.log('Loading previous user selection...');
    console.log('Selection cleared for fresh start');
    
    // Asegurar que la vista se actualice
    setTimeout(() => {
      this.cdr.markForCheck();
    }, 50);
  }

  /**
   * Selecciona un tipo de usuario
   */
  selectUserType(userType: string): void {
    console.log('Selected user type:', userType);
    
    // Cambiar la selección
    this.selectedUserType = userType;
    
    // Forzar detección de cambios inmediatamente
    this.cdr.detectChanges();
    
    // Opcional: Feedback visual o sonoro
    this.provideFeedback(userType);
  }

  /**
   * Proporciona feedback visual/sonoro al seleccionar
   */
  private provideFeedback(userType: string): void {
    const selectedType = this.userTypes.find(type => type.id === userType);
    if (selectedType) {
      console.log(`Usuario seleccionado: ${selectedType.label}`);
      
      // Aquí podrías agregar vibración en móviles:
      // if (navigator.vibrate) navigator.vibrate(50);
      
      // Asegurar que la UI se actualice
      setTimeout(() => {
        this.cdr.markForCheck();
      }, 10);
    }
  }

  /**
   * Continúa al siguiente paso
   */
  async continueToNextStep(): Promise<void> {
    if (!this.selectedUserType || this.isProcessing) {
      return;
    }

    this.isProcessing = true;
    
    // Forzar detección de cambios para mostrar el estado de carga
    this.cdr.detectChanges();

    try {
      // Guardar la selección
      await this.saveUserSelection();
      
      // Navegar al siguiente paso
      this.navigateToNextStep();
      
    } catch (error) {
      console.error('Error continuing to next step:', error);
      this.handleError(error);
    } finally {
      this.isProcessing = false;
      this.cdr.detectChanges();
    }
  }

  /**
   * Guarda la selección del usuario
   */
  private async saveUserSelection(): Promise<void> {
    const selectedType = this.userTypes.find(type => type.id === this.selectedUserType);
    
    if (selectedType) {
      // Simular guardado (en un caso real, sería una llamada a un servicio)
      console.log('Saving user selection:', {
        userType: this.selectedUserType,
        userLabel: selectedType.label,
        timestamp: new Date().toISOString()
      });
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  /**
   * Navega al siguiente paso
   */
  private navigateToNextStep(): void {
    console.log('Navigating to access-places...');
    this.router.navigate(['/access-places']);
  }

  /**
   * Maneja errores en el proceso
   */
  private handleError(error: any): void {
    console.error('Error in user selection process:', error);
    // Aquí podrías mostrar un toast o modal de error
    // Por ejemplo: this.showErrorMessage('Error al continuar. Intenta nuevamente.');
  }

  /**
   * Maneja el toggle del menú lateral
   */
  toggleMenu(): void {
    console.log('Toggle menu clicked');
    // Aquí puedes agregar la lógica para abrir/cerrar el menú lateral
  }

  /**
   * Maneja la acción de búsqueda
   */
  openSearch(): void {
    console.log('Search button clicked');
    // Aquí puedes agregar la lógica para abrir la búsqueda
  }

  /**
   * Verifica si se puede continuar
   */
  get canContinue(): boolean {
    return !!this.selectedUserType && !this.isProcessing;
  }

  /**
   * Obtiene el tipo de usuario seleccionado
   */
  get selectedUserTypeLabel(): string {
    if (!this.selectedUserType) return '';
    
    const selectedType = this.userTypes.find(type => type.id === this.selectedUserType);
    return selectedType?.label || '';
  }

  /**
   * Limpia la selección
   */
  clearSelection(): void {
    this.selectedUserType = null;
    this.cdr.detectChanges();
    console.log('Selection cleared');
  }

  /**
   * Obtiene información del tipo de usuario seleccionado
   */
  getSelectedUserInfo(): any {
    if (!this.selectedUserType) return null;
    
    return this.userTypes.find(type => type.id === this.selectedUserType);
  }

  /**
   * Verifica si un tipo de usuario está seleccionado
   */
  isSelected(userType: string): boolean {
    const result = this.selectedUserType === userType;
    console.log(`Checking if ${userType} is selected:`, result);
    return result;
  }

  /**
   * Maneja el clic en el botón de continuar
   */
  onContinueClick(): void {
    if (this.canContinue) {
      console.log('Continue button clicked, selected type:', this.selectedUserType);
      this.continueToNextStep();
    } else {
      console.log('Cannot continue, no user type selected');
    }
  }

  /**
   * Debug: Muestra información del componente
   */
  debugComponent(): void {
    console.log('=== ACCESS USERS DEBUG ===');
    console.log('Selected user type:', this.selectedUserType);
    console.log('Selected user label:', this.selectedUserTypeLabel);
    console.log('Can continue:', this.canContinue);
    console.log('Is processing:', this.isProcessing);
    console.log('Available user types:', this.userTypes);
  }
}