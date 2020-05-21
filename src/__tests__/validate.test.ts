  
import validation from "../util/validation";


describe('validation', () => {

	let sut = validation;

	test('should return false when validateString is given an invalid string', async () => {
		// Arrange
		expect.hasAssertions();

		// Act
		let result = await sut.validateString('');

		// Assert
		expect(result).toBe(false);
	});

	test('should return false when isPropertyOf is given falsy property', async () => {
		// Arrange
		expect.hasAssertions();

		// Act
		let result = await sut.isPropertyOf('', 'string');

		// Assert
		expect(result).toBe(false);
	});
});