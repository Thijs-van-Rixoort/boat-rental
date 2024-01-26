import request, { Response } from 'supertest';
import sinon from 'sinon';
import { expect } from 'chai';

import { SERVER } from '../../src/server';
import { SessionSequelizeDatabase } from '../../src/data/sequelize/session';
import { UserSequelizeDatabase } from '../../src/data/sequelize/user';
import { User, Roles } from '../../src/business/model/user';
import { Session } from '../../src/business/model/session';
import { SessionService } from '../../src/business/service/session';

/**
 * E2E tests for the back end session functionality.
 * @author Thijs van Rixoort
 */
describe('E2E Tests: /sessions', (): void => {
    const sandbox: sinon.SinonSandbox = sinon.createSandbox();
    let spy: sinon.SinonSpy;

    describe(`login`, (): void => {
        let createSessionStub: sinon.SinonStub;
        let getUserByEmailStub: sinon.SinonStub;
        let deleteSessionsStub: sinon.SinonStub;

        beforeEach((): void => {
            createSessionStub = sinon.stub(
                SessionSequelizeDatabase.prototype,
                'createSession'
            );

            getUserByEmailStub = sinon.stub(
                UserSequelizeDatabase.prototype,
                'getUserByEmail'
            );

            deleteSessionsStub = sinon.stub(
                SessionSequelizeDatabase.prototype,
                'deleteExpiredSessionsByUserId'
            );

            spy = sinon.spy(SessionService.prototype, 'login');
        });

        afterEach((): void => {
            sandbox.restore();
            sinon.restore();
        });

        it('should return 201, a message in the body and a cookie when a session is created', async (): Promise<void> => {
            // Arrange
            const user: User = User.createUserWithId(
                1,
                'test@example.com',
                await User.hashPassword('TestPassword123!'),
                Roles.USER,
                1
            );
            getUserByEmailStub.resolves(user);

            const session: Session = new Session(1);
            createSessionStub.resolves(session);
            deleteSessionsStub.resolves(undefined);

            const expectedStatusCode: number = 201;
            const expectedBody: { message: string } = {
                message: 'U bent succesvol ingelogd.'
            };
            const expectedCookie: string = `session_token=${
                session.id
            }; Path=/; Expires=${session.expirationDate.toUTCString()}`;

            // Act
            const actual: Response = await request(SERVER.app)
                .post('/sessions')
                .send({
                    email: 'test@example.com',
                    password: 'TestPassword123!'
                });

            const cookie: string = actual.headers['set-cookie'].map(
                (cookieString: string): string | undefined => {
                    return cookieString.split('=')[0] === 'session_token'
                        ? cookieString
                        : undefined;
                }
            )[0];

            // Assert
            expect(actual.statusCode).to.equal(expectedStatusCode);
            expect(actual.body).to.deep.equal(expectedBody);
            expect(cookie).to.equal(expectedCookie);

            expect(spy.calledOnce);
        });

        it('should return 400 and a message when an error occurs', async (): Promise<void> => {
            // Arrange
            getUserByEmailStub.throws(
                new Error('Het e-mailadres of wachtwoord klopt niet.')
            );

            const expectedStatusCode: number = 400;
            const expectedBody: { message: string } = {
                message: 'U kon helaas niet worden ingelogd.'
            };

            // Act
            const actual: Response = await request(SERVER.app)
                .post('/sessions')
                .send({
                    email: 'doesnt-exist@email.com',
                    password: 'DoesntExist123!'
                });

            // Assert
            expect(actual.statusCode).to.equal(expectedStatusCode);
            expect(actual.body).to.deep.equal(expectedBody);

            expect(spy.calledOnce);
        });
    });

    describe(`logout`, (): void => {
        let deleteSessionStub: sinon.SinonStub;
        let consoleStub: sinon.SinonStub;

        beforeEach((): void => {
            deleteSessionStub = sinon.stub(
                SessionSequelizeDatabase.prototype,
                'deleteSessionById'
            );

            consoleStub = sinon.stub(console, 'error');

            spy = sinon.spy(SessionService.prototype, 'logout');
        });

        afterEach((): void => {
            sandbox.restore();
            sinon.restore();
        });

        it(`should return http code 200 and a message when a user is succesfully logged out`, async (): Promise<void> => {
            // Arrange
            deleteSessionStub.resolves(undefined);

            const expectedStatusCode: number = 200;
            const expectedBody: { message: string } = {
                message: 'U bent uitgelogd.'
            };
            const expectedCookie: string = `session_token=; Path=/; Expires=${new Date(
                0
            ).toUTCString()}`;

            // Act
            const actual: Response = await request(SERVER.app)
                .delete('/sessions')
                .send();

            const cookie: string = actual.headers['set-cookie'].map(
                (cookieString: string) => {
                    return cookieString.split('=')[0] === 'session_token'
                        ? cookieString
                        : undefined;
                }
            )[0];

            // Assert
            expect(actual.statusCode).to.equal(expectedStatusCode);
            expect(actual.body).to.deep.equal(expectedBody);
            expect(cookie).to.equal(expectedCookie);

            expect(spy.calledOnce);
        });

        it(`should log when deleting a session from the database results in an error and then send back a response with a message and statuscode 200`, async (): Promise<void> => {
            // Arrange
            deleteSessionStub.throws(
                new Error("Session couldn't be deleted from the database.")
            );

            const expectedStatusCode: number = 200;
            const expectedBody: { message: string } = {
                message: 'U bent uitgelogd.'
            };
            const expectedCookie: string = `session_token=; Path=/; Expires=${new Date(
                0
            ).toUTCString()}`;

            // Act
            const actual: Response = await request(SERVER.app)
                .delete('/sessions')
                .send();

            const cookie: string = actual.headers['set-cookie'].map(
                (cookieString: string): string | undefined => {
                    return cookieString.split('=')[0] === 'session_token'
                        ? cookieString
                        : undefined;
                }
            )[0];

            // Assert
            expect(actual.statusCode).to.equal(expectedStatusCode);
            expect(actual.body).to.deep.equal(expectedBody);
            expect(cookie).to.equal(expectedCookie);
            expect(
                consoleStub.calledOnceWith(
                    "Logout Endpoint: Session couldn't be deleted from the database."
                )
            ).to.be.true;

            expect(spy.calledOnce);
        });
    });
});
