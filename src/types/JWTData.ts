export type JWTData = {
    id: Number;
    email: string;
    exp: number;
};

export interface UserConfirmationJWT {
    userId: number;
}