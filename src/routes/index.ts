import { Router } from 'express';
import userRoutes from './userManager/userRoutes';
import authRoutes from './authManager/authRoutes';
import accountRoutes from './accountManager/accountRoutes'
import transactionRoutes from './transactionManager/transactionRoutes'

const router = Router();

router.use('/user', userRoutes);
router.use('/auth', authRoutes);
router.use('/account', accountRoutes);
router.use('/transaction', transactionRoutes)

export default router;