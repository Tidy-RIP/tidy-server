import express from 'express';
import expressPinoLogger from 'pino-http';
import logger from './modules/logger/config.js';

import authRouter from './modules/auth/routes/authRoutes.js';
import activitiesRoutes from './modules/activities/routes/activitiesRoute.js';
import subjectRoute from './modules/subjects/routes/subjectRoute.js';
import subtaskRoute from './modules/activities/routes/subtasksRoute.js';

import { initMiddleware } from './middlewares/index.js';
import { PORT } from './config/env.js';
import { swaggerUi, swaggerDocument } from './config/swaggerConfig.js';
import { showLogo } from './modules/logger/showLogo.js';
import noteRoute from './modules/notes/routes/noteRoute.js';

const app = express();
const expressLogger = expressPinoLogger({ logger });

// Middleware
initMiddleware(app);
app.use(expressLogger);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/', authRouter);
app.use('/', activitiesRoutes);
app.use('/', subjectRoute);
app.use('/', subtaskRoute);
app.use('/', noteRoute);

//Server
app.listen(PORT, () => {
  showLogo();
  console.log(`http//localhost:${PORT}`);
});
