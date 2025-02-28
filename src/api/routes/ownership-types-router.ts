import express, { Request, Response } from 'express';

import { OWNERSHIP_TYPES } from '../data';

export const ownershipTypesRouter = express.Router();

ownershipTypesRouter.get('/', (req: Request, res: Response) => {
	return res.json({ data: OWNERSHIP_TYPES });
});
