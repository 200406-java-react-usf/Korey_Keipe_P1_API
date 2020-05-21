import { ReimbService } from '../service/reimb-service';
import { DataNotFoundError, InvalidRequestError, ConflictError, AuthenticationError } from '../errors/errors';
import validation from '../util/validation';
import { Reimbursements as Reimb } from '../models/reimbursement';

jest.mock('../repos/reimb-repo', () => {

	return new class ReimbRepository {
		getAll = jest.fn();
		getById = jest.fn();
		save = jest.fn();
		update = jest.fn();
		deleteById = jest.fn();
	};
});

describe('ReimbService', () => {

	let sut: ReimbService;
	let mockRepo;

	let mockReimbs = [
		new Reimb (1, 20.25, new Date, new Date, 'some reimbursement', 1, 2, 1, 4),
		new Reimb (2, 120.65, new Date, new Date, 'some other reimbursement', 1, 2, 2, 2),
		new Reimb (3, 32.50, new Date, new Date, 'some more reimbursement', 1, 2, 3, 1)
	];

	beforeEach( () => {

		mockRepo = jest.fn(() => {
			return {
				getAll: jest.fn(),
				getById: jest.fn(),
				save: jest.fn(),
				update: jest.fn(),
				deleteById: jest.fn()
			};
		});

		sut = new ReimbService(mockRepo);

	});

	test('should return an array of reimbursments without passwords when getAllReimbs succesfully retrieves all from db', async () => {

		// Arrange
		expect.hasAssertions();
		mockRepo.getAll = jest.fn().mockReturnValue(mockReimbs);

		// Act
		let result = await sut.getAllReimbs();

		// Assert
		expect(result).toBeTruthy();
		expect(result.length).toBe(3);
	});

	test('should throw a DataNotFoundError when getAllReimbs fails to get any reimbursments from the database', async () => {

		// Arrange
		expect.hasAssertions();
		mockRepo.getAll = jest.fn().mockReturnValue([]);

		// Act
		try{
			await sut.getAllReimbs();
		} catch (e) {
		// Assert
			expect(e instanceof DataNotFoundError).toBeTruthy();
		}
	});

	test('should resolve a reimb when getReimbById is given a valid id that is in the database', async () => {

		// Arrange
		expect.hasAssertions();

		validation.validateId = jest.fn().mockReturnValue(true);

		mockRepo.getById = jest.fn().mockImplementation((id: number) => {
			return new Promise<Reimb>((resolve) => resolve(mockReimbs[id - 1]));
		});

		// Act
		let result = await sut.getReimbById(1);

		// Assert
		expect(result).toBeTruthy();
		expect(result.id).toBe(1);
	});

	test('should throw InvalidRequestError when getReimbById is provided a negative id value', async () => {

		// Arrange
		expect.hasAssertions();
		mockRepo.getById = jest.fn().mockReturnValue(false);

		// Act
		try {
			await sut.getReimbById(-1);
		} catch (e) {

			// Assert
			expect(e instanceof InvalidRequestError).toBe(true);
		}

	});

	test('should throw InvalidRequestError when getReimbById is given a of zero)', async () => {

		// Arrange
		expect.hasAssertions();
		mockRepo.getById = jest.fn().mockReturnValue(false);

		// Act
		try {
			await sut.getReimbById(0);
		} catch (e) {

			// Assert
			expect(e instanceof InvalidRequestError).toBe(true);
		}

	});

	test('should throw InvalidRequestError when getReimbById is given a of a decimal value)', async () => {

		// Arrange
		expect.hasAssertions();
		mockRepo.getById = jest.fn().mockReturnValue(false);

		// Act
		try {
			await sut.getReimbById(1.01);
		} catch (e) {

			// Assert
			expect(e instanceof InvalidRequestError).toBe(true);
		}

	});

	test('should return a newUser when saveUser is given a valid user object', async () => {

		// Arrange
		expect.hasAssertions();
		validation.validateObj = jest.fn().mockReturnValue(true);
		mockRepo.getByUsername = jest.fn().mockReturnValue(true);
		mockRepo.getByEmail = jest.fn().mockReturnValue(true);
		mockRepo.save = jest.fn().mockImplementation((newReimb: Reimb) => {
			return new Promise<Reimb>((resolve) => {
				mockReimbs.push(newReimb); 
				resolve(newReimb);
			});
		});
		// Act
		let result = await sut.saveReimb(new Reimb (4, 100.00, new Date, new Date, 'test', 1, 1, 2, 3));

		// Accert
		expect(result).toBeTruthy();
		expect(mockReimbs.length).toBe(4);

	});


});