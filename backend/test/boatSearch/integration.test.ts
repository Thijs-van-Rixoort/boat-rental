import { BoatSequelizeDatabase } from '../../src/data/sequelize/boat';
import sinon from 'sinon';
import { expect } from 'chai';
import { Boat } from '../../src/business/model/boat';
import { BoatService } from '../../src/business/service/boat';

/**
 * Integration test suite for the BoatService.
 * Here we use a mock.
 * @author Youri Janssen & Thijs van Rixoort
 */
describe('Integration Tests: BoatService', () => {
    let boatService: BoatService;
    let boatSequelizeDatabaseMock: sinon.SinonMock;

    beforeEach(() => {
        const boatSequelizeDatabaseInstance = new BoatSequelizeDatabase();
        boatSequelizeDatabaseMock = sinon.mock(boatSequelizeDatabaseInstance);
        boatService = new BoatService(boatSequelizeDatabaseInstance);
    });

    afterEach(() => {
        boatSequelizeDatabaseMock.restore();
    });

    it('should return a boat when an existing boat is searched', async () => {
        const expectedBoat = {
            name: 'test',
            price_per_day_in_cents: 100,
            capacity: 5,
            license_required: false,
            skipper_required: false,
            facilities: ['test']
        };

        boatSequelizeDatabaseMock
            .expects('searchBoats')
            .withArgs('test', 20, 0)
            .resolves(expectedBoat);

        const result = await boatService.searchBoats('test', 20, 0);
        expect(result).to.include(expectedBoat);

        boatSequelizeDatabaseMock.verify();
    });

    it('should return an empty array when no boats are found', async () => {
        const noDataResponse: Boat[] = [];

        boatSequelizeDatabaseMock
            .expects('searchBoats')
            .withArgs('test', 20, 0)
            .resolves(noDataResponse);

        const result = await boatService.searchBoats('test', 20, 0);
        expect(result).to.equal(noDataResponse);

        boatSequelizeDatabaseMock.verify();
    });

    it('should return an array of length limit when no name is given and boats are found', async () => {
        // Arrange
        const boatArray: Boat[] = [
            Boat.createBoatWithId(
                1,
                'Buoy, Oh Buoy!',
                2000,
                5,
                false,
                false,
                ['Toilet'],
                []
            ),
            Boat.createBoatWithId(
                1,
                'Ship Happens',
                2500,
                10,
                true,
                false,
                ['Koelkast'],
                []
            )
        ];

        boatSequelizeDatabaseMock
            .expects('searchBoats')
            .withArgs('', 2, 0)
            .resolves(boatArray);

        // Act
        const result = await boatService.searchBoats('', 2, 0);

        // Assert
        expect(result).to.equal(boatArray);

        boatSequelizeDatabaseMock.verify();
    });
});
