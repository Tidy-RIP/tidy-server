import {
  signUp,
  signIn,
  requestPasswordReset,
  resetPassword,
  verifyResetToken,
  verifyEmailToken,
} from '../services/authService.js';
import logger from '../../logger/config.js';

export const signUpUser = async (req, res) => {
  try {
    const { token, message } = await signUp(req.body);
    res.status(201).json({ token, message });
  } catch (error) {
    logger.error(`Error en el controlador al registrarse: ${error.stack}`, { email: req.body.email });
    res.status(error.statusCode || 500).json({ message: 'Error al registrarse. Por favor, intentalo de nuevo.' });
  }
};

export const signInUser = async (req, res) => {
  try {
    const result = await signIn(req.body);
    const token = result.token;

    // Almacenar el token en la sesión del servidor
    req.session.token = token;

    // Almacenar el token en una cookie segura
    res.cookie('authToken', token, {
      httpOnly: true, // La cookie no es accesible desde JavaScript
      secure: false, // Cambiar a true en producción con HTTPS
      maxAge: 3600000, // Expiración en milisegundos (1 hora)
    });

    return res.json({ message: 'Inicio de sesión exitoso' });
  } catch (error) {
    logger.error(`Error en el controlador al iniciar sesion: ${error.stack}`, { email: req.body.email });
    res.status(error.statusCode || 500).json({ message: 'Error al iniciar sesión. Por favor, intentalo de nuevo.' });
  }
};

export const signOutUser = async (req, res) => {
  try {
    const token = req.cookies.authToken;

    if (!token) {
      return res.status(400).json({ message: 'No hay token para cerrar sesión' });
    }

    // Elimina el token de la sesión del servidor
    req.session.token = null;

    // Elimina la cookie del cliente
    res.clearCookie('authToken');

    return res.json({ message: 'Cierre de sesión exitoso' });
  } catch (error) {
    logger.error(`Error en el controlador al cerrar sesión: ${error.stack}`);
    res.status(error.statusCode || 500).json({ message: 'Error al cerrar sesión. Por favor, intentalo de nuevo.' });
  }
};

// Controlador para enviar el correo de restablecer la contraseña
export const requestPasswordResetCtrl = async (req, res) => {
  const { email } = req.body;

  try {
    // Envía el correo de restablecimiento de contraseña
    await requestPasswordReset(email);

    res.status(200).json({ message: 'Correo de restablecimiento de contraseña enviado' });
  } catch (error) {
    logger.error(`Error en el controlador al solicitar el restablecimiento de contraseña: ${error.stack}`, { email });
    res
      .status(error.statusCode || 500)
      .json({ message: 'Error al solicitar el restablecimiento de contraseña. Por favor, intentalo de nuevo.' });
  }
};

// Controlador para verificar que el token sea válido
export const verifyResetTokenCtrl = async (req, res) => {
  const { token } = req.params;

  try {
    // Verifica que el token recibido es válido
    await verifyResetToken(token);

    res.status(200).json({ message: 'Token válido' });
  } catch (error) {
    logger.error(`Error en el controlador al verificar el token de restablecimiento: ${error.stack}`, { token });
    res.status(error.statusCode || 500).json({ message: 'Error al verificar el token. Por favor, intentalo de nuevo.' });
  }
};

// Controlador para recibir la nueva contraseña y resetearla
export const resetPasswordCtrl = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    // Espera la nueva contraseña
    await resetPassword(token, newPassword);

    res.status(200).json({ message: 'Contraseña restablecida correctamente' });
  } catch (error) {
    logger.error(`Error en el controlador al restablecer la contraseña: ${error.stack}`, { token });
    res.status(error.statusCode || 500).json({ message: 'Error al restablecer la contraseña. Por favor, intentalo de nuevo.' });
  }
};

// Controlador para verificar el email del usuario
export const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    await verifyEmailToken(token);

    res.status(200).json({ message: 'Email verificado correctamente' });
  } catch (error) {
    logger.error(`Error en el controlador al verificar el email: ${error.stack}`, { token });
    res.status(error.statusCode || 500).json({ message: 'Error al verificar el email. Por favor, intentalo de nuevo.' });
  }
};
