/**
 * Esta función verifica si el usuario está autenticado comprobando la presencia de `req.user`.
 * Si el usuario está autenticado, responde con un estado 200 y un mensaje de éxito junto con la información del usuario.
 *
 * @param {Object} req - El objeto de solicitud.
 * @param {Object} req.user - El objeto de usuario autenticado.
 * @param {Object} res - El objeto de respuesta.
 * @returns {Object} El objeto de respuesta con el estado y mensaje apropiados.
 */
export const validateSession = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Acceso no autorizado' });
  }

  res.status(200).json({
    message: 'Acceso permitido a área protegida',
    user: req.user,
  });
};
