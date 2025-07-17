import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessEmailComponent } from './access-email';

describe('AccessEmail', () => {
  let component: AccessEmailComponent;
  let fixture: ComponentFixture<AccessEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessEmailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
