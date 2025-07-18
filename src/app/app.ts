import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormComponent } from './form/form';
import { SpinnerComponent } from './components/spinner/spinner';
import { SpinnerService, SpinnerConfig } from './services/spinner.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    FormComponent,
    SpinnerComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  spinnerConfig$: Observable<SpinnerConfig>;
  showSpinner$: Observable<boolean>;

  constructor(private spinnerService: SpinnerService) {
    this.spinnerConfig$ = this.spinnerService.spinnerState$;
    this.showSpinner$ = this.spinnerConfig$.pipe(
      map(config => config.show)
    );
  }
}