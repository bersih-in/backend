import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Bersih.in API Documentation',
    description: 'This is the API documentation for Bersih.in',
  },
  host: '0.0.0.0:80',
};

const outputFile = './swagger.json';
const routes = ['./src/app.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen()(outputFile, routes, doc);
