import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'secret';

export const generateToken = (user: {id: number, role: string}) =>
    jwt.sign(user, SECRET, {expiresIn: '7d'});

export const verifyToken = (token: string) =>
    jwt.verify(token, SECRET);