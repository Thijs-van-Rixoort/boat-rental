import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoatDetailsComponent } from './boat-details.component';

describe('BoatDetailsComponent', () => {
    let component: BoatDetailsComponent;
    let fixture: ComponentFixture<BoatDetailsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [BoatDetailsComponent]
        });
        fixture = TestBed.createComponent(BoatDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
