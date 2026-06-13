import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : req.headers.token;

        if (!token) {
            return next();
        };

        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return next();
            };

            const user = await userModel.findById(decoded.id);

            if (user && user.isActive) {
                req.user = user;
            };

            next();
        });
    } catch (error) {
        next();
    };
};

export default optionalAuth;
