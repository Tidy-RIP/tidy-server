import logger from '../../logger/config.js';
import { Users } from '../models/userModel.js';

/**
 * Recupera un usuario por su dirección de correo electrónico.
 *
 * @param {string} email - La dirección de correo electrónico del usuario a recuperar.
 * @returns {Promise<Object|null>} Una promesa que resuelve con el usuario si se encuentra, o null si no se encuentra.
 * @throws {Error} Si ocurrió un error en la consulta.
 */
export const getUserByEmail = async email => {
  try {
    const existsUser = await Users.findOne({ where: { email } });
    return existsUser;
  } catch (error) {
    logger.error(`Se encontró un error al buscar el usuario: ${error}`);
    throw error;
  }
};

/**
 * Crea un nuevo usuario.
 *
 * @param {Object} userData - Los datos del usuario.
 * @returns {Promise<Object>} Una promesa que resuelve con el usuario creado.
 */
export const createUser = async userData => {
  try {
    const newUser = await Users.create(userData);
    return newUser;
  } catch (error) {
    logger.error(`Se encontró un error al crear el usuario: ${error}`);
    throw error;
  }
};
