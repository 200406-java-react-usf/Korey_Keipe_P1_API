import { UserService } from '../service/user-service';
import { User } from '../models/user';
import { DataNotFoundError, InvalidRequestError, ConflictError, AuthenticationError } from '../errors/errors';
import validation from '../util/validation';

jest.mock('../repos/user-repo', () => {

	return new class UserRepository {
		getAll = jest.fn();
		getById = jest.fn();
		save = jest.fn();
		update = jest.fn();
		deleteById = jest.fn();
		getByUsername = jest.fn();
		getByEmail = jest.fn();
	};
});

describe('userService', () => {

	let sut: UserService;
	let mockRepo;

	let mockUsers = [
		new User (1, 'khkeipe', 'password', 'Korey', 'Keipe', 'kkeipe@gmail.com', 3),
		new User (2, 'fmanager', 'locked', 'Finance', 'Manager', 'locked@revature.com', 2),
		new User (3, 'admin', 'password', 'Admin', 'Access', 'secure@revature.com', 1),
	];

	beforeEach( () => {

		mockRepo = jest.fn(() => {
			return {
				getAll: jest.fn(),
				getById: jest.fn(),
				save: jest.fn(),
				update: jest.fn(),
				deleteById: jest.fn(),
				getByUsername: jest.fn(),
				getByEmail: jest.fn()
			};
		});

		sut = new UserService(mockRepo);

	});

	test('should return an array of users without passwords when getAllUser succesfully retrieves all users from db', async () => {

		// Arrange
		expect.hasAssertions();
		mockRepo.getAll = jest.fn().mockReturnValue(mockUsers);

		// Act
		let result = await sut.getAllUsers();

		// Assert
		expect(result).toBeTruthy();
		expect(result.length).toBe(3);
		result.forEach(value => expect(value.password).toBeUndefined());
	});

	test('should throw a DataNotFoundError when getAllUsers fails to get any users from the database', async () => {

		// Arrange
		expect.hasAssertions();
		mockRepo.getAll = jest.fn().mockReturnValue([]);

		// Act
		try{
			await sut.getAllUsers();
		} catch (e) {
		// Assert
			expect(e instanceof DataNotFoundError).toBeTruthy();
		}
	});

	test('should resolve a User when getUserById is given a valid id that is in the database', async () => {

		// Arrange
		expect.hasAssertions();

		validation.validateId = jest.fn().mockReturnValue(true);

		mockRepo.getById = jest.fn().mockImplementation((user_id: number) => {
			return new Promise<User>((resolve) => resolve(mockUsers[user_id - 1]));
		});

		// Act
		let result = await sut.getUserById(1);

		// Assert
		expect(result).toBeTruthy();
		expect(result.user_id).toBe(1);
	});

	test('should throw InvalidRequestError when getUserById is provided a negative id value', async () => {

		// Arrange
		expect.hasAssertions();
		mockRepo.getById = jest.fn().mockReturnValue(false);

		// Act
		try {
			await sut.getUserById(-1);
		} catch (e) {

			// Assert
			expect(e instanceof InvalidRequestError).toBe(true);
		}

	});

	test('should throw InvalidRequestError when getUserById is given a of zero)', async () => {

		// Arrange
		expect.hasAssertions();
		mockRepo.getById = jest.fn().mockReturnValue(false);

		// Act
		try {
			await sut.getUserById(0);
		} catch (e) {

			// Assert
			expect(e instanceof InvalidRequestError).toBe(true);
		}

	});

	test('should throw InvalidRequestError when getUserById is given a of a decimal value)', async () => {

		// Arrange
		expect.hasAssertions();
		mockRepo.getById = jest.fn().mockReturnValue(false);

		// Act
		try {
			await sut.getUserById(1.01);
		} catch (e) {

			// Assert
			expect(e instanceof InvalidRequestError).toBe(true);
		}

	});

	test('should throw InvalidRequestError when getUserById is given not a number)', async () => {

		// Arrange
		expect.hasAssertions();
		mockRepo.getById = jest.fn().mockReturnValue(false);

		// Act
		try {
			await sut.getUserById(NaN);
		} catch (e) {

			// Assert
			expect(e instanceof InvalidRequestError).toBe(true);
		}

	});

	test('should throw DataNotFoundError when getUserById is given a valid id that is not in the database', async () => {

		// Arrange
		expect.hasAssertions();
		mockRepo.getById = jest.fn().mockReturnValue(false);

		// Act
		try {
			await sut.getUserById(1104);
		} catch (e) {

			// Assert
			expect(e instanceof DataNotFoundError).toBe(true);
		}

	});

	// test('should return a newUser when saveUser is given a valid user object', async () => {

	// 	// Arrange
	// 	expect.hasAssertions();
	// 	validation.validateObj = jest.fn().mockReturnValue(true);
	// 	mockRepo.getByUsername = jest.fn().mockReturnValue(true);
	// 	mockRepo.getByEmail = jest.fn().mockReturnValue(true);
	// 	mockRepo.save = jest.fn().mockImplementation((newUser: User) => {
	// 		return new Promise<User>((resolve) => {
	// 			mockUsers.push(newUser); 
	// 			resolve(newUser);
	// 		});
	// 	});

	// 	// Act
	// 	let result = await sut.saveUser(new User (4, 'TestUser', 'password', 'first', 'last', 'test@user.com', 1));

	// 	// Accert
	// 	expect(result).toBeTruthy();
	// 	expect(mockUsers.length).toBe(4);

	// });

	// test('should throw ConflicError when saveUser is envoked and username is not unique', async () => {

	// 	// Arrange
	// 	expect.hasAssertions();
	// 	validation.validateObj = jest.fn().mockReturnValue(true);
	// 	validation.vaildateEmptyObj = jest.fn().mockReturnValue(false);
	// 	mockRepo.getByUsername = jest.fn().mockReturnValue(mockUsers[0]);
	// 	mockRepo.getByEmail = jest.fn().mockReturnValue({});

	// 	// Act
	// 	try {
	// 		await sut.saveUser(new User (4, 'KoreyKeipe', 'password', 'Korey', 'Keipe', 'test@user.com', 3));
	// 	} catch (e) {
	// 	// Accert			
	// 		expect(e instanceof ConflictError).toBe(true);
	// 	}
	// });

	test('should throw InvalidRequestError when saveUser is envoked and provided an invalid user', async () => {

		// Arrange
		expect.hasAssertions();
		validation.validateObj = jest.fn().mockReturnValue(false);
		validation.vaildateEmptyObj = jest.fn().mockReturnValue(false);
		mockRepo.getByUsername = jest.fn().mockReturnValue({});
		mockRepo.getByEmail = jest.fn().mockReturnValue({});

		// Act
		try {
			await sut.saveUser(new User (4, '', 'password', '', '', 'test@user.com', 2));
		} catch (e) {
		// Accert			
			expect(e instanceof InvalidRequestError).toBe(true);
		}
	});

	test('should return true when deleteById succesfully deletes a user', async () => {

		// Arrange
		expect.hasAssertions();
		validation.validateId = jest.fn().mockReturnValue(true);
		validation.isPropertyOf = jest.fn().mockReturnValue(true);
		mockRepo.deleteById = jest.fn().mockReturnValue(true);

		// Act
		let result = await sut.deleteUserById(1);
		console.log(result);
		
		// Accert
		expect(result).toBe(true);

	});

	// test('should return true when updateUser is envoked and given a valid user object', async () => {

	// 	// Arrange
	// 	expect.hasAssertions();
	// 	mockRepo.getByUsername = jest.fn().mockReturnValue(true);
	// 	mockRepo.getByEmail = jest.fn().mockReturnValue({});
	// 	mockRepo.update = jest.fn().mockReturnValue(true);

	// 	// Act
	// 	let result = await sut.updateUser(new User (1, 'KKeipe', 'password', 'korey', 'keipe', 'kkeipe@gmail.com', 1));

	// 	// Accert
	// 	expect(result).toBe(true);

	// });

	test('should throw InvalidRequestError when updateUser is envoked and given an invalid user object', async () => {

		// Arrange
		expect.hasAssertions();
		validation.validateObj = jest.fn().mockReturnValue(false);
		mockRepo.update = jest.fn().mockReturnValue(true);
		mockRepo.getByEmail = jest.fn().mockReturnValue(true);
		mockRepo.getByUsername = jest.fn().mockReturnValue(true);

		// Act
		try{
			await sut.updateUser(new User (1, '', '', '', '', 'kkeipe@gmail.com', 3));
		} catch (e) {
		// Accert
			expect(e instanceof InvalidRequestError).toBe(true);
		}
	});

	test('should throw InvalidRequestError when authentication is envoked and given an invalid username', async () => {

		// Arrange
		expect.hasAssertions();
		validation.validateString = jest.fn().mockReturnValue(false);
		validation.vaildateEmptyObj = jest.fn().mockReturnValue(true);
		mockRepo.getByUsername = jest.fn().mockReturnValue(true);

		// Act
		try{
			await sut.authentication('','password');
		} catch (e) {
		// Accert
			expect(e instanceof InvalidRequestError).toBe(true);
		}
	});

	// test('should throw AuthenticationError when authentication is envoked and given an invalid username', async () => {

	// 	// Arrange
	// 	expect.hasAssertions();
	// 	validation.validateString = jest.fn().mockReturnValue(true);
	// 	validation.vaildateEmptyObj = jest.fn().mockReturnValue(false);
	// 	mockRepo.getByUsername = jest.fn().mockReturnValue(true);

	// 	// Act
	// 	try{
	// 		await sut.authentication('','password');
	// 	} catch (e) {
	// 	// Accert
	// 		expect(e instanceof AuthenticationError).toBe(true);
	// 	}
	// });
});