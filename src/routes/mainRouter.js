import express from 'express';

import { registerRouter } from './routers/registerRouter.js';

export const mainRouter = express.Router();

mainRouter.use('/register', registerRouter);
