export class Principal {

	user_id: number;
	username: string;
	role_id: number;

	constructor(id: number, un: string, role_id: number) {
		this.user_id = id;
		this.username = un;
		this.role_id = role_id;
	}
}