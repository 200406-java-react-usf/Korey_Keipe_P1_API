import express from 'express';
import Appconfig from '../config/app.js';
import { adminGuard, managerGuard } from '../middleware/auth-middleware';

export const ReimbRouter = express.Router();

const ReimbService = Appconfig.reimbService;

ReimbRouter.get('', async (req, res) => {
	try{
		let payload = await ReimbService.getAllReimbs();
		return res.status(200).json(payload);
	}catch (e) {
		return res.status(e.status).json(e);
	}
});

ReimbRouter.get('/:id', async (req,res)=>{ //managerGuard,
	const id = +req.params.id;
	try{
		let payload = await ReimbService.getReimbById(id);	
		return res.status(200).json(payload);
	}catch(e){
		return res.status(e.status).json(e);
	}
});

ReimbRouter.post('', async (req, res) => {

	try{		
		let payload = await ReimbService.saveReimb(req.body);
		return res.status(201).json(payload);
	}catch (e) {		
		return res.status(e.status).json(e);
	}
});

ReimbRouter.delete('/:id', adminGuard, async (req, res) => {
	const id = +req.params.id;
	try{
		let payload = await ReimbService.deleteReimbById(id);
		return res.status(202).json(payload);
	}catch (e) {
		return res.status(e.status).json(e);
	}
});

ReimbRouter.put('', adminGuard, async (req, res) => {

	try{
		let payload = await ReimbService.updateReimb(req.body);
		return res.status(202).json(payload);
	}catch (e) {
		return res.status(e.status).json(e);
	}
});