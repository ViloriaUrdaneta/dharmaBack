import { Router } from 'express';
import AccountController from './accountController'
import { isAuthenticated } from '../../middlewares/isAuthenticated';
import validationReqSchema from '../../middlewares/validations';

const router = Router();
const userController = new AccountController();

router.get('/:id', isAuthenticated, userController.one);
router.get('/all', isAuthenticated, userController.all);
router.post('/recharge',isAuthenticated, userController.recharge);

export default router;