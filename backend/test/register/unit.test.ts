import { expect } from 'chai';
import { Roles, User } from '../../src/business/model/user';

/**
 * @author Youri Janssen
 * Unit test suite for the User class.
 */
describe('Unit Tests: User', () => {
    describe('Email test cases', () => {
        it('should correctly validate an email with single character', () => {
            const user = User.createUser('t@t.com', 'Valid123@', Roles.USER, 1);
            const validationErrors = user.validateUser();
            expect(validationErrors).to.be.null;
        });

        it('should correctly validate a valid email with maximum allowed characters', () => {
            const maxLocalPart = 'x'.repeat(308); // Max allowed length for local part including "@example.com"
            const validEmail = maxLocalPart + '@example.com';
            const user = User.createUser(
                validEmail,
                'Valid123@',
                Roles.USER,
                1
            );
            const validationErrors = user.validateUser();
            expect(validationErrors).to.be.null;
        });

        it('should correctly validate an email with uppercase or lowercase', () => {
            const user = User.createUser(
                'TeSt@tEsT.com',
                'Valid123@',
                Roles.USER,
                1
            );
            const validationErrors = user.validateUser();
            expect(validationErrors).to.be.null;
        });

        it('should correctly validate an email with valid special characters', () => {
            const user = User.createUser(
                'e-mail@e-mail.com',
                'Valid123@',
                Roles.USER,
                1
            );
            const validationErrors = user.validateUser();
            expect(validationErrors).to.be.null;
        });

        it('should correctly validate an email with multiple sub-domains', () => {
            const user = User.createUser(
                'mail@mail.uk.co',
                'Valid123@',
                Roles.USER,
                1
            );
            const validationErrors = user.validateUser();
            expect(validationErrors).to.be.null;
        });

        it('should correctly validate an email with Non-ASCII Characters', () => {
            const user = User.createUser(
                'hlló@hélló.com',
                'Valid123@',
                Roles.USER,
                1
            );
            const validationErrors = user.validateUser();
            expect(validationErrors).to.deep.equal(['Invalid email']);
        });

        it('should correctly validate an email with whitespaces or empty values', () => {
            const user = User.createUser(
                't e@y o.com',
                'Valid123@',
                Roles.USER,
                1
            );
            const validationErrors = user.validateUser();
            expect(validationErrors).to.deep.equal(['Invalid email']);
        });

        it('should correctly validate an email with quotes', () => {
            const user = User.createUser(
                '"user.name@example.com"',
                'Valid123@',
                Roles.USER,
                1
            );
            const validationErrors = user.validateUser();
            expect(validationErrors).to.deep.equal(['Invalid email']);
        });

        it('should correctly validate an email with invalid special characters', () => {
            const user = User.createUser(
                'hallo@ik@ben.com',
                'Valid123@',
                Roles.USER,
                1
            );
            const validationErrors = user.validateUser();
            expect(validationErrors).to.deep.equal(['Invalid email']);
        });

        it('should correctly validate an email with invalid dot placement', () => {
            const user = User.createUser(
                'user..me@mail.com',
                'Valid123@',
                Roles.USER,
                1
            );
            const validationErrors = user.validateUser();
            expect(validationErrors).to.deep.equal(['Invalid email']);
        });
    });

    describe('Password test cases', () => {
        it('should correctly validate a valid password', async () => {
            const user = User.createUser(
                'test@example.com',
                'Test12345!',
                Roles.USER,
                1
            );
            const validationErrors = user.validateUser();
            expect(validationErrors).to.be.null;
        });

        it('should correctly validate a password with the minimum required characters', async () => {
            const user = User.createUser(
                'test@example.com',
                'Test123!',
                Roles.USER,
                1
            );
            const validationErrors = user.validateUser();
            expect(validationErrors).to.be.null;
        });

        it('should correctly validate a password with the maximum allowed characters', () => {
            const user = User.createUser(
                'test@example.com',
                'Test12345!Test12345!Test12345!12',
                Roles.USER,
                1
            );
            const validationErrors = user.validateUser();
            expect(validationErrors).to.be.null;
        });

        it('should correctly validate an empty password', () => {
            const user = User.createUser(
                'test@example.com',
                ' ',
                Roles.USER,
                1
            );
            const validationErrors = user.validateUser();
            expect(validationErrors).to.deep.equal(['Invalid password']);
        });

        it('should correctly validate a password without uppercase', () => {
            const user = User.createUser(
                'test@example.com',
                'test123!',
                Roles.USER,
                1
            );
            const validationErrors = user.validateUser();
            expect(validationErrors).to.deep.equal(['Invalid password']);
        });

        it('should correctly validate a password without lowercase', () => {
            const user = User.createUser(
                'test@example.com',
                'TEST123!',
                Roles.USER,
                1
            );
            const validationErrors = user.validateUser();
            expect(validationErrors).to.deep.equal(['Invalid password']);
        });

        it('should correctly validate a password without special character', () => {
            const user = User.createUser(
                'test@example.com',
                'Test1234',
                Roles.USER,
                1
            );
            const validationErrors = user.validateUser();
            expect(validationErrors).to.deep.equal(['Invalid password']);
        });

        it('should correctly validate a password without a number', () => {
            const user = User.createUser(
                'test@example.com',
                'Testttt!',
                Roles.USER,
                1
            );
            const validationErrors = user.validateUser();
            expect(validationErrors).to.deep.equal(['Invalid password']);
        });

        it('should hash a password successfully', async () => {
            const plainPassword = 'Test123!';

            const hashedPassword = await User.hashPassword(plainPassword);
            expect(hashedPassword).to.be.a('string');
        });
    });
});
