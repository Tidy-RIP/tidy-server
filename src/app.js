import express from "express";
import expressPinoLogger from "pino-http";
import logger from "./modules/logger/config.js";
import path from "path";

import authRouter from "./modules/auth/routes/authRoutes.js";
import activitiesRoutes from "./modules/activities/routes/activitiesRoute.js";
import subjectRoute from "./modules/subjects/routes/subjectRoute.js";
import subtaskRoute from "./modules/activities/routes/subtasksRoute.js";
import noteRoute from "./modules/notes/routes/noteRoute.js";
import uploadRoute from "./modules/upload/routes/uploadRoute.js";

import { initMiddleware } from "./middlewares/index.js";
import { PORT } from "./config/env.js";
import { swaggerUi, swaggerDocument } from "./config/swaggerConfig.js";
import { showLogo } from "./modules/logger/showLogo.js";

const app = express();
const expressLogger = expressPinoLogger({ logger });

// Middleware
initMiddleware(app);
app.use(expressLogger);

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use("/", authRouter);
app.use("/", activitiesRoutes);
app.use("/", subjectRoute);
app.use("/", subtaskRoute);
app.use("/", noteRoute);
app.use("/", uploadRoute);
app.use("/upload", express.static(path.join(path.resolve(), "src", "uploads")));

//Server
app.listen(PORT, () => {
  showLogo();
  console.log(`http//localhost:${PORT}`);
});
