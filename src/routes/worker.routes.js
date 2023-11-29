import express from 'express';

import authenticateUser from '../middlewares/auth.middleware.js';
import { getReports, changeReportState, getHistory } from '../controllers/worker.controller.js';

const router = express.Router();

router.post('/reports', authenticateUser, getReports);
router.post('/report-update', authenticateUser, changeReportState);
router.get('/history', authenticateUser, getHistory);

export default router;
