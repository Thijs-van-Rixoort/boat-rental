import sinon from 'sinon';
import { expect } from 'chai';

import { Session } from '../../src/business/model/session';
import { SessionService } from '../../src/business/service/session';
import { SessionSequelizeDatabase } from '../../src/data/sequelize/session';
import { User, Roles } from '../../src/business/model/user';
import { UserSequelizeDatabase } from '../../src/data/sequelize/user';
import { SequelizeDatabase } from '../../src/data/sequelize/database';

/**
 * Integration tests for the SessionService.
 * @author Thijs van Rixoort
 */
describe('Integration Tests: SessionService', (): void => {
    describe(`login`, (): void => {
        let sessionService: SessionService;
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
            sessionService = new SessionService(new SequelizeDatabase());
        });

        afterEach((): void => {
            createSessionStub.restore();
            getUserByEmailStub.restore();
            deleteSessionsStub.restore();
        });

        it('should return the created session when email and password are correct', async (): Promise<void> => {
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

            const expected: Session = session;

            // Act
            const actual = await sessionService.login(
                'test@example.com',
                'TestPassword123!'
            );

            // Assert
            expect(actual).to.deep.equal(expected);
        });

        it('should fail when an invalid password is sent', async (): Promise<void> => {
            // Arrange
            const user: User = User.createUserWithId(
                1,
                'test@example.com',
                await User.hashPassword('TestPassword123!'),
                Roles.USER,
                1
            );
            getUserByEmailStub.resolves(user);

            const expected = 'Het e-mailadres of wachtwoord klopt niet.';

            // Act
            const actual: () => Promise<void> = async (): Promise<void> => {
                await sessionService.login(
                    'test@example.com',
                    'invalid-password'
                );
            };

            // Assert
            expect(actual()).to.eventually.be.rejectedWith(expected);
        });

        it('should fail when an invalid email is sent', async (): Promise<void> => {
            // Arrange
            const error: Error = new Error(
                'Het e-mailadres of wachtwoord klopt niet.'
            );
            getUserByEmailStub.throws(error);

            const expected: Error = error;

            // Act
            const actual: () => Promise<void> = async (): Promise<void> => {
                await sessionService.login(
                    'invalid@email.com',
                    'TestPassword123!'
                );
            };

            // Assert
            expect(actual()).to.eventually.be.rejectedWith(expected);
        });
    });

    describe(`logout`, (): void => {
        let sessionService: SessionService;
        let deleteSessionByIdStub: sinon.SinonStub;

        beforeEach((): void => {
            deleteSessionByIdStub = sinon.stub(
                SessionSequelizeDatabase.prototype,
                'deleteSessionById'
            );

            sessionService = new SessionService(new SequelizeDatabase());
        });

        afterEach((): void => {
            deleteSessionByIdStub.restore();
        });

        it('should handle errors when deleting a session by id', async (): Promise<void> => {
            // Arrange
            const error: Error = new Error(
                'Het uitloggen is helaas niet gelukt, probeer het later nog eens.'
            );
            deleteSessionByIdStub.throws(error);

            const expected: Error = error;

            // Act
            const actual: () => Promise<void> = async (): Promise<void> => {
                await sessionService.logout('incorrectSessionId');
            };

            // Assert
            expect(actual()).to.eventually.be.rejectedWith(expected);
            expect(deleteSessionByIdStub.calledOnce);
        });

        it('should return nothing when the session is deleted succesfully', async (): Promise<void> => {
            // Arrange
            deleteSessionByIdStub.resolves(undefined);

            const expected: undefined = undefined;

            // Act
            const actual: () => Promise<void> = async (): Promise<void> => {
                await sessionService.logout('correctSessionId');
            };

            // Assert
            expect(actual()).to.eventually.equal(expected);
            expect(deleteSessionByIdStub.calledOnce);
        });
    });
});
