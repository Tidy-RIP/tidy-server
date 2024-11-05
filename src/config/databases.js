import { Sequelize } from 'sequelize';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from './env.js';

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'mysql',
  port: DB_PORT,
  pool: {
    max: 10, //Mantiene hasta 10 conexiones simultáneamente
    min: 0, //No mantiene ninguna conexión cuando no se necesitan
    acquire: 30000, //Intenta una conexión durante un máximo de 30 segundos
    idle: 10000, //Una conexión debe tener un máximo de 10 segundos antes de ser liberada
  },
  dialectOptions: {
    connectTimeout: 60000, // Aumenta el tiempo de espera de la conexión a 60 segundos
  },
  logging: false, //Desactiva el filtro de consultas SQL. Aumenta el rendimiento de la aplicación.
});

// Verifica si la conexión se realiza con éxito o no
const testConnect = async () => {
  try {
    await sequelize.authenticate();
    console.log('La conexión se estableció correctamente');
  } catch (error) {
    console.error(
      `No se pudo establecer la conexión correctamente: ${error.message}`
    );
    console.error(`Detalles del error: ${JSON.stringify(error, null, 2)}`);
  }
};

testConnect();
