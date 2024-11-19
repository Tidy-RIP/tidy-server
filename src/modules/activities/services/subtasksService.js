import { Subtasks } from "../models/subtasksModel.js";

import createError from "../../../helpers/createError.js";
import logger from "../../logger/config.js";

const OPTION_1 = "Option-1";
const OPTION_2 = "Option-2";

export const createSubtasks = (activityData, activityId, index) => {
  return {
    titulo: `${activityData.titulo} - Subtarea ${index + 1}`,
    description: `${activityData.description}`,
    estado: `${activityData.estado}`,
    actividad_id: activityId,
  };
};

export const generateSubtasks = (activityData, activityId, option) => {
  const subtasks = [];
  let numSubtasks = 0;

  switch (option) {
    case OPTION_1:
      numSubtasks = Math.ceil(activityData.num_preguntas / 2);
      break;
    case OPTION_2:
      numSubtasks = activityData.num_preguntas * 2;
      break;
    default:
      createError("Opción no válida", 400);
  }

  for (let i = 0; i < numSubtasks; i++) {
    subtasks.push(createSubtasks(activityData, activityId, i));
  }

  return subtasks;
};

export const findSubtasksById = async (subtasksId) => {
  try {
    logger.info(`Buscando subtarea con id: ${subtasksId}`);
    const subtask = await Subtasks.findOne({ where: { id: subtasksId } });

    if (!subtask) {
      logger.info(`La subtarea con id: ${subtasksId} no se encontro`);
      throw createError("Subtarea no encontrada", 404);
    }

    return subtask;
  } catch (error) {
    logger.error(`Error al buscar la subtarea con id: ${subtasksId}`);

    throw createError(
      "Error en el servidor al buscar la subtarea",
      error.statusCode || 500
    );
  }
};

export const findSubtasksByActivityId = async (activityId) => {
  try {
    logger.info(`Buscando subtareas para la actividad con id: ${activityId}`);
    const subtasks = await Subtasks.findAll({
      where: { actividad_id: activityId },
    });

    if (!subtasks || subtasks.length === 0) {
      logger.info(
        `No se encontraron subtareas para la actividad con id: ${activityId}`
      );
      throw createError("No se encontraron subtareas", 404);
    }

    return subtasks;
  } catch (error) {
    logger.error(
      `Error al buscar subtareas para la actividad con id: ${activityId}`
    );

    throw createError(
      "Error en el servidor al buscar subtareas",
      error.statusCode || 500
    );
  }
};

export const updateSubtasks = async (subtasksId, updateData) => {
  try {
    logger.info(`Actualizando subtarea con id: ${subtasksId}`);
    const subtask = await findSubtasksById(subtasksId);

    if (!subtask) {
      throw createError("Subtarea no encontrada", 404);
    }

    await subtask.update(updateData);

    return { message: "Subtarea actualizada" };
  } catch (error) {
    logger.error(`Error al actualizar la subtarea con id: ${subtasksId}`);

    throw createError(
      "Error en el servidor al actualizar la subtarea",
      error.statusCode || 500
    );
  }
};

export const deleteSubtasks = async (subtasksId) => {
  try {
    logger.info(`Eliminando subtarea con id: ${subtasksId}`);
    const subtask = await findSubtasksById(subtasksId);

    if (!subtask) {
      throw createError("Subtarea no encontrada", 404);
    }

    await subtask.destroy();

    return { message: "Subtarea eliminada" };
  } catch (error) {
    logger.error(`Error al eliminar la subtarea con id: ${subtasksId}`);

    throw createError(
      "Error en el servidor al eliminar la subtarea",
      error.statusCode || 500
    );
  }
};

export const deleteAllSubtask = async (activityId) => {
  try {
    logger.info(`Eliminando subtareas para la actividad con id: ${activityId}`);
    const subtasks = await findSubtasksByActivityId(activityId);

    const deleteSubtask = await Subtasks.destroy({
      where: { actividad_id: activityId },
    });

    return deleteSubtask;
  } catch (error) {
    logger.error(
      `Error al eliminar las subtareas para la actividad con id: ${activityId}`
    );

    throw createError(
      "Error en el servidor al eliminar las subtareas",
      error.statusCode || 500
    );
  }
};
