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
const axios_1 = __importDefault(require("axios"));
const jwt_1 = require("../utils/jwt");
const router = express_1.default.Router();
exports.default = (QUARKUS_URL) => {
    router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log("HELLo");
            const response = yield axios_1.default.post(`${QUARKUS_URL}/api/signup`, req.body, {
                headers: { "Content-Type": "application/json" },
                validateStatus: () => true,
            });
            res.status(response.status).json(response.data);
        }
        catch (err) {
            console.error("Signup proxy error:", err);
            res.status(500).json({ error: "Proxy error" });
        }
    }));
    router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.post(`${QUARKUS_URL}/api/login`, req.body, {
                headers: { "Content-Type": "application/json" },
                validateStatus: () => true,
            });
            if (response.status === 200 &&
                response.data &&
                response.data.success &&
                response.data.data) {
                const user = response.data.data;
                const token = (0, jwt_1.generateToken)(user);
                res.cookie("session_token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                res.status(200).json(user);
            }
            else {
                res.status(response.status).json(response.data);
            }
        }
        catch (err) {
            console.error("Login proxy error:", err);
            res.status(500).json({ error: "Proxy error" });
        }
    }));
    router.post("/verify-email/:token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const token = req.params.token;
        console.log("TOKEN", token);
        try {
            const response = yield axios_1.default.get(`${QUARKUS_URL}/api/verify?token=${encodeURIComponent(token)}`, {
                validateStatus: () => true,
            });
            res.status(response.status).json(response.data);
        }
        catch (err) {
            console.error("Email verification proxy error:", err);
            res
                .status(500)
                .json({ message: "Internal Server Error", success: false });
        }
    }));
    return router;
};
