import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { SqliteService } from './services/sqlite.service';

// Importar ng-Bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


interface Departamento {
  id: number;
  name: string;
  description: string;
}

interface Municipio {
  id: number;
  name: string;
  description: string;
  departmentId: number;
}

interface Usuario {
  id?: number;
  perfil: string;
  departamento: string;
  departamentoId: number;
  municipio: string;
  municipioId: number;
  correo: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    HttpClientModule, 
    RouterOutlet,
    NgbModule,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  perfilSeleccionado = '';
  usuario: Partial<Usuario> = { departamento: '', municipio: '', correo: '' };

  departamentos: Departamento[] = [];
  municipios: Municipio[] = [];
  filteredDepartamentos: Departamento[] = [];
  filteredMunicipios: Municipio[] = [];
  showDepartamentos = false;
  showMunicipios = false;
  departamentoText = '';
  municipioText = '';

  selectedDepartamento: Departamento | null = null;
  selectedMunicipio: Municipio | null = null;

  departamentoInvalid = false;
  departamentoValid = false;
  municipioInvalid = false;
  municipioValid = false;
  emailInvalid = false;
  emailValid = false;
  emailErrorMessage = '';

  // Alerta para mostrar mensajes
  alertMessage = '';
  alertType: 'success' | 'danger' | 'warning' | 'info' = 'info';
  showAlert = false;

  profileOptions = [
    { id: 'asistente',    label: 'Asistente técnico', description: 'Soporte especializado',       icon: 'bi bi-person-badge' },
    { id: 'productor',    label: 'Productor',        description: 'Agricultor profesional',      icon: 'bi bi-tree' },
    { id: 'estudiante',   label: 'Estudiante',       description: 'En formación académica',      icon: 'bi bi-mortarboard' },
    { id: 'investigador', label: 'Investigador',     description: 'Desarrollo científico',       icon: 'bi bi-search' },
    { id: 'docente',      label: 'Docente',          description: 'Educador especializado',      icon: 'bi bi-easel' },
    { id: 'general',      label: 'Público en general', description: 'Interés general',           icon: 'bi bi-people' }
  ];

  constructor(
    private http: HttpClient,
    private sqliteService: SqliteService
  ) {}

  async ngOnInit() {
    try {
      await this.sqliteService.initialize();
      console.log('SQLite inicializada correctamente');
    } catch (err) {
      console.error('No se pudo inicializar SQLite:', err);
    }
    this.loadDepartamentos();
  }

  private loadDepartamentos() {
    this.http.get<Departamento[]>('https://api-colombia.com/api/v1/Department')
      .subscribe({
        next: data => {
          this.departamentos = data.sort((a, b) => a.name.localeCompare(b.name));
          this.filteredDepartamentos = [...this.departamentos];
        },
        error: err => {
          console.error('Error al cargar departamentos:', err);
          this.loadFallbackDepartamentos();
        }
      });
  }

  private loadMunicipios(departmentId: number) {
    this.http.get<Municipio[]>(
      `https://api-colombia.com/api/v1/Department/${departmentId}/cities`
    ).subscribe({
      next: data => {
        this.municipios = data.sort((a, b) => a.name.localeCompare(b.name));
        this.filteredMunicipios = [...this.municipios];
      },
      error: err => {
        console.error('Error al cargar municipios:', err);
        this.municipios = [];
        this.filteredMunicipios = [];
      }
    });
  }

  filterDepartamentos(event: any) {
    const query = event.target.value.trim().toLowerCase();
    this.departamentoText = event.target.value;
    if (!query) {
      this.resetDepartamentoFilter();
      return;
    }
    this.filteredDepartamentos = this.departamentos.filter(d =>
      d.name.toLowerCase().includes(query)
    );
    const exact = this.departamentos.find(d => d.name.toLowerCase() === query);
    if (exact) {
      this.selectDepartamento(exact);
    } else {
      this.selectedDepartamento = null;
      this.clearMunicipios();
    }
    this.validateDepartamento();
    this.showDepartamentos = true;
  }

