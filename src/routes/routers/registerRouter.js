import express from 'express';

import { Register } from '../../controllers/register/index.js';
import { isAuthenticated } from '../../middleware/isAuthenticated.js';

export const registerRouter = express.Router();

// GET ----------------------------
registerRouter.get('/name', Register.GetController.getName);
registerRouter.get('/image', Register.GetController.getImage);

// POST ---------------------------
registerRouter.post('/person', Register.PostController.postNewPerson);
registerRouter.post(
  '/form',
  isAuthenticated,
  Register.PostController.postFormSubmitted,
);
