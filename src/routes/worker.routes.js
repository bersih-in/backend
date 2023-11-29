import express from 'express';

import authenticateUser from '../middlewares/auth.middleware.js';
import { getReports, changeReportState } from '../controllers/worker.controller.js';

const router = express.Router();

router.post('/reports', authenticateUser, getReports);
router.post('/report-update', authenticateUser, changeReportState);

export default router;
