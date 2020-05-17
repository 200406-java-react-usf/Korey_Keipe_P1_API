import { UserRepository } from '../repos/user-repo.js';
import { User } from '../models/user.js';
import { DataNotFoundError,
	InvalidRequestError,
	ConflictError,
	AuthenticationError
} from '../errors/errors.js';
import {validateId,
	validateObj,
	isPropertyOf,
	vaildateEmptyObj,
	validateString
} from '../util/validation.js';

export class UserService {

	constructor(private userRepo: UserRepository) {
		this.userRepo = userRepo;
	}

	async getAllUsers(): Promise<User[]> {
		
		let users = await this.userRepo.getAll();
	
		if (users.length == 0){
			throw new DataNotFoundError('No users found in the database');
		}

		return users.map(this.passwordHide);
	}

	async getUserById(id): Promise<User> {

		if(!validateId(id)){
			throw new InvalidRequestError('Invalid Id');
		}

		let user = await this.userRepo.getById(id); 

		if(!validateObj(user)){
			throw new DataNotFoundError(`No user was found with id: ${id}`);
		}

		return this.passwordHide(user);

	}

	async saveUser(newUser: User): Promise<User>{
	
		if(!validateObj(newUser, 'user_id')){
			throw new InvalidRequestError('Entry is not valid')
		}		

		let usernameCheck = await this.userRepo.getUserByUniqueKey('username',newUser.username);
		let emailCheck = await this.userRepo.getUserByUniqueKey('email', newUser.email);
		
		if(usernameCheck || emailCheck){
			throw new ConflictError('Username and Email must be unique')
		}

		const storedUser = await this.userRepo.save(newUser);

		return this.passwordHide(storedUser);
	}	

	async deleteUserById(id: number): Promise<boolean> {

		if(!validateId(id)){
			throw new InvalidRequestError('Invalid Id');
		}
		
		await this.userRepo.deleteById(id);

		return true;

	}

	async updateUser(updatedUser: User): Promise<boolean> {

		if(!validateObj(updatedUser)){
			throw new InvalidRequestError('Entry is not valid')
		}

		let usernameCheck = await this.userRepo.getUserByUniqueKey('username', updatedUser.username);
		let emailCheck = await this.userRepo.getUserByUniqueKey('email', updatedUser.email);

		if(usernameCheck && updatedUser.user_id !== usernameCheck.user_id){
			throw new ConflictError('Username must be unique')
		}
		if(emailCheck && updatedUser.user_id !== emailCheck.user_id){
			throw new ConflictError('Email must be unique')
		}

		await this.userRepo.update(updatedUser);

		return true;

	}

	/**
	 * verify authentication of user to grant admin privliges
	 * @param username parameter of user object
	 * @param password parameter of user object
	 */
	async authentication(username: string, password: string): Promise<User> {

		if (!validateString(username, password)) {
			throw new InvalidRequestError('Error: Invalid credentials provided');
		}

		let authUser: User;
			
		authUser = await this.userRepo.getByUsername(username);

		if(authUser.password !== password){
			throw new InvalidRequestError('Invalid Password');
		}
			
		if (vaildateEmptyObj(authUser)) {
			throw new AuthenticationError('Authentication Failed.');
		}

		return this.passwordHide(authUser);

	}

	private passwordHide(user: User){
		let userCopy = {...user};
		delete userCopy.password;
		return userCopy;
	}
}