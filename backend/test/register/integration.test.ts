import sinon from 'sinon';
import { expect } from 'chai';
import { Roles, User } from '../../src/business/model/user';
import { RegisterSequelizeDatabase } from '../../src/data/sequelize/register';
import { RegisterService } from '../../src/business/service/register';
import { SequelizeDatabase } from '../../src/data/sequelize/database';

/**
 * @author Youri Janssen
 * Integration Tests: RegisterService
 */
describe('Integration Tests: RegisterService', async () => {
    let registerService: RegisterService;
    let createUserStub: sinon.SinonStub;
    let getUserByMailStub: sinon.SinonStub;

    beforeEach(() => {
        createUserStub = sinon.stub(
            RegisterSequelizeDatabase.prototype,
            'createUser'
        );
        getUserByMailStub = sinon.stub(
            RegisterSequelizeDatabase.prototype,
            'getUserByMail'
        );
        registerService = new RegisterService(new SequelizeDatabase());
    });

    afterEach(() => {
        createUserStub.restore();
        getUserByMailStub.restore();
    });

    it('should create a user successfully', async () => {
        getUserByMailStub.resolves(null);
        createUserStub.resolves(true);
        const result = await registerService.createUser(
            'test@example.com',
            'Test123!',
            Roles.USER,
            1
        );
        expect(result).to.equal(true);
    });
    it('should handle user validation errors', async () => {
        getUserByMailStub.resolves(null);
        createUserStub.resolves(['Invalid email', 'Invalid password']);

        const result = await registerService.createUser(
            'invalid-email',
            'invalid-password',
            Roles.USER,
            1
        );
        expect(result)
            .to.be.an('array')
            .that.includes('Invalid email', 'Invalid password');
    });

    it('should handle user existence check', async () => {
        getUserByMailStub.resolves(
            User.createUser('test@example.com', 'Test123!', Roles.USER, 1)
        );
        createUserStub.resolves('user_exists');
        const result = await registerService.createUser(
            'test@example.com',
            'Test123!',
            Roles.USER,
            1
        );
        expect(result).to.equal('user_exists');
    });
});
