import { Users } from '../modules/users/models/userModel';

export const requireEmailVerification = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const user = await Users.findByPk(userId);

    if (!user.emailVerified) {
      return res.status(403).json({ message: 'Debes verificar tu email para acceder a esta funcionalidad' });
    }

    next();
  } catch (error) {
    console.error(`Error al verificar el estado del email: ${error}`);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
