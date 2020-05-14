class AppError {

	message: string;
	reason: string;
	status: number;

	constructor(reason?: string, status?: number){
		this.message = 'An unexpected error has occured.';
		this.status = status;
		reason ? (this.reason = reason) : this.reason = 'Unknown reason';
	}

	setMessage(message: string){
		this.message = message;
	}
}

class DataNotFoundError extends AppError{
	constructor(reason?: string){
		super(reason, 404);
		super.setMessage('Error: No data was found');
	}
}

class InvalidRequestError extends AppError{
	constructor(reason?: string){
		super(reason, 400);
		super.setMessage('Error: Invalid Request');
	}
}
class ConflictError extends AppError{
	constructor(reason?: string){
		super(reason, 409);
		super.setMessage('Error: Conflicting Resource');
	}
}

class AuthenticationError extends AppError{
	constructor(reason?: string){
		super(reason, 401);
		super.setMessage('Error: Authentication Failed');
	}
}

class InternalServerError extends AppError{
	constructor(reason?: string){
		super(reason, 500);
		super.setMessage('An unexpected error has occured');
	}
}

class AuthorizationError extends AppError {
	constructor(reason?: string){
		super(reason, 500);
		super.setMessage('You do not have permission to access this content');
	}
}

export {
	DataNotFoundError,
	AuthenticationError,
	InvalidRequestError,
	ConflictError,
	InternalServerError,
	AuthorizationError
};