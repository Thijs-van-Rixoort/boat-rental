import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoatManagementComponent } from './boat-management.component';

describe('BoatManagementComponent', () => {
  let component: BoatManagementComponent;
  let fixture: ComponentFixture<BoatManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BoatManagementComponent]
    });
    fixture = TestBed.createComponent(BoatManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
