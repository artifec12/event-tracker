import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res
            .status(401)
            .json({ message: 'No token provided authorization denied' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decode.id, role: decode.role };
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token is not valid' });
    }
};
