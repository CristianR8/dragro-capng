import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="spinner-container" [class]="containerClass">
      <div class="spinner-wrapper">
        <div 
          class="spinner-border" 
          [class]="spinnerClass"
          role="status"
          [attr.aria-hidden]="true">
          <span class="visually-hidden">{{ loadingText }}</span>
        </div>
        <div *ngIf="showText" class="spinner-text mt-2">
          {{ loadingText }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .spinner-container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
    }

    .spinner-container.overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 9999;
    }

    .spinner-container.inline {
      position: relative;
      min-height: 100px;
    }

    .spinner-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .spinner-text {
      font-size: 0.875rem;
      color: #6c757d;
      text-align: center;
      font-weight: 500;
    }

    .spinner-container.overlay .spinner-text {
      color: #fff;
    }

    /* Tamaños personalizados */
    .spinner-border.spinner-sm {
      width: 1.5rem;
      height: 1.5rem;
    }

    .spinner-border.spinner-lg {
      width: 3rem;
      height: 3rem;
    }

    .spinner-border.spinner-xl {
      width: 4rem;
      height: 4rem;
    }

    /* Animación suave */
    .spinner-border {
      animation: spinner-border 0.75s linear infinite;
    }

    @keyframes spinner-border {
      to {
        transform: rotate(360deg);
      }
    }
  `]
})
export class SpinnerComponent {
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() color: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' = 'primary';
  @Input() loadingText: string = 'Cargando...';
  @Input() showText: boolean = true;
  @Input() overlay: boolean = false;
  @Input() customClass: string = '';

  get spinnerClass(): string {
    let classes = [];
    
    if (this.size !== 'md') {
      classes.push(`spinner-${this.size}`);
    }
    
    classes.push(`text-${this.color}`);
    
    if (this.customClass) {
      classes.push(this.customClass);
    }
    
    return classes.join(' ');
  }

  get containerClass(): string {
    return this.overlay ? 'overlay' : 'inline';
  }
}