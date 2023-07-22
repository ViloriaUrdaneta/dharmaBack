import { models } from '../db';

const{ User } = models;

export const seedUsers = async () => {
    const users = [
        {
            email: 'jhoskartoro@gmail.com',
            password: '123456',
            card: '♣',
            bank: null,
            state : true,
            online: false,
        },
        {
            email: 'miguelviloria@gmail.com',
            password: '123456',
            card: '♥',
            bank: null,
            state : true,
            online: false,
        }
    ];

    for (const user of users) {
        await User.create(user);
    }
};
