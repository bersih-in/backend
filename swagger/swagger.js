import swaggerAutogen from 'swagger-autogen';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;
const HOST = process.argv[2] || 'localhost';

const doc = {
  info: {
    title: 'Bersih.in API Documentation',
    description: 'This is the API documentation for Bersih.in',
  },
  host: `${HOST}:${PORT}`,
};

const outputFile = './swagger.json';
const routes = ['./src/app.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen()(outputFile, routes, doc);
