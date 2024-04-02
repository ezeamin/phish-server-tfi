import express from 'express';

import { Register } from '../../controllers/register/index.js';

export const registerRouter = express.Router();

// GET ----------------------------
registerRouter.get(
  '/image',
  // Add certain validation, so not anyone can hit the endpoint
  Register.GetController.getImage,
);

// POST ---------------------------
registerRouter.post(
  '/person',
  // Add certain validation, so not anyone can hit the endpoint
  Register.PostController.postNewPerson,
);
registerRouter.post(
  '/link',
  // Add certain validation, so not anyone can hit the endpoint
  Register.PostController.postLinkOpened,
);
registerRouter.post(
  '/form',
  // Add certain validation, so not anyone can hit the endpoint
  Register.PostController.postFormSubmitted,
);
