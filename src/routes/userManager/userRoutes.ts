import { Router } from 'express';
import UserController from './userController'
import { isAuthenticated } from '../../middlewares/isAuthenticated';
import validationReqSchema from '../../middlewares/validations';

const router = Router();
const userController = new UserController();

router.get('/', userController.allUsers);
router.get('/cards', userController.threeCards);
router.put('/pickCard', isAuthenticated, userController.pickCard);

export default router;