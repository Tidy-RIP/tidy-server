import { Router } from "express";
import {
  subtasksByIdCtrl,
  updateSubtasksCtrl,
  getSubtasks,
  deleteSubtaskCtrl,
  deleteAllSubtaskCtrl,
} from "../controller/subtasksController.js";

import logEndpointAccess from "../../logger/middleware/loggerMiddleware.js";
import validateJwt from "../../auth/middleware/validateJwt.js";

const subtaskRoute = Router();

// Definir la ruta para obtener una subtarea por su ID
subtaskRoute.get(
  "/subjects/:idSubject/activities/:idActivity/subtasks/:idSubtask",
  logEndpointAccess(
    "/subjects/:idSubject/activities/:idActivity/subtasks/:idSubtask"
  ),
  validateJwt,
  subtasksByIdCtrl
);

subtaskRoute.get(
  "/subtasks/:idActivity",
  logEndpointAccess("/subtasks/:idActivity"),
  validateJwt,
  getSubtasks
);

// Definir la ruta para actualizar una subtarea por su ID
subtaskRoute.put(
  "/activities/:idActivity/subtasks/:idSubtask",
  logEndpointAccess("/activities/:idActivity/subtasks/:idSubtask"),
  validateJwt,
  updateSubtasksCtrl
);

subtaskRoute.delete(
  "/activities/:idActivity/subtasks/:idSubtask",
  logEndpointAccess("/activities/:idActivity/subtasks/:idSubtask"),
  validateJwt,
  deleteSubtaskCtrl
);

subtaskRoute.delete(
  "/activities/:idActivity/subtasks",
  logEndpointAccess("/activities/:idActivity/subtasks"),
  validateJwt,
  deleteAllSubtaskCtrl
);
 
 export default subtaskRoute;
