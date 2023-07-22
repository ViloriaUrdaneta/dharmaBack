import {
    Table,
    Column,
    Model,
    CreatedAt,
    UpdatedAt,
    PrimaryKey,
    AutoIncrement,
    AllowNull,
    HasOne,
    AfterCreate
} from 'sequelize-typescript';
import Account from './Account';

enum Card {
    PIKE = '♠',
    HEART = '♥',
    TREBOL = '♣',
    DIAMONT = '♦'
}

@Table({
    tableName: 'users',
    timestamps: true,
})
export class User extends Model<User> {

    @PrimaryKey
    @AutoIncrement
    @Column
    id?: number;

    @AllowNull(false)
    @Column
    email?: string;

    @AllowNull(false)
    @Column
    password?: string;

    @AllowNull(true)
    @Column
    card?: Card;
    
    @HasOne(() => Account)
    account?: Account;

    @AllowNull(true)
    @Column
    online?: boolean;

    @CreatedAt
    @Column
    createdAt?: Date;

    @UpdatedAt
    @Column
    updatedAt?: Date;

    @AfterCreate
    static async createAccount(instance: User) {
        const account = new Account();
        account.user_id = instance.id;
        await account.save();
    }

}

export default User;