import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';

const JWT_SECRET_KEY = process.env.SECRET || 'default_jwtsecret'

const signOptions: SignOptions = {
    algorithm: 'HS512',
    expiresIn: '7d'
}
const verifyOptions: VerifyOptions = {
    algorithms: ['HS512']
};

const createJWT = (payload: string | object): string => {
    return jwt.sign(payload, JWT_SECRET_KEY, signOptions)
}

const verifyJWT = (token: string) => {
    return jwt.verify(token, JWT_SECRET_KEY, verifyOptions)
}

export {
    createJWT,
    verifyJWT
};