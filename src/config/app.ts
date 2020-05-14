import { UserService } from '../service/user-service';
import { UserRepository } from '../repos/user-repo';
import { ReimbRepository } from '../repos/reimb-repo';
import { ReimbService } from '../service/reimb-service.js';

const userRepo = new UserRepository();
const userService = new UserService(userRepo);

const reimbRepo = new ReimbRepository();
const reimbService = new ReimbService(reimbRepo);

export default {
	userService,
	reimbService
};