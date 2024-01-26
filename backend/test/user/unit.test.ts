import { expect } from 'chai';
import { Roles, User } from '../../src/business/model/user';

/**
 * Unit tests fo the session model.
 * @author Thijs van Rixoort
 */
describe('Unit Tests: User', () => {
    describe('password validation test cases:', () => {
        it(`should return true when the password is correct`, async () => {
            // Arrange
            const password = 'Strongpw123!@#';
            const user = User.createUserWithId(
                1,
                'thijs@gmail.com',
                await User.hashPassword(password),
                Roles.USER,
                1
            );

            const expected = true;

            // Act
            const actual: boolean = await user.validatePassword(password);

            // Assert
            expect(actual).to.equal(expected);
        });

        it(`should return false when the password is incorrect`, async () => {
            // Arrange
            const password = 'Strongpw123!@#';
            const user = User.createUserWithId(
                1,
                'thijs@gmail.com',
                await User.hashPassword(password),
                Roles.USER,
                1
            );

            const expected = false;

            // Act
            const actual: boolean = await user.validatePassword(
                password + 'WRONG'
            );

            // Assert
            expect(actual).to.equal(expected);
        });
    });
});
