import { Request, Response } from 'express';
import db from '../models/db';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateToken } from '../utils/jwt';

// POST /api/auth/register
export const register = async (req: Request, res: Response) => {
    const { name, email, password, role, profession, location } = req.body;

    try {
        const userExists = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const passwordHash = await hashPassword(password);

        const newUser = await db.query(
            `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role`,
            [name, email, passwordHash, role]
        );

        const user = newUser.rows[0];

        if (role === 'professional') {
            await db.query(
                `INSERT INTO professionals (user_id, profession, location)
         VALUES ($1, $2, $3)`,
                [user.id, profession, location]
            );
        }

        const token = generateToken({ id: user.id, role: user.role });
        res.status(201).json({ token, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const result = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const passwordValid = await comparePassword(password, user.password_hash);
        if (!passwordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken({ id: user.id, role: user.role });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error during login' });
    }
};

// GET /api/auth/me
export const getMe = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;

    try {
        const result = await db.query(`SELECT id, name, email, role FROM users WHERE id = $1`, [userId]);
        const user = result.rows[0];

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to retrieve user' });
    }
};
