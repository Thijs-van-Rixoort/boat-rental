import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoatComponent } from './boat.component';
import { BoatService } from 'src/app/services/boat.service';
import { of } from 'rxjs';
import { Boat } from 'src/app/interfaces/boat';

describe('BoatComponent', () => {
    let component: BoatComponent;
    let fixture: ComponentFixture<BoatComponent>;
    let mockBoatService: jasmine.SpyObj<BoatService>;

    beforeEach(() => {
        mockBoatService = jasmine.createSpyObj('BoatService', ['searchBoats']);

        TestBed.configureTestingModule({
            declarations: [BoatComponent],
            providers: [{ provide: BoatService, useValue: mockBoatService }]
        });
        fixture = TestBed.createComponent(BoatComponent);
        component = fixture.componentInstance;
    });

    it('should create an instance of the BoatComponent', () => {
        expect(component).toBeTruthy();
    });

    it('should return search results for a regular search query', () => {
        component.searchTerm = 'boat';
        mockBoatService.searchBoats.and.returnValue(
            of([
                {
                    name: 'Rowboat',
                    price_per_day_in_cents: 1000,
                    capacity: 4,
                    license_required: true,
                    skipper_required: true
                },
                {
                    name: 'Sailboat',
                    price_per_day_in_cents: 2000,
                    capacity: 6,
                    license_required: true,
                    skipper_required: true
                },
                {
                    name: 'Speedboat',
                    price_per_day_in_cents: 3000,
                    capacity: 8,
                    license_required: true,
                    skipper_required: true
                }
            ] as Boat[])
        );
        component.searchBoats(component.searchTerm);
        expect(component.searchedBoats.length).toBe(3);
    });

    it('should not return search results for an empty search query', () => {
        component.searchTerm = '';
        component.searchBoats(component.searchTerm);
        expect(mockBoatService.searchBoats).not.toHaveBeenCalled();
    });

    it('should return search results for a search query with the minimum length of 1 character', () => {
        component.searchTerm = 'T';
        mockBoatService.searchBoats.and.returnValue(
            of([
                {
                    name: 'Rowboat',
                    price_per_day_in_cents: 1000,
                    capacity: 4,
                    license_required: true,
                    skipper_required: true
                },
                {
                    name: 'Sailboat',
                    price_per_day_in_cents: 2000,
                    capacity: 6,
                    license_required: true,
                    skipper_required: true
                },
                {
                    name: 'Speedboat',
                    price_per_day_in_cents: 3000,
                    capacity: 8,
                    license_required: true,
                    skipper_required: true
                }
            ] as Boat[])
        );
        component.searchBoats(component.searchTerm);
        expect(component.searchedBoats.length).toBe(3);
    });

    it('should return search results for a search query with the maximum length of 150 characters', () => {
        component.searchTerm = 'q'.repeat(150);
        mockBoatService.searchBoats.and.returnValue(of([]));
        component.searchBoats(component.searchTerm);
        expect(component.searchedBoats).toEqual([]);
    });

    it('should display an error message for a search query over the maximum length', () => {
        component.searchTerm = 'q'.repeat(151);
        component.searchBoats(component.searchTerm);
        expect(mockBoatService.searchBoats).not.toHaveBeenCalled();
        expect(component.searchedBoats).toEqual([]);
    });

    it('should display search results in alphabetical order', () => {
        component.searchTerm = 'boat';
        mockBoatService.searchBoats.and.returnValue(
            of([
                {
                    name: 'Rowboat',
                    price_per_day_in_cents: 1000,
                    capacity: 4,
                    license_required: true,
                    skipper_required: true
                },
                {
                    name: 'Sailboat',
                    price_per_day_in_cents: 2000,
                    capacity: 6,
                    license_required: true,
                    skipper_required: true
                },
                {
                    name: 'Speedboat',
                    price_per_day_in_cents: 3000,
                    capacity: 8,
                    license_required: true,
                    skipper_required: true
                }
            ] as Boat[])
        );
        expect(component.checkAlphabeticalOrder()).toBe(true);
    });
});
