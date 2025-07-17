import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessPlacesComponent } from './access-place';

describe('AccessPlacesComponent', () => {
  let component: AccessPlacesComponent;
  let fixture: ComponentFixture<AccessPlacesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessPlacesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessPlacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
