import { expect } from 'chai';
import { IncomingDetailedBoat } from '../../src/business/model/boat-detailed';
/**
 * A few very simple tests on the boat-detailed model to check if urls meets a few requirements.
 * Not great tests, as it lacks a few edgecases, but they work!
 * @author Marcus K.
 */

/* I could throw these in the test helper, but it's not taking up too much space, so it's fine for now? */
describe('Boat Creation Unit Tests: IncomingDetailedBoat', (): void => {
    describe('URL Adress validation: Unit tests for permitting certain urls', (): void => {
        it('should not accept an empty string', async (): Promise<void> => {
            const url = '';

            const expected = 'moeten de WHATWG URL Standaard aanhouden';

            const actual: () => string = (): string => {
                return IncomingDetailedBoat.validateUrl(url);
            };

            expect(actual).to.throw(expected);
        });
        it('should not accept non-web urls', async (): Promise<void> => {
            const url = 'c:/';

            const expected = 'moeten de WHATWG URL Standaard aanhouden';

            const actual: () => string = (): string => {
                return IncomingDetailedBoat.validateUrl(url);
            };

            expect(actual).to.throw(expected);
        });
        /* Controvertial decision, as I should just implement it to allow relative urls too, but I feel like that's not really needed for now */
        it('should not accept urls without https://', async (): Promise<void> => {
            const url: string = 'a.a';

            const expected: string = 'moeten de WHATWG URL Standaard aanhouden';

            const actual: () => string = (): string => {
                return IncomingDetailedBoat.validateUrl(url);
            };

            expect(actual).to.throw(expected);
        });
        it('should accept and convert a basic functional url', async (): Promise<void> => {
            const url: string = 'https:a.a';

            const expected: string = 'https://a.a/';

            const actual: string = IncomingDetailedBoat.validateUrl(url);

            expect(actual).to.deep.equal(expected);
        });
        it('should accept and convert a basic functional url', async (): Promise<void> => {
            const url: string = 'https:a.a';

            const expected: string = 'https://a.a/';

            const actual: string = IncomingDetailedBoat.validateUrl(url);

            expect(actual).to.deep.equal(expected);
        });
        /* Should this be allowed? Unicode characters are forbidden as per the RFC on URLs, though urls with percent encoding exist */
        it('should accept and convert an url with Unicode characters', async (): Promise<void> => {
            const url: string = 'https://ko.wikipedia.org/wiki/위키백과';

            const expected: string =
                'https://ko.wikipedia.org/wiki/%EC%9C%84%ED%82%A4%EB%B0%B1%EA%B3%BC';

            const actual: string = IncomingDetailedBoat.validateUrl(url);

            expect(actual).to.deep.equal(expected);
        });
    });
});
