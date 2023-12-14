import express from 'express';

import { changeStatus } from '../controllers/ml.controller.js';

const router = express.Router();

router.put('/change-status', changeStatus);

export default router;
