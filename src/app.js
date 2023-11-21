import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';

import readJSON from './util/read-json.js';
import authRoutes from './routes/auth.routes.js';

dotenv.config();

const PORT = 3000;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/auth', authRoutes);

const swaggerDocument = readJSON('../../swagger/swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
