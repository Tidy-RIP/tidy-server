import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/databases.js';

//Modelo de Prioridades con: id, nivel
export const Priorities = sequelize.define(
  'priorities',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nivel: {
      type: DataTypes.ENUM('baja', 'media', 'alta'),
      defaultValue: 'alta',
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'priorities',
    paranoid: true,
  }
);
