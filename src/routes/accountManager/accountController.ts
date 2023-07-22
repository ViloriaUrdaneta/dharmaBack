import { where } from 'sequelize';
import { Account } from '../../models/Account';
import { Transaction, State } from '../../models/Transaction';
import { User } from '../../models/User';
import { Response, Request, NextFunction } from 'express';

export default class AccountController {


    public one =async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const id = req.params.id;
        try {
            const account = await Account.findOne({where: { user_id : id }})
            if (account){
                return res.status(200).json({ account, message: 'Account finded' });
            } else {
                return res.status(401).json({ message: 'Account not found' });
            }               
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                message: "Error en accountController",
                error
            });
        }
    }

    public all =async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const accounts = await Account.findAll();
            if (accounts){
                return res.status(200).json({ accounts, message: 'Accounts finded' });
            } else {
                return res.status(401).json({ message: 'Accounts not found' });
            }               
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                message: "Error en accountController",
                error
            });
        }
    }

    public recharge = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const { id, charge } = req.body;
        try {
            const account = await Account.findOne({where: { user_id : id }})
            if (account){
                account.amount = account.amount + charge;
                await account.save();
                const transaction = new Transaction;
                transaction.amount = charge;
                transaction.receiver_account = account.id;
                transaction.recharge = true;
                transaction.state = State.DONE;
                await transaction.save();
                return res.status(200).json({ account, message: 'Account recharged successfully' });
            } else {
                return res.status(401).json({ message: 'Account not found' });
            }
        } catch (error) {
            return res.status(400).json({
                message: "Error en accountController",
                error
            });
        }
    }

}