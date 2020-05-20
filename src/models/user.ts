export class User {

	user_id: number;
	username: string;
	password: string;
	first_name: string;
	last_name: string;
	email: string;
	role_id: number;

	constructor(id: number, un: string, pw: string, fn: string, ln: string, email: string, role_id: number){

		this.user_id = id;
		this.username = un;
		this.password = pw;
		this.first_name = fn;
		this.last_name = ln;
		this.email = email;
		this.role_id = role_id;

	}
}