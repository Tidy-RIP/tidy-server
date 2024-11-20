import { Router } from "express";
import {
  getActivities,
  createActivityCtrl,
  updateActivityCtrl,
  deleteActivityCtrl,
  getActivitiesById,
  getAllActivitiesCtrl,
} from "../controller/activitiesController.js";
import { activitiesSchema } from "../schemas/activitiesSchema.js";
import { validationsZod } from "../../../middlewares/validationsZod.js";

import validateJwt from "../../auth/middleware/validateJwt.js";
import logEndpointAccess from "../../logger/middleware/loggerMiddleware.js";

const activitiesRoutes = Router();

activitiesRoutes.get(
  "/activities",
  logEndpointAccess("/activities"),
  validateJwt,
  getAllActivitiesCtrl
);
// Ruta para obtener una actividad por id
activitiesRoutes.get(
  "/subjects/:id/activities/:idActivity",
  logEndpointAccess("/subjects/:id/activities/:idActivity"),
  validateJwt,
  getActivitiesById
);

// Ruta para obtener todas las actividades de una materia específica
activitiesRoutes.get(
  "/subjects/:id/activities",
  logEndpointAccess("/subjects/:id/activities"),
  validateJwt,
  getActivities
);

// Ruta para crear una nueva actividad en una materia específica
activitiesRoutes.post(
  "/subjects/:id/activities",
  logEndpointAccess("/subjects/:id/activities"),
  validateJwt,
  validationsZod(activitiesSchema),
  createActivityCtrl
);

// Ruta para actualizar una actividad existente
activitiesRoutes.put(
  "/subjects/:id/activities/:idActivity",
  logEndpointAccess("/subjects/:id/activities/:idActivity"),
  validateJwt,
  validationsZod(activitiesSchema),
  updateActivityCtrl
);

// Ruta para eliminar una actividad existente
activitiesRoutes.delete(
  "/subjects/:id/activities/:idActivity",
  logEndpointAccess("/subjects/:id/activities/:idActivity"),
  validateJwt,
  deleteActivityCtrl
);

export default activitiesRoutes;
