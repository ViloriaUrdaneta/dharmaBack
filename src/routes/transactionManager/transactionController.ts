import { Op, where } from 'sequelize';
import { Account } from '../../models/Account';
import { Transaction, State } from '../../models/Transaction';
import { Response, Request, NextFunction } from 'express';

interface Trans {
    id: number;
    date: string;
    message: string;
    amount: number;
    card: number;
}

export default class UserController {
    
    public allTransactions = async (
        _req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const transactions = await Transaction.findAll({
                attributes: { exclude: ['createdAt', 'updatedAt'] }
            });
            if (transactions.length > 0){
                return res.status(200).json({ transactions, message: 'transactions finded' });
            } else {
                return res.status(401).json({ message: 'No transactions' });
            }
        } catch (error) {
            return res.status(400).json({
                message: "Error en userController",
                error
            });
        } 
    }

    public resume = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const id = Number(req.params.id);
        try {
            const transactions = await Transaction.findAll({
                attributes: { exclude: ['updatedAt'] },
                where: {
                    [Op.and]: [
                        {
                            [Op.or]: [
                                { receiver_account: id },
                                { sender_account: id }
                            ]
                        },
                        { state: 'done' }
                    ]
                }
            });
            function formatDate(isoDate: Date | undefined): string {
                if (!isoDate) {
                    return ""; 
                }
                const date = new Date(isoDate);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son base 0, por lo que sumamos 1
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
            }
            const trans: Trans[] = transactions
                .filter((item) => 
                    typeof item.id === 'number')  // Filtrar objetos con id válido
                .map((item) => ({
                    id: item.id!,
                    date: formatDate(item.createdAt),
                    amount: item.amount || 0,
                    message: item.sender_account === id ? item.reciever_message || '' : item.sender_message || '',
                    card: item.sender_account === id ? item.receiver_account || 0 : item.sender_account || 0,
            }));
            if (transactions.length > 0){
                const totalIncomes = transactions.reduce((acc, trans) => {
                    if (trans.receiver_account === id && trans.amount){ 
                        return acc + trans.amount;
                    }
                    return acc;
                    }, 0);
                const totalOutgoings = transactions.reduce((acc, trans) => {
                    if (trans.sender_account === id && trans.amount){
                        return acc + trans.amount;
                    }
                    return acc;
                    }, 0);
                return res.status(200).json({ trans, totalOutgoings, totalIncomes, message: 'transactions finded' });
            } else {
                return res.status(401).json({ message: 'No transactions' });
            }
        } catch (error) {
            return res.status(400).json({
                message: "Error en userController",
                error
            });
        } 
    }

    public sent = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const id = req.params.id;
        try {
            const transactions = await Transaction.findAll({
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                where: { sender_account: id }
            });
            if (transactions.length > 0){
                return res.status(200).json({ transactions, message: 'transactions finded' });
            } else {
                return res.status(401).json({ message: 'No transactions' });
            }
        } catch (error) {
            return res.status(400).json({
                message: "Error en userController",
                error
            });
        } 
    }

    public received = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const id = req.params.id;
        try {
            const transactions = await Transaction.findAll({
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                where: {
                    [Op.and]: [
                        { receiver_account: id },
                        { state: 'pending' } 
                    ]
                }
            });
            if (transactions.length > 0){
                return res.status(200).json({ transactions, message: 'transactions finded' });
            } else {
                return res.status(401).json({ message: 'No transactions' });
            }
        } catch (error) {
            return res.status(400).json({
                message: "Error en userController",
                error
            });
        } 
    }

    public pendingReceived = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const id = req.params.id;
        try {
            const transactions = await Transaction.findAll({
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                where: {
                    [Op.and]: [
                        { receiver_account: id },
                        { state: 'pending' } 
                    ]
                }
            });
            if (transactions.length > 0){
                return res.status(200).json({ transactions, message: 'transactions finded' });
            } else {
                return res.status(401).json({ message: 'No pending transactions' });
            } 
        } catch (error) {
            return res.status(400).json({
                message: "Error en userController",
                error
            });
        } 
    }

    public giveAway = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const { sender, receiver, charge, message } = req.body;
        try {
            const senderAccount = await Account.findOne({where: { user_id : sender }})
            const receiverAccount = await Account.findOne({where: { user_id : receiver }})
            if (senderAccount && senderAccount?.amount){
                if(senderAccount.amount >= charge){
                    senderAccount.amount = senderAccount.amount - charge;
                    await senderAccount.save();
                    const transaction = new Transaction;
                    transaction.amount = charge;
                    transaction.sender_account = senderAccount.id;
                    transaction.sender_message = message;
                    transaction.receiver_account = receiverAccount?.id
                    transaction.recharge = false;
                    transaction.state = State.PENDING;
                    await transaction.save();
                    return res.status(200).json({ transaction, message: 'Gift sent successfully' });
                } else{
                    return res.status(401).json({ message: 'Insufficient balance' });
                }
            } else {
                return res.status(401).json({ message: 'Account not found' });
            }
        } catch (error) {
            return res.status(400).json({
                message: "Error en transactionController",
                error
            });
        }
    }

    public receive = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const { message, transactionId } = req.body;
        try {
            const transaction = await Transaction.findByPk(transactionId);
            if(transaction && transaction.amount && transaction.receiver_account){
                if(transaction.state = State.PENDING){
                    const receiverAccount = await Account.findOne({where: { user_id : transaction.receiver_account }})
                    if(receiverAccount && receiverAccount.amount){                    
                        receiverAccount.amount = receiverAccount.amount + transaction.amount
                        transaction.reciever_message = message;
                        transaction.state = State.DONE;
                        await transaction.save();
                        await receiverAccount.save();
                        return res.status(200).json({ transaction, message: 'Transaction received successfully' });
                    } else{
                        return res.status(401).json({ message: 'Receiver not found' });
                    }
                }else{
                    return res.status(401).json({ message: 'Transaction already finished' });
                }
            } else{
                return res.status(401).json({ message: 'Transaction not found' });
            }
        } catch (error) {
            return res.status(400).json({
                message: "Error en transactionController",
                error
            });
        }
    }

    public decline = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const { transactionId } = req.body;
        try {
            const transaction = await Transaction.findByPk(transactionId);
            if(transaction && transaction.amount && transaction.sender_account){
                if(transaction.state = State.PENDING){
                    const senderAccount = await Account.findOne({where: { user_id : transaction.sender_account }})
                    if(senderAccount && senderAccount.amount){                    
                        senderAccount.amount = senderAccount.amount + transaction.amount
                        transaction.state = State.DECLINED;
                        await transaction.save();
                        await senderAccount.save();
                        return res.status(200).json({ transaction, message: 'Transaction declined successfully' });
                    } else{
                        return res.status(401).json({ message: 'Sender not found' });
                    }
                }else{
                    return res.status(401).json({ message: 'Transaction already finished' });
                }
            } else{
                return res.status(401).json({ message: 'Transaction not found' });
            }
        } catch (error) {
            return res.status(400).json({
                message: "Error en transactionController",
                error
            });
        }
    }


}