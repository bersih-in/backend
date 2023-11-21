import swaggerAutogen from 'swagger-autogen';

const PORT = process.argv[3] || 3000;
const HOST = process.argv[2] || 'localhost';

let url;
if (PORT === '443' || PORT === '80') {
  url = `${HOST}`;
} else {
  url = `${HOST}:${PORT}`;
}

const doc = {
  info: {
    title: 'Bersih.in API Documentation',
    description: 'This is the API documentation for Bersih.in',
  },
  host: url,
  schemes: ['http', 'https'],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      in: 'header', // can be "header", "query" or "cookie"
      name: 'authorization', // name of the header, query parameter or cookie
      description:
            'Please enter a valid token to test the protected endpoints. Don\'t forget to add the **Bearer** prefix.',
    },
  },
};

const outputFile = './swagger.json';
const routes = ['./src/app.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen()(outputFile, routes, doc);
