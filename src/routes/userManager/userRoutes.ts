import { Router } from 'express';
import UserController from './userController'
import { isAuthenticated } from '../../middlewares/isAuthenticated';
import validationReqSchema from '../../middlewares/validations';

const router = Router();
const userController = new UserController();

router.get('/', userController.allUsers);
router.get('/card/:id', isAuthenticated, userController.card);
router.get('/cards/:id', isAuthenticated, userController.threeCards);
router.put('/pickCard', isAuthenticated, userController.pickCard);

export default router;