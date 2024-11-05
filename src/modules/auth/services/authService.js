import bcrypt, { genSalt } from 'bcrypt';
import crypto from 'crypto';
import generateJwt from '../../../helpers/generateJwt.js';
import logger from '../../logger/config.js';
import createError from '../../../helpers/createError.js';

import { Op } from 'sequelize';
import { getUserByEmail, createUser } from '../../users/services/userServices.js';
import { sendEmailVerification, sendPasswordResetEmail } from '../../email/services/emailService.js';
import { Users } from '../../users/models/userModel.js';

/**
 * Registra un nuevo usuario creando una cuenta y enviando un correo de verificación.
 *
 * @param {Object} userData - Los datos del usuario.
 * @param {string} userData.name - El nombre del usuario.
 * @param {string} userData.email - El correo electrónico del usuario.
 * @param {string} userData.password - La contrasenia del usuario.
 * @param {string} userData.rol - El rol del usuario.
 * @returns {Promise<Object>} Una promesa que se resuelve en un objeto que contiene un mensaje de éxito.
 * @throws {Error} Si el usuario ya existe o si faltan campos obligatorios.
 */
export const signUp = async userData => {
  const { name, email, password, rol } = userData;

  // Validar si los campos están completos
  if (!name || !email || !password) {
    logger.error(`Error en signUp: Todos los campos son obligatorios`);
    throw createError('Todos los campos son obligatorios', 400);
  }

  const existsUser = await getUserByEmail(email);

  //Se valida si el usuario ya existe
  if (existsUser) {
    logger.error(`Error en signUp: El usuario con email: ${email} ya existe`);
    throw createError('El usuario ya existe', 409);
  }

  const salt = await genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const emailVerificationToken = crypto.randomBytes(32).toString('hex');

  const newUser = await createUser({
    name,
    email,
    password: hashedPassword,
    rol,
    emailVerificationToken,
    emailVerified: false,
  });

  await sendEmailVerification(newUser.email, emailVerificationToken);

  return { message: 'Usuario registrado. Por favor, verifica tu email.' };
};

/**
 * Inicia sesión de un usuario existente y genera un token JWT.
 *
 * @param {Object} userData - Los datos del usuario.
 * @param {string} userData.email - El correo electrónico del usuario.
 * @param {string} userData.password - La contrasenia del usuario.
 * @returns {Promise<Object>} Una promesa que se resuelve en un objeto que contiene el token JWT.
 * @throws {Error} Si el usuario no existe, la contrasenia es incorrecta o el email no está verificado.
 */
export const signIn = async ({ email, password }) => {
  const user = await getUserByEmail(email);

  // Se valida si el email existe
  if (!user) {
    logger.error(`Error en signIn: El email: ${email} ingresado no existe`);
    throw createError('El email ingresado no existe', 400);
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    logger.error('Error en signIn: La contrasenia es incorrecta');
    throw createError('La contrasenia es incorrecta', 400);
  }

  if (!user.emailVerified) {
    logger.error(`Error en signIn: El email: ${email} no está verificado`);
    throw createError('Por favor, verifica tu email antes de iniciar sesion', 400);
  }

  const token = await generateJwt(user.id);

  return { token };
};

/**
 * Solicita el restablecimiento de la contrasenia enviando un correo electrónico con un token de restablecimiento.
 *
 * @param {string} email - El correo electrónico del usuario.
 * @returns {Promise<void>} Una promesa que se resuelve cuando el correo de restablecimiento ha sido enviado.
 * @throws {Error} Si el usuario no es encontrado.
 */
export const requestPasswordReset = async email => {
  const user = await getUserByEmail(email);

  if (!user) {
    logger.error(`Error en requestPasswordReset: Usuario con email: ${email} no encontrado`);
    throw createError('Usuario no encontrado', 404);
  }

  // Genera un token de restablecimiento y establece su expiración
  const token = crypto.randomBytes(32).toString('hex');
  const tokenExpiration = Date.now() + 108000000; // 30 minutos

  // Guarda el token y su expiración en el usuario
  user.resetPasswordToken = token;
  user.resetPasswordExpires = new Date(tokenExpiration);
  await user.save();

  // Envía el correo de restablecimiento de contrasenia
  await sendPasswordResetEmail(user.email, token);
};

/**
 * Verifica la validez del token de restablecimiento de contrasenia.
 *
 * @param {string} token - El token de restablecimiento de contrasenia.
 * @returns {Promise<Object>} Una promesa que se resuelve en el usuario si el token es válido.
 * @throws {Error} Si el token es inválido o ha expirado.
 */
export const verifyResetToken = async token => {
  const user = await Users.findOne({
    where: {
      resetPasswordToken: token,
      resetPasswordExpires: { [Op.gt]: new Date() }, // Asegúrate de que sea una instancia de Date
    },
  });

  if (!user) {
    logger.error('Error en verifyResetToken: Token invalido o expiro');
    throw createError('Token invalido o expirado', 400);
  }

  return user;
};

/**
 * Restablece la contrasenia del usuario utilizando un token de restablecimiento válido.
 *
 * @param {string} token - El token de restablecimiento de contrasenia.
 * @param {string} newPassword - La nueva contrasenia del usuario.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la contrasenia ha sido restablecida.
 * @throws {Error} Si el token es inválido o ha expirado.
 */
export const resetPassword = async (token, newPassword) => {
  // Verifica la validez del token
  const user = await verifyResetToken(token);

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Actualiza la contrasenia del usuario y elimina el token de restablecimiento
  user.password = hashedPassword;
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();
};

/**
 * Verifica el token de verificación de email y actualiza el estado del usuario.
 *
 * @param {string} token - El token de verificación de email.
 * @returns {Promise<void>} Una promesa que se resuelve cuando el email ha sido verificado.
 * @throws {Error} Si el token es inválido o ha expirado.
 */
export const verifyEmailToken = async token => {
  const user = await Users.findOne({
    where: {
      emailVerificationToken: token,
    },
  });

  if (!user) {
    logger.error('Error en verifyEmailToken: Token inválido o expirado');
    throw createError('Token inválido o expirado', 400);
  }

  user.emailVerified = true;
  user.emailVerificationToken = null;
  await user.save();
};
