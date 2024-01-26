import sinon from 'sinon';
import { expect } from 'chai';
import { BoatService } from '../../src/business/service/boat';
import { BoatSequelizeDatabase } from '../../src/data/sequelize/boat';
import { BoatHelper } from './helper';
import { ExpectedCreateBody } from '../../src/data/interfaces/boat';

/**
 * The following tests are dedicated to the creation of a boat. Usually Service level Tests.
 * *most* of these will be partially reverse engineerd from pre-existing ones, as sinon is brand new to me.
 * @author Marcus K.
 */

describe('Boat Service Layer Tests: BoatService', (): void => {
    /**
     * Tests dedicated for creating a New Boat in particular
     */
    describe('New Boat Creation: Service level tests for creating a new boat', (): void => {
        const testHelper: BoatHelper = new BoatHelper();
        let boatService: BoatService;
        let startTransactionStub: sinon.SinonStub;
        let assignBrandStub: sinon.SinonStub;
        let createBoatStub: sinon.SinonStub;
        let createFacilitiesStub: sinon.SinonStub;
        let assignFacilitiesStub: sinon.SinonStub;
        let assignImagesStub: sinon.SinonStub;
        let endTransactionStub: sinon.SinonStub;
        let transactionRollbackStub: sinon.SinonStub;

        /* Loads in a new stub before each tests, to make sure no data sticks per test. */
        beforeEach((): void => {
            startTransactionStub = sinon.stub(
                BoatSequelizeDatabase.prototype,
                'startTransaction'
            );
            assignBrandStub = sinon.stub(
                BoatSequelizeDatabase.prototype,
                'assignBrand'
            );
            createBoatStub = sinon.stub(
                BoatSequelizeDatabase.prototype,
                'createNewBoat'
            );
            createFacilitiesStub = sinon.stub(
                BoatSequelizeDatabase.prototype,
                'createFacilities'
            );
            assignFacilitiesStub = sinon.stub(
                BoatSequelizeDatabase.prototype,
                'assignFacilities'
            );
            assignImagesStub = sinon.stub(
                BoatSequelizeDatabase.prototype,
                'assignImages'
            );
            endTransactionStub = sinon.stub(
                BoatSequelizeDatabase.prototype,
                'endTransaction'
            );
            transactionRollbackStub = sinon.stub(
                BoatSequelizeDatabase.prototype,
                'transactionRollback'
            );

            boatService = new BoatService(new BoatSequelizeDatabase());
        });

        /* Sets the original method back to how it was before we stubbed it */
        afterEach((): void => {
            startTransactionStub.restore();
            assignBrandStub.restore();
            createBoatStub.restore();
            createFacilitiesStub.restore();
            assignFacilitiesStub.restore();
            assignImagesStub.restore();
            endTransactionStub.restore();
            transactionRollbackStub.restore();
        });

        /**
         * This is a test dedicated to creating a new boat with the correct values required.
         * It loops over our testHelper to grab these valid values from and runs this "success" test for each and every of them.
         * @author Marcus K.
         */
        testHelper
            .validCreateData()
            .forEach(
                async (element: {
                    testType: string;
                    data: ExpectedCreateBody;
                }) => {
                    /* This is where the test itself is placed. */
                    it(
                        'successfully creates a new boat with valid data ' +
                            element.testType,
                        async (): Promise<void> => {
                            const expected = {
                                created: true,
                                message:
                                    'A New Boat Has Been Created Successfully!'
                            };

                            const actual = await boatService.createBoat(
                                element.data
                            );

                            expect(actual).to.deep.equal(expected);
                        }
                    );
                }
            );

        /**
         * This is a test dedicated to failing to create a boat with the wrong values.
         * It loops over our testHelper to grab these valid values and expected result from and runs this "failure" test for each and every of them.
         * I could just have like 3 all-encompassing edgecase tests which would be more than plenty enough,
         * but I've loaded a bunch of specific edgetests in the helper just to make sure all the messages are correct as well.
         * @author Marcus K.
         */
        testHelper
            .invalidCreateData()
            .forEach(
                async (element: {
                    testType: string;
                    failureReason: string;
                    data: ExpectedCreateBody;
                }) => {
                    /* This is where the test itself is placed. */
                    it(
                        'fails to create a new boat with invalid data ' +
                            element.testType,
                        async (): Promise<void> => {
                            const expected = {
                                created: false,
                                message: element.failureReason
                            };

                            const actual = await boatService.createBoat(
                                element.data
                            );

                            expect(actual).to.deep.equal(expected);
                        }
                    );
                }
            );
    });
});
