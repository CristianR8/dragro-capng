import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface SpinnerConfig {
  show: boolean;
  message?: string;
  overlay?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
}

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private spinnerSubject = new BehaviorSubject<SpinnerConfig>({
    show: false,
    message: 'Cargando...',
    overlay: true,
    size: 'md',
    color: 'primary'
  });

  public spinnerState$ = this.spinnerSubject.asObservable();

  show(config?: Partial<SpinnerConfig>): void {
    const currentConfig = this.spinnerSubject.value;
    const newConfig: SpinnerConfig = {
      ...currentConfig,
      ...config,
      show: true
    };
    this.spinnerSubject.next(newConfig);
  }

  hide(): void {
    const currentConfig = this.spinnerSubject.value;
    this.spinnerSubject.next({
      ...currentConfig,
      show: false
    });
  }

  // Método para mostrar spinner durante una operación asíncrona
  async showWhileLoading<T>(
    operation: Promise<T>, 
    config?: Partial<SpinnerConfig>
  ): Promise<T> {
    try {
      this.show(config);
      const result = await operation;
      return result;
    } catch (error) {
      throw error;
    } finally {
      this.hide();
    }
  }
}