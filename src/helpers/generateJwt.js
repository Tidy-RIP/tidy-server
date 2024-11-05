import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config/env.js';

const generateJwt = async userId => {
  try {
    const payload = { userId };
    const token = await new Promise((resolve, reject) => {
      jwt.sign(payload, SECRET_KEY, { expiresIn: '5h' }, (error, token) => {
        if (error) {
          console.error('Error al generar el token:', error);
          reject('No se pudo generar el token');
        } else {
          resolve(token);
        }
      });
    });
    return token;
  } catch (error) {
    throw new Error(error);
  }
};

export default generateJwt;
