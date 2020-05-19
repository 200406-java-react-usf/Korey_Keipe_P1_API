import { ReimbRepository } from '../repos/reimb-repo';
import { Reimbursements as Reimb} from '../models/reimbursement';
import {InvalidRequestError, 
		DataNotFoundError 
} from '../errors/errors';
import { validateObj, 
		validateId 
} from '../util/validation';

export class ReimbService {
	
	constructor(private reimbRepo: ReimbRepository){
		this.reimbRepo = reimbRepo;
	}

	async getAllReimbs(): Promise<Reimb[]> {
		
		let reimbs = await this.reimbRepo.getAll();
	
		if (reimbs.length == 0){
			throw new DataNotFoundError('No reimbursements found');
		}

		return reimbs;
	}

	async getReimbById(id): Promise<Reimb> {

		if(!validateId(id)){
			throw new InvalidRequestError('Invalid Id');
		}

		let reimb = await this.reimbRepo.getById(id); 
		
		if(!validateObj(reimb, 'resolved','resolver_id')){
			throw new DataNotFoundError(`No user was found with id: ${id}`);
		}

		return reimb;

	}

	async saveReimb(newReimb: Reimb): Promise<Reimb>{
	
		if(!validateObj(newReimb, 'id', 'submitted', 'resolved', 'resolver_id')){
			throw new InvalidRequestError('Entry is not valid')
		}

		const storedReimb = await this.reimbRepo.save(newReimb);

		return storedReimb;
	}	

	async deleteReimbById(id: number): Promise<boolean> {

		if(!validateId(id)){
			throw new InvalidRequestError('Invalid Id');
		}
		
		await this.reimbRepo.deleteById(id);

		return true;

	}

	async updateReimb(updReimb: Reimb): Promise<boolean> {

		if(!validateObj(updReimb, 'resolved','resolver_id')){
			throw new InvalidRequestError('Entry is not valid')
		}

		await this.reimbRepo.update(updReimb);

		return true;

	}
}