  selectDepartamento(dept: Departamento) {
    this.selectedDepartamento = dept;
    this.departamentoText = dept.name;
    this.usuario.departamento = dept.name;
    this.showDepartamentos = false;
    this.loadMunicipios(dept.id);
    this.clearMunicipios();
    this.validateDepartamento();
  }

  filterMunicipios(event: any) {
    const query = event.target.value.trim().toLowerCase();
    this.municipioText = event.target.value;
    if (!this.selectedDepartamento) return;
    if (!query) {
      this.resetMunicipioFilter();
      return;
    }
    this.filteredMunicipios = this.municipios.filter(m =>
      m.name.toLowerCase().includes(query)
    );
    const exact = this.municipios.find(m => m.name.toLowerCase() === query);
    if (exact) this.selectMunicipio(exact);
    else this.selectedMunicipio = null;
    this.validateMunicipio();
    this.showMunicipios = true;
  }

  selectMunicipio(mun: Municipio) {
    this.selectedMunicipio = mun;
    this.municipioText = mun.name;
    this.usuario.municipio = mun.name;
    this.showMunicipios = false;
    this.validateMunicipio();
  }

  private clearMunicipios() {
    this.municipioText = '';
    this.usuario.municipio = '';
    this.selectedMunicipio = null;
    this.filteredMunicipios = [];
    this.validateMunicipio();
  }

  private resetDepartamentoFilter() {
    this.filteredDepartamentos = [...this.departamentos];
    this.selectedDepartamento = null;
    this.clearMunicipios();
    this.validateDepartamento();
  }

  private resetMunicipioFilter() {
    this.filteredMunicipios = [...this.municipios];
    this.selectedMunicipio = null;
    this.validateMunicipio();
  }

  hideDepartamentosDropdown() {
    setTimeout(() => this.showDepartamentos = false, 200);
  }

  hideMunicipiosDropdown() {
    setTimeout(() => this.showMunicipios = false, 200);
  }

  validateDepartamento() {
    const valid = !!(
      this.selectedDepartamento &&
      this.selectedDepartamento.name.toLowerCase() === this.departamentoText.trim().toLowerCase()
    );
    this.departamentoValid = valid;
    this.departamentoInvalid = !valid;
  }

  validateMunicipio() {
    const valid = !!(
      this.selectedMunicipio &&
      this.selectedMunicipio.name.toLowerCase() === this.municipioText.trim().toLowerCase()
    );
    this.municipioValid = valid;
    this.municipioInvalid = !valid;
  }

  validateEmail() {
    const email = (this.usuario.correo || '').trim();
    if (!email) {
      this.emailValid = this.emailInvalid = false;
      this.emailErrorMessage = '';
      return;
    }
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (email.length < 5) { this.setEmailError('El correo debe tener al menos 5 caracteres.'); return; }
    if (email.length > 100) { this.setEmailError('El correo no puede tener más de 100 caracteres.'); return; }
    if (email.includes(' ')) { this.setEmailError('El correo no puede contener espacios.'); return; }
    if (!regex.test(email)) { this.setEmailError('Formato de correo inválido.'); return; }
    this.emailValid = true;
    this.emailInvalid = false;
    this.emailErrorMessage = '';
  }

  private setEmailError(msg: string) {
    this.emailInvalid = true;
    this.emailValid = false;
    this.emailErrorMessage = msg;
  }

  selectProfile(id: string) {
    this.perfilSeleccionado = id;
  }

  isFormValid(): boolean {
    return !!(
      this.perfilSeleccionado &&
      this.departamentoValid &&
      this.municipioValid &&
      this.emailValid
    );
  }

  private showAlertMessage(message: string, type: 'success' | 'danger' | 'warning' | 'info' = 'info') {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
    
    // Auto-hide alert after 5 seconds
    setTimeout(() => {
      this.showAlert = false;
    }, 5000);
  }

  closeAlert() {
    this.showAlert = false;
  }

