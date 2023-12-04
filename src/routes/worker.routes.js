import express from 'express';

import authenticateUser from '../middlewares/auth.middleware.js';
import {
  getReports, changeReportState, getHistory, getReportById, getInProgressReports,
} from '../controllers/worker.controller.js';

const router = express.Router();

router.post('/reports', authenticateUser, getReports);
router.put('/report-update', authenticateUser, changeReportState);
router.get('/history', authenticateUser, getHistory);
router.get('/in-progress', authenticateUser, getInProgressReports);
router.get('/report/:id', authenticateUser, getReportById);

export default router;
