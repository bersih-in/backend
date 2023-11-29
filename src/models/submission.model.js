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
    type: DataTypes.FLOAT,
  },
  lon: {
    type: DataTypes.FLOAT,
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
  finishedBy: {
    type: DataTypes.INTEGER,
  },
});

export default Submission;
