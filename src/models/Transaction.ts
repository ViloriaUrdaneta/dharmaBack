import {
    Table,
    Column,
    Model,
    CreatedAt,
    UpdatedAt,
    PrimaryKey,
    ForeignKey,
    AutoIncrement,
    AllowNull,
} from 'sequelize-typescript';
import Account from './Account';

export enum State {
    PENDING = 'pending',
    DONE = 'done',
    DECLINED = 'declined'
}

@Table({
    tableName: 'transactions',
    timestamps: true,
})
export class Transaction extends Model<Transaction> {

    @PrimaryKey
    @AutoIncrement
    @Column
    id?: number;

    @AllowNull(true)
    @ForeignKey(() => Account)
    @Column
    sender_account?: number;

    @AllowNull(false)
    @ForeignKey(() => Account)
    @Column
    receiver_account?: number;

    @AllowNull(true)
    @Column
    sender_message?: string;

    @AllowNull(true)
    @Column
    reciever_message?: string;
    
    @AllowNull(true)
    @Column
    amount?: number;

    @AllowNull(true)
    @Column
    recharge?: boolean;

    @AllowNull(true)
    @Column
    state?: State;

    @CreatedAt
    @Column
    createdAt?: Date;

    @UpdatedAt
    @Column
    updatedAt?: Date;

}

export default Transaction;