import { Request, Response } from "express";
import { AuthenticationError, AuthorizationError } from "../errors/errors";

/**
 * adds authorization protection to endpoints when used as middleware
 * @param req request object
 * @param res response object
 * @param next next
 */
export const adminGuard = (req: Request, res: Response, next) => {

	if (!req.session.principal) {
		res.status(401).json(new AuthenticationError('No session found! Please login.'));
	} else if (req.session.principal.role_id === 1) {
		next();
	} else {
		res.status(403).json(new AuthorizationError());
	}

};

export const managerGuard = (req: Request, res: Response, next) => {

	if (!req.session.principal) {
		res.status(401).json(new AuthenticationError('No session found! Please login.'));
	} else if (req.session.principal.role_id === 2) {
		next();
	} else {
		res.status(403).json(new AuthorizationError());
	}

};