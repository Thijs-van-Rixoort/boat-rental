import request, { Response } from 'supertest';
import { expect } from 'chai';
import { SERVER } from '../../src/server';
import sinon from 'sinon';
import { BoatSequelizeDatabase } from '../../src/data/sequelize/boat';
import { Boat } from '../../src/business/model/boat';

/**
 * @author Youri Janssen
 * E2E test suite for the /register endpoint.
 * Here we use a stub, that we spy upon.
 */
describe('E2E Tests: /boat route', () => {
    let searchBoatsStub: sinon.SinonStub;

    beforeEach(() => {
        searchBoatsStub = sinon.stub(
            BoatSequelizeDatabase.prototype,
            'searchBoats'
        );
    });

    afterEach(() => {
        searchBoatsStub.restore();
    });

    it('Should return 200 when boats are found or no boats are found', async () => {
        const mockBoat = Boat.createBoat('Mock Boat', 2000, 5, true, true, [
            'Toilet'
        ]);

        searchBoatsStub.resolves([mockBoat]);

        const expected = [mockBoat];

        const actual: Response = await request(SERVER.app).get(
            '/boat/?name=boat&limit=20&offset=0'
        );

        expect(actual.statusCode).equals(200);
        expect(actual.body).to.deep.equals(expected);

        // Spy verification
        sinon.assert.calledOnce(searchBoatsStub);
        sinon.assert.calledWith(searchBoatsStub, 'boat', 20, 0);
    });

    it('Should return 500 when a server error occurs', async () => {
        searchBoatsStub.resolves('server_error');

        const expected = {
            error: 'A server error occurred'
        };

        const actual: Response = await request(SERVER.app).get(
            '/boat/?name=boat&limit=20&offset=0'
        );
        expect(actual.statusCode).equals(500);
        expect(actual.body).to.deep.equals(expected);

        // Spy verification
        sinon.assert.calledOnce(searchBoatsStub);
        sinon.assert.calledWith(searchBoatsStub, 'boat');
    });

    /**
     * @author Thijs van Rixoort
     */
    it('Should return http statuscode 200 and an array of boats up to the limit when there is no name input and boats are found', async () => {
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

        searchBoatsStub.resolves(boatArray);

        const expected: {
            id?: number | undefined;
            name: string;
            price_per_day_in_cents: number;
            capacity: number;
            license_required: boolean;
            skipper_required: boolean;
            facilities?: string[] | undefined;
            fabrication_year?: number | undefined;
            length_in_meters?: number | undefined;
            active?: number | undefined;
        }[] = boatArray.map((boat: Boat) => {
            return boat.toJSON();
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expected.forEach((boat: any) => {
            Object.keys(boat).forEach((key: string) => {
                if (boat[key] === undefined) {
                    delete boat[key];
                }
            });
        });

        // Act
        const actual: Response = await request(SERVER.app).get(
            '/boat/?name=&limit=2&offset=0'
        );

        // Assert
        expect(actual.statusCode).equals(200);
        expect(actual.body).to.deep.equals(expected);

        expect(searchBoatsStub.calledOnceWith('boat', 2, 0));
    });
});
