import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import app from '../app';

dotenv.config();

const {
  DATABASE,
  DATABASE_HOST,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_PORT,
} = process.env as {
  DATABASE: string;
  DATABASE_HOST: string;
  DATABASE_USER: string;
  DATABASE_PASSWORD: string;
  DATABASE_PORT: string;
};

const sequelize = new Sequelize(
  DATABASE || 'default',
  DATABASE_USER || 'root',
  DATABASE_PASSWORD || '',
  {
    host: DATABASE_HOST,
    port: Number(DATABASE_PORT),
    dialect: 'mysql',
  },
);

export default sequelize;

(async () => {
  try {
    await sequelize.authenticate();
    console.log(
      'Connection to the database has been established successfully.',
    );
    app.emit('db ready');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();
