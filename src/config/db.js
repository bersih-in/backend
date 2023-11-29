import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/postgres',
  { logging: process.env.SEQUELIZE_LOGGING === 'true' },
);

export default sequelize;
