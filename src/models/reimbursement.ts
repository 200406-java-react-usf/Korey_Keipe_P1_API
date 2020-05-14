export class Reimbursements{

	id: number;
	amount: number;
	submitted: Date;
	resolved: Date;
	description: string;
	author_id: number;
	resolver_id: number;
	status_id: number;
	type_id: number;

	constructor(id: number,amt: number, sub: Date, res: Date, desc: string, auth: number, resolver: number, stat: number, type: number){

		this.id = id;
		this.amount = amt;
		this.submitted = sub;
		this.resolved = res;
		this.description = desc;
		this.author_id = auth;
		this.resolver_id = resolver;
		this.status_id = stat;
		this.type_id = type;
	}
}