import { User } from '../models/user';
import { CrudRepository } from './crud-repo';
import { PoolClient } from 'pg';
import { connectionPool } from '..';
import { InternalServerError } from '../errors/errors';

export class UserRepository implements CrudRepository<User> {

	baseQuery = `
		select
				user_id,
				username,
				password,
				first_name,
				last_name,
				email,
				role_id
		from Users
	`;

async getAll(): Promise<User[]> {
	
	let client: PoolClient;
	try{
		client = await connectionPool.connect();
		let sql = `select * from Users order by user_id`;
		let rs = await client.query(sql);
		return rs.rows;
	} catch (e) {
		throw new InternalServerError('Internal Server Error');
	} finally {
		client && client.release();
	}
}

/**
	 * retrieve user by specific id from database 
	 * @param {string} id - unique id of desired user.
	 */
async getById(id: number): Promise<User> {
	let client: PoolClient;
		try{
			client = await connectionPool.connect();
			let sql = `${this.baseQuery} where user_id = $1`;
			let rs = await client.query(sql, [id]);
			return rs.rows[0];
		} catch (e){
			throw new InternalServerError(`No user found with id:${id}`);
		}finally{
			client && client.release();
		}	
}

	async save(newUser: User): Promise<User>{

		let client: PoolClient;		

		try {												
			client = await connectionPool.connect();
			let sql = `insert into Users (username, password, first_name, last_name, email, role_id) values ($1, $2, $3, $4, $5, $6) returning user_id`;
			let rs = await client.query(sql, [newUser.username, newUser.password, newUser.firstName, newUser.lastName, newUser.email, +newUser.role_id]);					
			newUser.user_id = rs.rows[0].id;
			return newUser;
		} catch (e) {	
			throw new InternalServerError('Save Failed');
		} finally {
			client && client.release();
		}
	}

	/**
	 * update elements of a user when provided an updated user object 
	 * @param {string} updatedUser - User object with updated perameters.
	 */
	async update(updatedUser: User): Promise<boolean>{

		let client: PoolClient;

		try {
			client = await connectionPool.connect();
			let sql = `update Users set username = $2, password = $3, first_name = $4, last_name = $5, email = $6, role_id = $7 where user_id = $1`;
			await client.query(sql , [+updatedUser.user_id, updatedUser.username, updatedUser.password, updatedUser.firstName, updatedUser.lastName, updatedUser.email, +updatedUser.role_id]);
			return true;
		} catch (e) {
			console.log(e);
			
			throw new InternalServerError();
		} finally {
			client && client.release();
		}
	}

	/**
	 * delete a user when provided a valid user id
	 * @param {string} id - unique id of desired user.
	 */
	async deleteById(id: number): Promise<boolean>{

		let client: PoolClient;
			
		try {			
			client = await connectionPool.connect();			
			let sql = `delete from Users where user_id = $1`;
			await client.query(sql , [id]);			
			return true;
		} catch (e) {
			throw new InternalServerError();
		} finally {
			client && client.release();
		}
	}

	/**
	 * retrieve a user when provided a specific username 
	 * @param {string} username - parameter of a user object.
	 */
	async getByUsername(username: string): Promise<User> {

		let client: PoolClient;
		
		try {
			client = await connectionPool.connect();
			let sql = `${this.baseQuery} where username = $1`;			
			let rs = await client.query(sql, [username]);
			return rs.rows[0];
		} catch (e) {
			throw new InternalServerError();
		} finally {
			client && client.release();
		}
	}

	/**
	 * retrieve a user when provided a specific email 
	 * @param {string} email - parameter of a user object.
	 */
	async getByEmail(email: string): Promise<User> {

		let client: PoolClient;

		try {
			client = await connectionPool.connect();
			let sql = `${this.baseQuery} where email = $1`;			
			let rs = await client.query(sql, [email]);	
			return rs.rows[0];
		} catch (e) {
			throw new InternalServerError();
		} finally {
			client && client.release();
		}
	}

	/**
	 * retrieve a user by a provide key value pair 
	 * @param {string} key - parameter of a user object.
	 * @param {string} val - value of a parameter (key).
	 */
	async getUserByUniqueKey(key: string, val: string): Promise<User> {

		let client: PoolClient;

		try{
			client = await connectionPool.connect();
			let sql = `${this.baseQuery} where ${key} = $1`;
			let rs = await client.query(sql, [val]);
			return rs.rows[0];
		} catch (e) {
			throw new InternalServerError();  
		} finally {
			client && client.release();
		} 
	}
}
