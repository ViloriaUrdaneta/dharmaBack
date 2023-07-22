import { Router } from 'express';
import AuthController from './authController'
import validationReqSchema from '../../middlewares/validations';
import { body, param } from 'express-validator';

const router = Router();
const authController = new AuthController();

router.post('/register',
    validationReqSchema([
        body('email').isEmail(), 
        body('password').isString(),
    ]), 
    authController.register);

router.post('/login', 
    validationReqSchema([body('email').isEmail(), body('password').isString()]), 
    authController.login);

router.post('/recovery',
    validationReqSchema([body('email').isEmail()]), 
    authController.recoveryPassword);

router.put('/changePassword/:token',
    validationReqSchema([body('password').isString(), param('token').isJWT()]), 
    authController.changePassword);


export default router;