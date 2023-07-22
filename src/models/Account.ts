import {
    Table,
    Column,
    Model,
    CreatedAt,
    UpdatedAt,
    PrimaryKey,
    AutoIncrement,
    AllowNull,
    ForeignKey
} from 'sequelize-typescript';
import User from './User';


@Table({
    tableName: 'accounts',
    timestamps: true,
})
export class Account extends Model<Account> {

    @PrimaryKey
    @AutoIncrement
    @Column
    id?: number;

    @ForeignKey(() => User)
    @Column
    user_id?: number;

    @AllowNull(true)
    @Column
    bank?: string;
    
    @AllowNull(true)
    @Column
    amount?: number;

    @CreatedAt
    @Column
    createdAt?: Date;

    @UpdatedAt
    @Column
    updatedAt?: Date;

}

export default Account;