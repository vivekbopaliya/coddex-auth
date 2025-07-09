"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const user_1 = __importDefault(require("./routes/user"));
const public_1 = __importDefault(require("./routes/public"));
const requireAuth_1 = require("./middleware/requireAuth");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 5000;
const QUARKUS_URL = process.env.QUARKUS_URL || 'http://localhost:8080';
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use('/api', (0, public_1.default)(QUARKUS_URL));
app.use('/api/auth', requireAuth_1.requireAuth, (0, auth_1.default)(QUARKUS_URL));
app.use('/api/user', (0, user_1.default)(QUARKUS_URL));
app.get('/api/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Proxy server is running' });
});
app.get('/api/health/quarkus', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quarkusHealthUrl = `${QUARKUS_URL}/api/health`;
        const response = yield fetch(quarkusHealthUrl);
        const text = yield response.text();
        if (response.ok) {
            return res.status(200).json({
                success: true,
                message: 'Quarkus backend is running',
                quarkusMessage: text
            });
        }
        else {
            return res.status(500).json({
                success: false,
                message: 'Quarkus backend returned an error',
                statusCode: response.status,
                response: text
            });
        }
    }
    catch (error) {
        console.error('Quarkus health check failed:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reach Quarkus backend',
            error: error instanceof Error ? error.message : String(error)
        });
    }
}));
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Proxy server running on port ${PORT}`);
});
