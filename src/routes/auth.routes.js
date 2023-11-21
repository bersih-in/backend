import express from 'express';

import { login, register, credentialInfo } from '../controllers/auth.controller.js';
import authenticateUser from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/credential-info', authenticateUser, credentialInfo);

export default router;
