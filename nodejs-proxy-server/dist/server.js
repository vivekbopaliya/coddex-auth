"use strict";
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
const PORT = process.env.PORT || 5000;
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
app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
    console.log(`Proxying requests to Quarkus at ${QUARKUS_URL}`);
});
