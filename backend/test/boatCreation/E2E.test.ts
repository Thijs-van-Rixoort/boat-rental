import sinon from 'sinon';
import { expect } from 'chai';
import request, { Response as supertestResponse } from 'supertest';
import { SERVER } from '../../src/server';

/**
 * The following tests are dedicated to the creation of a boat. Usually Service level Tests.
 * *most* of these will be partially reverse engineerd from pre-existing ones, as sinon is brand new to me.
 * @author Marcus K.
 */

describe('Boat Controller Layer Tests: BoatService /boat', (): void => {
    const sandbox: sinon.SinonSandbox = sinon.createSandbox();

    describe('New Boat Creation: Controller level tests on our route for creating a new boat', (): void => {
        /* Loads in a new stub before each tests, to make sure no data sticks per test. */
        beforeEach((): void => {});

        /* Sets the original method back to how it was before we stubbed it */
        afterEach((): void => {
            sandbox.restore();
            sinon.restore();
        });

        it('should not allow an user without a proper cookie to access this route', async (): Promise<void> => {
            const expectedStatusCode = 401;

            const expected = 'You Are Not Authorized To Access This Endpoint';

            const actual: supertestResponse = await request(SERVER.app).post(
                '/boat'
            );

            expect(actual.body).to.equal(expected);
            expect(actual.statusCode).to.equal(expectedStatusCode);
        });
    });
});
