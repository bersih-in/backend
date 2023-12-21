import { DataTypes } from 'sequelize';

import sequelize from '../config/db.js';

const Submission = sequelize.define('Submission', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
  },
  coords: {
    type: DataTypes.GEOMETRY('POINT', 4326),
  },
  lat: {
    type: DataTypes.DECIMAL,
  },
  lon: {
    type: DataTypes.DECIMAL,
  },
  title: {
    type: DataTypes.STRING,
  },
  imageUrl: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'VERIFIED', 'IN_PROGRESS', 'FINISHED', 'CANCELLED', 'REJECTED_BY_ML', 'REJECTED_BY_ADMIN', 'REJECTED_BY_WORKER'),
    defaultValue: 'PENDING',
  },
  statusReason: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  workedBy: {
    type: DataTypes.INTEGER,
  },
  probability: {
    type: DataTypes.FLOAT,
  },
  urgent: {
    type: DataTypes.BOOLEAN,
  },
  urgencyProbability: {
    type: DataTypes.FLOAT,
  },
}, {
  indexes: [
    {
      name: 'spatial_index',
      type: 'SPATIAL',
      fields: ['coords'],
    },
  ],
});

export default Submission;
