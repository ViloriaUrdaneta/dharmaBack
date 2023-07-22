import { User } from '../../models/User';
import { Response, Request, NextFunction } from 'express';
import { comparePassword, hashPassword } from '../../utils/hashPassword';
import { createJWT, verifyJWT } from '../../utils/jwt';
import { emailForgotPassword } from '../../utils/email';

interface TokenPayload {
    id: string;
    name: string;
}

export default class authController {

    public register = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const user: User = req.body;
            const userExist = await User.findOne({ where: {email: user.email}})
            if(userExist){
                return res.status(401).json({ message: 'Email already exist' });
            }
            if(typeof user.password === 'string'){
                user.password = hashPassword(user.password);
                const newUser = await User.create(user);     
                return res.status(200).json({ user: newUser, message: 'User registered successfully' });
            } else{
                return res.status(401).json({ message: 'Invalid password' });
            }
        } catch (error) {
            return res.status(500).json({ message: 'Error creating user', error });
        }
    }

    public login = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const { email, password } = req.body;
        try {
            const user: User|null = await User.findOne({ where: {email}});
            if (user && user.password) {
                const isCorrectPassword = comparePassword(password, user.password);
                if (isCorrectPassword) {
                    const token = createJWT({
                        id: user.id,
                        email: user.email,
                        card: user.card
                    });
                    return res.status(200).json({ token, message: 'User login successfully' });
                } else{
                    return res.status(401).json({ message: 'Invalid password' });
                }
            } else{
                return res.status(401).json({ message: 'Invalid email' });
            }
        } catch (error) {
            return res.status(500).json({ message: 'Authentication error:', error });
        }
    }

    public recoveryPassword = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { email } = req.body;
            const user: User|null = await User.findOne({ where: {email}});
            if(user){
                const token = createJWT({
                    id: user.id,
                })
                await emailForgotPassword({ email }, token);
                return res.status(200).json({ token, message: 'Recovery password email send' });
            } else{
                return res.status(401).json({ message: 'Invalid email' });
            }
        } catch (error) {
            return res.status(500).json({ message: 'Recovery password error:', error });
        }
    }

    public changePassword =async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { token } = req.params;
            const { password } = req.body;
            const userData = await verifyJWT(token);
            if (userData && (userData as TokenPayload).id) {
                const { id } = userData as TokenPayload;
                const user: User | null = await User.findOne({
                    where: { id },
                });
                if(user){
                    const newPassword = hashPassword(password);
                    user.password = newPassword;
                    await user.save();
                    return res.status(200).json({ token, message: 'Password changed succesfully' });
                } else{
                    return res.status(401).json({ message: 'User not found' });
                }
            } else{
                return res.status(401).json({ message: 'Invalid token' });
            }
        } catch (error) {
            return res.status(500).json({ message: 'Change password error:', error });
        }
    }

}