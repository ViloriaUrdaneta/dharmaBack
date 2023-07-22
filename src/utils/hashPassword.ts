import bcrypt from 'bcryptjs';
const salt = bcrypt.genSaltSync(10)

export function hashPassword(password: string) {
    const hashPassword = bcrypt.hashSync(password, salt)
    return hashPassword
}

export function comparePassword(password: string, hash: string) {
    return bcrypt.compareSync(password, hash)
}