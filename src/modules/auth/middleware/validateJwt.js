import jwt from 'jsonwebtoken';
import { Users } from '../../users/models/userModel.js';
import { SECRET_KEY } from '../../../config/env.js';

const validateJwt = async (req, res, next) => {
  const token = req.cookies.authToken || (req.session && req.session.token);

  if (!token) {
    return res.status(403).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.userId = decoded.userId;

    if (!req.userId) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    const user = await Users.findOne({ where: { id: req.userId } });

    if (!user) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Error al verificar el token: ', err);
    return res.status(401).json({ message: 'Token inválido' });
  }
};

export default validateJwt;
