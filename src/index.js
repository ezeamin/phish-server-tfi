import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import { mainRouter } from './routes/mainRouter.js';

console.clear(); // Clear any previous console logs
console.log('⌛ Inicializando servidor...');

// 1- Initialize server
const app = express();

// 2- Server configurations
const PORT = process.env.PORT || 5000;

// 3- Middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json()); // <== Parse body as JSON (otherwise "undefined")

// 4- Routes
app.use('/api/v1', mainRouter);

// 5- Server loop
app.listen(PORT, () => {
  console.log(`✅ Servidor iniciado -> Puerto ${PORT}\n`);
});
