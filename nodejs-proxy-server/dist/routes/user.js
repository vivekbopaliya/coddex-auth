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
const requireAuth_1 = require("../middleware/requireAuth");
const router = express_1.default.Router();
exports.default = (QUARKUS_URL) => {
    router.get("/status", requireAuth_1.requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            if (!userId) {
                res
                    .status(401)
                    .json({ success: false, message: "User not authenticated" });
                return;
            }
            const response = yield axios_1.default.get(`${QUARKUS_URL}/api/check-status/${userId}`, {
                validateStatus: () => true,
            });
            if (response.status === 200 && response.data && response.data.success) {
                res.status(200).json(response.data);
            }
            else {
                res.status(response.status).json(response.data);
            }
        }
        catch (err) {
            console.error("User status proxy error:", err);
            res.status(500).json({ message: "Proxy error", success: false });
        }
    }));
    return router;
};
