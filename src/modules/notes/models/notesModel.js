import { sequelize } from '../../../config/databases.js';
import { DataTypes } from 'sequelize';

export const Notes = sequelize.define(
  'notes',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    subject_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'notes',
    paranoid: true,
  }
);
