"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.default = (QUARKUS_URL) => {
    router.post('/logout', (req, res) => {
        res.clearCookie('session_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });
        res.status(200).json({ success: true, message: 'Logged out successfully' });
    });
    router.get('/check', (req, res) => {
        res.status(200).json({
            success: true,
            authenticated: true,
            user: req.user
        });
    });
    return router;
};
