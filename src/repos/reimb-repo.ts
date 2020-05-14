import { Reimbursements as Reimb } from '../models/reimbursement';
import { CrudRepository } from './crud-repo';
import { PoolClient } from 'pg';
import { connectionPool } from '..';
import { InternalServerError } from '../errors/errors';

export class ReimbRepository implements CrudRepository<Reimb> {

	baseQuery = `
		select
				id,
				amount,
				submitted,
				resolved,
				description,
				author_id,
				resolver_id,
				status_id,
				type_id
		from Reimbursements
	`;

	async getAll(): Promise<Reimb[]> {
	
		let client: PoolClient;
		try{
			client = await connectionPool.connect();
			let sql = `${this.baseQuery} order by id`;
			let rs = await client.query(sql);
			return rs.rows;
		} catch (e) {			
			throw new InternalServerError('Internal Server Error');
		} finally {
			client && client.release();
		}
	}
	
		/**
		 * retrieve reimbursement by specific id from database 
		 * @param {string} id - unique id of desired reimbursement.
		 */
	async getById(id: number): Promise<Reimb> {
		let client: PoolClient;
			try{
				client = await connectionPool.connect();
				let sql = `${this.baseQuery} where id = $1`;
				let rs = await client.query(sql, [id]);
				return rs.rows[0];
			} catch (e){
				throw new InternalServerError(`No user found with id:${id}`);
			}finally{
				client && client.release();
			}	
	}
	
		async save(newReimb: Reimb): Promise<Reimb>{
	
			let client: PoolClient;		
	
			try {												
				client = await connectionPool.connect();
				let sql = `insert into Reimbursements (amount, submitted, resolved, description, author_id, resolver_id, status_id, type_id) values ($1, current_timestamp, null, $2, $3, null, $4, $5) returning id`;
				let rs = await client.query(sql, [newReimb.amount, newReimb.description, newReimb.author_id, newReimb.status_id, newReimb.type_id]);					
				newReimb.id = rs.rows[0].id;
				return newReimb;
			} catch (e) {				
				throw new InternalServerError('Save Failed');
			} finally {
				client && client.release();
			}
		}
	
		/**
		 * update elements of a reimbursement when provided an updated reimbursement object 
		 * @param {string} updReimb - Reimbursment object with updated perameters.
		 */
		async update(updReimb: Reimb): Promise<boolean>{
	
			let client: PoolClient;
	
			try {
				client = await connectionPool.connect();
				let sql = `update reimbursements set amount = $2, description = $3, resolver_id = $4, status_id = $5, type_id = $6 where id = $1`;
				await client.query(sql , [updReimb.id, updReimb.amount, updReimb.description, updReimb.resolver_id, updReimb.status_id, updReimb.type_id]);
				return true;
			} catch (e) {
				console.log(e);
				throw new InternalServerError('Update Failed');
			} finally {
				client && client.release();
			}
		}
	
		/**
		 * delete a reimbursement when provided a valid reimbursement id
		 * @param {string} id - unique id of desired reimbursement.
		 */
		async deleteById(id: number): Promise<boolean>{
	
			let client: PoolClient;
				
			try {			
				client = await connectionPool.connect();			
				let sql = `delete from Reimbursements where id = $1`;
				await client.query(sql , [id]);			
				return true;
			} catch (e) {
				throw new InternalServerError('Delete Failed');
			} finally {
				client && client.release();
			}
		}
	
		/**
		 * retrieve a reimbursement by a provide key value pair 
		 * @param {string} key - parameter of a reimbursement object.
		 * @param {string} val - value of a parameter (key).
		 */
		async getUserByUniqueKey(key: string, val: string): Promise<Reimb> {
	
			let client: PoolClient;
	
			try{
				client = await connectionPool.connect();
				let sql = `${this.baseQuery} where ${key} = $1`;
				let rs = await client.query(sql, [val]);
				return rs.rows[0];
			} catch (e) {
				throw new InternalServerError('Key Request Faild');  
			} finally {
				client && client.release();
			} 
		}
	}
