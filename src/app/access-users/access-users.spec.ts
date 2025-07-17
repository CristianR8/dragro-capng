import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessUsersComponent } from './access-users';

describe('AccessUsersComponent', () => {
  let component: AccessUsersComponent;
  let fixture: ComponentFixture<AccessUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
