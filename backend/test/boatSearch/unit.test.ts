import { expect } from 'chai';
import { Boat, DeserializedBoat } from '../../src/business/model/boat';
import { SearchQuery } from '../../src/business/model/searchQuery';

/**
 * @author Youri Janssen & Thijs van Rixoort
 * Unit test suite for the SearchQuery and Boat classes.
 */
describe('Unit Tests: SearchQuery class', () => {
    it('should return no errors when using a valid search query', () => {
        const searchQuery = new SearchQuery('ship');
        const queryValidation: string[] | null = searchQuery.validateQuery();
        expect(queryValidation).to.be.null;
    });

    it('should return null when using an empty search query', () => {
        // Arrange
        const searchQuery = new SearchQuery('');

        const expected: null = null;

        // Act
        const queryValidation: string[] | null = searchQuery.validateQuery();

        // Assert
        expect(queryValidation).to.equal(expected);
    });

    it('should return no error when using a search query with minimum length (1 character)', () => {
        const searchQuery = new SearchQuery('T');
        const queryValidation: string[] | null = searchQuery.validateQuery();
        expect(queryValidation).to.be.null;
    });

    it('should return no error when using a search query with maximum length (150 characters)', () => {
        const searchQuery = new SearchQuery('T'.repeat(150));
        const queryValidation: string[] | null = searchQuery.validateQuery();
        expect(queryValidation).to.be.null;
    });

    it('should return an error when using a search query over the maximum length (151 characters)', () => {
        const searchQuery = new SearchQuery('T'.repeat(151));
        const queryValidation: string[] | null = searchQuery.validateQuery();
        expect(queryValidation).to.deep.equal([
            'A search query cannot contain more than 150 characters'
        ]);
    });
});
describe('Unit Tests: Boat class', () => {
    /**
     * @author Thijs van Rixoort
     */
    it(`should be able to return a boat as a JSON object`, () => {
        // Arrange
        const boat: Boat = Boat.createBoatWithId(
            1,
            'Ship Happens',
            10000,
            10,
            true,
            true,
            ['Toilet', 'Koelkast'],
            []
        );

        const expected: DeserializedBoat = {
            id: 1,
            name: 'Ship Happens',
            price_per_day_in_cents: 10000,
            capacity: 10,
            license_required: true,
            skipper_required: true,
            facilities: ['Toilet', 'Koelkast'],
            fabrication_year: undefined,
            length_in_meters: undefined,
            active: undefined,
            images: []
        };

        // Act
        const actual: DeserializedBoat = boat.toJSON();

        // Assert
        expect(actual).to.deep.equal(expected);
    });
});
