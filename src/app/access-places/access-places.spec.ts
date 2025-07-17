import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessPlaces } from './access-places';

describe('AccessPlaces', () => {
  let component: AccessPlaces;
  let fixture: ComponentFixture<AccessPlaces>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessPlaces]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessPlaces);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
