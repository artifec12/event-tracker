import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        if (!password) {
            return res.status(400).json({ message: 'Password is required' });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exist' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            email,
            password: hashedPassword,
            role: 'admin',
        });

        const token = jwt.sign(
            { id: newUser._id, role: 'admin' },
            process.env.JWT_SECRET,
            {
                expiresIn: '3d',
            }
        );

        res.status(201).json({
            token,
            message: 'User register successfully',
            user: { id: newUser._id, email: newUser.email, role: 'admin' },
        });
    } catch (error) {
        console.error('Signup error:', error.message);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        if (!password) {
            return res.status(400).json({ message: 'Password is required' });
        }
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, role: 'admin' },
            process.env.JWT_SECRET,
            {
                expiresIn: '3d',
            }
        );
        return res.status(200).json({
            token,
            message: 'Login successfully',
            user: { id: user._id, email: user.email, role: 'admin' },
        });
    } catch (error) {
        console.error('Login error:', error.message);
        return res
            .status(500)
            .json({ message: 'Internal server error', error: error.message });
    }
});

export default router;

// {
//   "title": "React Workshop",
//   "date": "2025-10-15T14:30:00.000Z",
//   "location": "Zoom Online",
//   "description": "A hands-on workshop covering React hooks, state, and context API."
// }
