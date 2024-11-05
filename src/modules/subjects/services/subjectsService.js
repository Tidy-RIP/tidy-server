import { Subjects } from '../models/subjectModel.js';
import logger from '../../logger/config.js';
import createError from '../../../helpers/createError.js';

/**
 * Busca una materia por su ID y el ID del usuario.
 * @param {number} subjectId - ID de la materia.
 * @param {number} userId - ID del usuario.
 * @returns {Promise<Object>} - Materia encontrada.
 * @throws {Error} - Si la materia no es encontrada.
 */
export const findSubjectByIdAndUserId = async (subjectId, userId) => {
  try {
    logger.info(`Buscando materia con id: ${subjectId} y al usuario con id: ${userId}`);

    const subject = await Subjects.findOne({
      where: { id: subjectId, userId },
    });

    if (!subject) {
      logger.error(`La materia con id: ${subjectId} no se encontro`);
      throw createError('Materia no encontrada', 404);
    }

    return subject;
  } catch (error) {
    logger.error(`Error al buscar materia con id: ${subjectId}. Su error es: ${error.message}`);
    throw createError('Ocurrio un error al obtener la materia', error.statusCode || 500);
  }
};

/**
 * Servicio para obtener todas las materias del usuario autenticado
 * @param {string} userId - ID del usuario autenticado
 * @returns {Promise<Array>} - Lista de materias
 * @throws {Error} - Si ocurre un error al obtener las materias
 */
export const getUserSubjects = async userId => {
  try {
    logger.info(`Obteniendo materias para el usuario con id: ${userId}`);
    const subjects = await Subjects.findAll({ where: { userId } });

    if (!subjects || subjects.length === 0) {
      logger.info(`No se encontraron materias para el usuario con id: ${userId}`);
      throw createError('No se encontraron materias', 404);
    }

    return subjects;
  } catch (error) {
    logger.error(`Error al obtener las materias para el usuario con id: ${userId}. Su error es: ${error.message}`);
    throw createError('Ocurrio un error al obtener las materias', error.statusCode || 500);
  }
};

/**
 * Servicio para crear una nueva materia para el usuario autenticado.
 * @param {string} userId - ID del usuario autenticado.
 * @param {Object} subjectData - Datos de la materia.
 * @param {string} subjectData.subjectName - Nombre de la materia.
 * @param {string} subjectData.description - Descripción de la materia.
 * @param {string} subjectData.name_teacher - Nombre del profesor.
 * @returns {Promise<Object>} - Materia creada.
 * @throws {Error} - Si ocurre un error al crear la materia.
 */
export const createSubject = async (userId, subjectData) => {
  try {
    const newSubject = await Subjects.create({ ...subjectData, userId });

    if (!newSubject) {
      logger.info(`Error al crear la materia para el usuario con id: ${userId}`);
      throw createError('Error al crear la materia', 400);
    }

    return newSubject;
  } catch (error) {
    logger.error(`Error al crear la materia para el usuario con id: ${userId}. Su error es: ${error.message}`);

    throw createError('Ocurrio un error al crear la materia', error.statusCode || 500);
  }
};

/**
 * Servicio para editar una materia del usuario autenticado
 * @param {string} userId - ID del usuario autenticado
 * @param {string} subjectId - ID de la materia a editar
 * @param {Object} subjectData - Datos actualizados de la materia
 * @returns {Promise<Object>} - Materia actualizada
 * @throws {Error} - Si ocurre un error al editar la materia
 */
export const updateSubject = async (userId, subjectId, subjectData) => {
  try {
    logger.info(`Editando materia con id: ${subjectId} para el usuario con id: ${userId}`);
    const subject = await findSubjectByIdAndUserId(subjectId, userId);

    if (!subject) {
      logger.info(`La materia con id: ${subjectId} no se encontró para el usuario con id: ${userId}`);
      throw createError('Materia no encontrada', 404);
    }

    Object.assign(subject, subjectData);
    await subject.save();

    return subject;
  } catch (error) {
    logger.error(`Error al editar la materia con id: ${subjectId}. Su error es: ${error.message}`);

    throw createError('Ocurrio un error al actualizar la materia', error.statusCode || 500);
  }
};

/**
 * Servicio para eliminar una materia del usuario autenticado
 * @param {string} userId - ID del usuario autenticado
 * @param {string} subjectId - ID de la materia a eliminar
 * @returns {Promise<void>}
 * @throws {Error} - Si ocurre un error al eliminar la materia
 */
export const deleteSubject = async (userId, subjectId) => {
  try {
    logger.info(`Eliminando materia con id: ${subjectId} para el usuario con id: ${userId}`);
    const subject = await findSubjectByIdAndUserId(subjectId, userId);

    if (!subject) {
      logger.info(`La materia con id: ${subjectId} no se encontro para el usuario con id: ${userId}`);
      throw createError('Materia no encontrada', 404);
    }

    await subject.destroy();
    return subject;
  } catch (error) {
    logger.error(`Error al eliminar la materia con id: ${subjectId}. Su error es: ${error.message}`);

    throw createError('Ocurrio un error al eliminar la materia', error.statusCode || 500);
  }
};
