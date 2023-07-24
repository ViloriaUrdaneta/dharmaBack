import { Router } from 'express';
import TransactionController from './transactionController'
import { isAuthenticated } from '../../middlewares/isAuthenticated';
import validationReqSchema from '../../middlewares/validations';

const router = Router();
const transactionController = new TransactionController();

router.get('/', transactionController.allTransactions);
router.get('/resume/:id', isAuthenticated, transactionController.resume);
router.get('/sent/:id', isAuthenticated, transactionController.sent);
router.get('/received/:id', isAuthenticated, transactionController.received);
router.get('/pendingReceived/:id', isAuthenticated, transactionController.pendingReceived);
router.post('/giveAway', isAuthenticated, transactionController.giveAway);
router.post('/receive', isAuthenticated, transactionController.receive);
router.put('/decline', isAuthenticated, transactionController.decline)

export default router;