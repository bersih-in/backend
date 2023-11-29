import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';

import readJSON from './util/read-json.js';
import authRoutes from './routes/auth.routes.js';
import submissionRoutes from './routes/submission.routes.js';
import workerRoutes from './routes/worker.routes.js';
import sequelize from './config/db.js';

dotenv.config();

// initial config
const PORT = process.env.PORT || 3000;
sequelize.sync({ alter: true });

// run app
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Bersih.in Backend');
});

app.use('/auth', authRoutes);
app.use('/submission', submissionRoutes);
app.use('/worker', workerRoutes);

const swaggerDocument = readJSON('../../swagger/swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { swaggerOptions: { persistAuthorization: true } }));

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