  async guardarInformacion() {
    if (!this.isFormValid()) {
      this.showAlertMessage('Complete todos los campos correctamente antes de guardar.', 'warning');
      return;
    }
    if (!this.selectedDepartamento || !this.selectedMunicipio) {
      this.showAlertMessage('Seleccione departamento y municipio válidos.', 'warning');
      return;
    }
    const datosCompletos: Usuario = {
      perfil: this.perfilSeleccionado,
      departamento: this.selectedDepartamento.name,
      departamentoId: this.selectedDepartamento.id,
      municipio: this.selectedMunicipio.name,
      municipioId: this.selectedMunicipio.id,
      correo: (this.usuario.correo || '').trim().toLowerCase()
    };
    console.log('Datos a guardar:', datosCompletos);
    try {
      const res = await this.sqliteService.addUsuario(datosCompletos);
      console.log('Filas insertadas:', res.changes?.changes);
      this.showAlertMessage('Información guardada correctamente!', 'success');
    } catch (err) {
      console.error('Error al guardar/consultar en SQLite:', err);
      this.showAlertMessage('Error al guardar la información. Revise la consola.', 'danger');
    }
  }

  private loadFallbackDepartamentos() {
    this.departamentos = [
      { id: 1, name: 'Amazonas', description: 'Departamento del Amazonas' },
      { id: 2, name: 'Antioquia', description: 'Departamento de Antioquia' },
      { id: 3, name: 'Arauca', description: 'Departamento de Arauca' },
      { id: 4, name: 'Atlántico', description: 'Departamento del Atlántico' },
      { id: 5, name: 'Bolívar', description: 'Departamento de Bolívar' },
      { id: 6, name: 'Boyacá', description: 'Departamento de Boyacá' },
      { id: 7, name: 'Caldas', description: 'Departamento de Caldas' },
      { id: 8, name: 'Caquetá', description: 'Departamento del Caquetá' },
      { id: 9, name: 'Casanare', description: 'Departamento de Casanare' },
      { id: 10, name: 'Cauca', description: 'Departamento del Cauca' },
      { id: 11, name: 'Cesar', description: 'Departamento del Cesar' },
      { id: 12, name: 'Chocó', description: 'Departamento del Chocó'},
      { id: 13, name: 'Córdoba', description: 'Departamento de Córdoba' },
      { id: 14, name: 'Cundinamarca', description: 'Departamento de Cundinamarca' },
      { id: 15, name: 'Guainía', description: 'Departamento de Guainía' },
      { id: 16, name: 'Guaviare', description: 'Departamento del Guaviare' },
      { id: 17, name: 'Huila', description: 'Departamento del Huila' },
      { id: 18, name: 'La Guajira', description: 'Departamento de La Guajira' },
      { id: 19, name: 'Magdalena', description: 'Departamento del Magdalena' },
      { id: 20, name: 'Meta', description: 'Departamento del Meta' },
      { id: 21, name: 'Nariño', description: 'Departamento de Nariño' },
      { id: 22, name: 'Norte de Santander', description: 'Departamento de Norte de Santander' },
      { id: 23, name: 'Putumayo', description: 'Departamento del Putumayo' },
      { id: 24, name: 'Quindío', description: 'Departamento del Quindío' },
      { id: 25, name: 'Risaralda', description: 'Departamento de Risaralda' },
      { id: 26, name: 'San Andrés y Providencia', description: 'Departamento de San Andrés y Providencia' },
      { id: 27, name: 'Santander', description: 'Departamento de Santander' },
      { id: 28, name: 'Sucre', description: 'Departamento de Sucre' },
      { id: 29, name: 'Tolima', description: 'Departamento del Tolima' },
      { id: 30, name: 'Valle del Cauca', description: 'Departamento del Valle del Cauca' },
      { id: 31, name: 'Vaupés', description: 'Departamento del Vaupés' },
      { id: 32, name: 'Vichada', description: 'Departamento del Vichada'}];
      this.filteredDepartamentos = [...this.departamentos];
      console.log("Departamentos fallback cargados correctamente", this.departamentos.length);
  }
}