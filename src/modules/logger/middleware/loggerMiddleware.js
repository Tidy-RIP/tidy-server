import logger from '../config.js';

const logEndpointAccess = endpoint => (req, res, next) => {
  try {
    logger.info(`Endpoint ${endpoint} accedido`);
    next();
  } catch (error) {
    logger.error(`Error loggin acceso a endpoint: ${error.message}`);
  }
};

export default logEndpointAccess;
