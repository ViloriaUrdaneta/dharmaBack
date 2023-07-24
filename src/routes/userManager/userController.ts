import { where } from 'sequelize';
import { User } from '../../models/User';
import { Response, Request, NextFunction } from 'express';

interface CardData {
    id: number;
    card: string;
}

export default class UserController {
    
    public allUsers = async (
        _req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const users = await User.findAll({
                attributes: { exclude: ['createdAt', 'updatedAt'] }
            });
            return res.status(200).json({users, message: "Users finded"});
        } catch (error) {
            return res.status(400).json({
                message: "Error en userController",
                error
            });
        } 
    }

    public card = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const id = req.params.id;
            const user = await User.findByPk(id);
            return res.status(200).json({card: user?.card, message: 'Cardfinded'});
        } catch (error) {
            return res.status(400).json({
                message: "Error en userController",
                error
            });
        } 
    }

    public threeCards = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const id = Number(req.params.id);
            const users = await User.findAll({
                attributes: { exclude: ['email', 'password', 'online', 'createdAt', 'updatedAt'] }
            });
            const filteredUsers = users.filter((user) => user.id !== undefined && user.card !== undefined && user.id !== id);
            const cards: CardData[] = filteredUsers.map((user) => ({ id: user.id!, card: user.card! })); 
            function getRandomCards(arr: CardData[], numItems: number) {
                const shuffled = arr.sort(() => Math.random() - 0.5);
                return shuffled.slice(0, numItems);
            }
            const randomCards = getRandomCards(cards, 3)
            return res.status(200).json({randomCards, message: 'Three random cards finded successfully'});
        } catch (error) {
            return res.status(400).json({
                message: "Error en userController",
                error
            });
        } 
    }

    public pickCard = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const { id, card } = req.body;
        try {
            const user = await User.findByPk(id);
            if(user){
                user.card = card;
                await user.save();
                const userResponse = {
                    id: user.id,
                    card: user.card,
                    email: user.email
                };
                return res.status(200).json({user: userResponse, message: 'Card picked successfully'});
            } else{
                return res.status(401).json({ message: 'User not found' });
            }
        } catch (error) {
            return res.status(400).json({
                message: "Error en userController",
                error
            });
        } 
    }

}