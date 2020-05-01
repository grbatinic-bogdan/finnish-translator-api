import { getRandomInt } from './utils';

describe('utils test suite', () => {
    describe('test getRandomInt util function', () => {
        let result: number;
        describe('getRandomInt function works as expected', () => {
            const maxValue = 2;
            beforeEach(() => {
                result = getRandomInt(0, maxValue);
            });

            it('should assert that random integer is less than provided max value', () => {
                expect(result).toBeLessThanOrEqual(maxValue);
            });

            it('should assert that random integer is greater than 0', () => {
                expect(result).toBeGreaterThanOrEqual(0);
            });
        });
        describe('getRandomInt function throws an error', () => {
            it('should assert that random integer is less than provided max value', () => {
                expect(() => {
                    getRandomInt(('a' as unknown) as number, ('b' as unknown) as number);
                }).toThrowError();
            });
        });
    });
});
