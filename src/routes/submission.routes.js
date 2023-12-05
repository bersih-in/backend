import express from 'express';

import authenticateUser from '../middlewares/auth.middleware.js';
import { submit, getSubmissionsByUserId, getSubmissionsBySelf, getSubmissionById } from '../controllers/submission.controller.js';

const router = express.Router();

router.post('/submit', authenticateUser, submit);
router.get('/user/:userId', getSubmissionsByUserId);
router.get('/self', authenticateUser, getSubmissionsBySelf);
router.get('/:id', authenticateUser, getSubmissionById);

export default router;
