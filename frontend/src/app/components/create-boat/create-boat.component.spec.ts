import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBoatComponent } from './create-boat.component';

describe('UpsertBoatComponent', () => {
  let component: CreateBoatComponent;
  let fixture: ComponentFixture<CreateBoatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateBoatComponent]
    });
    fixture = TestBed.createComponent(CreateBoatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
