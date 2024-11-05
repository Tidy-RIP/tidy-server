import { Activities } from '../models/activitiesModel.js';
import { Subtasks } from '../models/subtasksModel.js';
import { sequelize } from '../../../config/databases.js';
import { findSubtasksByActivityId, generateSubtasks } from './subtasksService.js';

import createError from '../../../helpers/createError.js';
import logger from '../../logger/config.js';

const OPTION_1 = 'Option 1';
const OPTION_2 = 'Option 2';

/**
 * Busca una actividad por su ID.
 * @param {number} activityId - ID de la actividad.
 * @returns {Promise<Object>} - Actividad encontrada.
 * @throws {Error} - Si la actividad no es encontrada.
 */
export const findActivityById = async activityId => {
  try {
    logger.info(`Buscando la actividad con id: ${activityId}`);
    const activity = await Activities.findOne({ where: { id: activityId } });

    if (!activity) {
      logger.info(`La actividad con id: ${activityId} no se encontro `);
      throw createError('Actividad no encontrada', 404);
    }

    return activity;
  } catch (error) {
    logger.error(`Error al buscar la actividad con id ${activityId}. Su error es: ${error.message}`);
    throw createError('Error al encontrar la actividad', error.statusCode || 500);
  }
};

/**
 * Busca todas las actividades de una materia por su ID.
 * @param {number} subjectId - ID de la materia.
 * @returns {Promise<Array>} - Lista de actividades.
 * @throws {Error} - Si ocurre un error al buscar las actividades.
 */
export const findActivitiesBySubjectId = async subjectId => {
  try {
    logger.info(`Buscando actividades para la materia con id: ${subjectId}`);

    const activities = await Activities.findAll({
      where: { subject_id: subjectId },
    });

    if (!activities || activities.length === 0) {
      logger.info(`No se encontraron actividades para la materia con id: ${subjectId}`);
      throw createError('No se encontraron actividades', 404);
    }

    return activities;
  } catch (error) {
    logger.error(`Error al buscar actividades para la materia con id: ${subjectId}. Su error es: ${error.stack}`);
    throw createError('Error al buscar actividades', error.statusCode || 500);
  }
};

/**
 * Crea una nueva actividad con subtareas.
 * @param {Object} activityData - Datos de la actividad.
 * @param {string} option - Opción para crear subtareas.
 * @returns {Promise<Object>} - Actividad creada.
 * @throws {Error} - Si ocurre un error al crear la actividad.
 */
export const createActivityWithSubtasks = async (activityData, option) => {
  const transaction = await sequelize.transaction();
  try {
    // Validamos los datos de entrada
    if (!activityData) {
      throw createError('Datos de la actividad inválida', 400);
    }

    if (option && ![OPTION_1, OPTION_2].includes(option)) {
      throw createError('Opcion no valida', 400);
    }

    const newActivity = await Activities.create(activityData, { transaction });
    const subtasks = generateSubtasks(activityData, newActivity.id, option);

    if (subtasks.length > 0) {
      await Subtasks.bulkCreate(subtasks, { transaction });
    }

    await transaction.commit();
    return newActivity;
  } catch (error) {
    await transaction.rollback();

    logger.error(`Error al crear la actividad con subtareas: ${error}`);
  }
};

/**
 * Actualiza una actividad existente.
 * @param {number} activityId - ID de la actividad.
 * @param {Object} activityData - Datos a actualizar.
 * @returns {Promise<Object>} - Actividad actualizada.
 * @throws {Error} - Si ocurre un error al actualizar la actividad.
 */
export const updateActivity = async (activityId, activityData, option) => {
  const transaction = await sequelize.transaction();
  try {
    // Validamos los datos de entrada
    if (!activityData) {
      throw createError('Datos de la actividad inválida', 400);
    }

    if (option && ![OPTION_1, OPTION_2].includes(option)) {
      throw createError('Opción no válida', 400);
    }

    const updatedActivity = await Activities.update(activityData, {
      where: { id: activityId },
      transaction,
      returning: true,
    });

    const subtasks = generateSubtasks(activityData, activityId, option);

    if (subtasks.length > 0) {
      await Subtasks.destroy({ where: { actividad_id: activityId }, transaction });
      await Subtasks.bulkCreate(subtasks, { transaction });
    }

    await transaction.commit();
    return updatedActivity[1][0]; // Retorna la actividad actualizada
  } catch (error) {
    await transaction.rollback();

    logger.error(`Error al actualizar la actividad con subtareas: ${error}`);
    throw error;
  }
};

/**
 * Servicio para eliminar una actividad.
 * @param {string} activityId - ID de la actividad.
 * @returns {Promise<void>}
 * @throws {Error} - Si ocurre un error al eliminar la actividad.
 */
export const deleteActivity = async activityId => {
  const transaction = await sequelize.transaction();

  try {
    logger.info(`Eliminando actividad con id: ${activityId}`);
    const activity = await findActivityById(activityId, { transaction });

    if (!activity) {
      logger.info(`La actividad con id: ${activityId} no se encontró`);
      throw createError('Actividad no encontrada', 404);
    }

    logger.info(`Buscando subtareas para la actividad con id: ${activityId}`);
    const subtasks = await findSubtasksByActivityId(activityId, { transaction });

    if (subtasks.length > 0) {
      logger.info(`Eliminando ${subtasks.length} subtareas asociadas a la actividad con id: ${activityId}`);
      await Promise.all(subtasks.map(subtask => subtask.destroy({ transaction })));
    }

    await activity.destroy({ transaction });
    await transaction.commit();
    logger.info(`Actividad con id: ${activityId} eliminada exitosamente junto con sus subtareas`);
  } catch (error) {
    await transaction.rollback();
    logger.error(`Error al eliminar actividad con id: ${activityId}. Su error es: ${error.message}`);
    throw createError('Error al eliminar la actividad', error.statusCode || 500);
  }
};
