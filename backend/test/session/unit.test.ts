import { expect } from 'chai';
import { Session } from '../../src/business/model/session';

/**
 * Unit tests for the session model.
 * @author Thijs van Rixoort
 */
describe('Unit Tests: Session', (): void => {
    describe('id test cases:', (): void => {
        it(`should create a 32-character session id if it was not provided`, (): void => {
            // Arrange
            const expected: number = 'x'.repeat(32).length;

            // Act
            const actual: number = new Session(1).id.length;

            // Assert
            expect(actual).to.equal(expected);
        });

        it(`should use a provided id`, (): void => {
            // Arrange
            const expected = 'x'.repeat(32);

            // Act
            const actual: string = new Session(1, expected).id;

            // Assert
            expect(actual).to.equal(expected);
        });

        it(`should not accept an id that is less than 32 characters long`, (): void => {
            // Arrange
            const expected = 'session id is not exactly 32 characters long.';

            // Act
            const actual: () => void = (): void => {
                new Session(1, 'x'.repeat(31));
            };

            // Assert
            expect(actual).to.throw(expected);
        });

        it(`should not accept an id that is more than 32 characters long`, (): void => {
            // Arrange
            const expected = 'session id is not exactly 32 characters long.';

            // Act
            const actual = (): void => {
                new Session(1, 'x'.repeat(33));
            };

            // Assert
            expect(actual).to.throw(expected);
        });
    });

    describe('expiration date test cases:', (): void => {
        it(`should create an expiration date two weeks from now if it was not provided`, (): void => {
            // Arrange
            const now: Date = new Date();
            const twoWeeksInDays = 14;
            now.setDate(now.getDate() + twoWeeksInDays);

            const expected: number = now.getDate();

            // Act
            const actual: number = new Session(1).expirationDate.getDate();

            // Assert
            expect(actual).to.equal(expected);
        });

        it(`should use a provided expiration date`, (): void => {
            // Arrange
            const id = 'x'.repeat(32);
            const expected: Date = new Date();
            const days = 7;

            expected.setDate(expected.getDate() + days);

            // Act
            const actual: Date = new Session(1, id, expected).expirationDate;

            // Assert
            expect(actual).to.deep.equal(expected);
        });

        it(`should not accept a provided expiration date if it is in the past`, (): void => {
            // Arrange
            const id = 'x'.repeat(32);
            const pastDate: Date = new Date('2023-11-06');

            const expected = 'session expiration date can not be in the past.';

            // Act
            const actual = (): void => {
                new Session(1, id, pastDate);
            };

            // Assert
            expect(actual).to.throw(expected);
        });
    });
});
