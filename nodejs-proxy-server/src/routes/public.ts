import express, { Request, Response } from "express";
import axios from "axios";
import { generateToken } from "../utils/jwt";
import { QuarkusApiResponse } from "../type/qurarkusApiResponse";

const router = express.Router();

export default (QUARKUS_URL: string) => {
  router.post("/signup", async (req: Request, res: Response) => {
    try {
      console.log("HELLo");
      const response: Axios.AxiosXHR<QuarkusApiResponse> = await axios.post(
        `${QUARKUS_URL}/api/signup`,
        req.body,
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        }
      );
      res.status(response.status).json(response.data);
    } catch (err) {
      console.error("Signup proxy error:", err);
      res.status(500).json({ error: "Proxy error" });
    }
  });

  router.post("/login", async (req: Request, res: Response) => {
    try {
      const response:Axios.AxiosXHR<QuarkusApiResponse> = await axios.post(
        `${QUARKUS_URL}/api/login`,
        req.body,
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        }
      );
      if (
        response.status === 200 &&
        response.data &&
        response.data.success &&
        response.data.data
      ) {
        const user = response.data.data;
        const token = generateToken(user);
        res.cookie("session_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({token, user});
      } else {
        res.status(response.status).json();
      }
    } catch (err) {
      console.error("Login proxy error:", err);
      res.status(500).json({ error: "Proxy error" });
    }
  });

  router.post("/verify-email/:token", async (req: Request, res: Response) => {
    const token = req.params.token;
    console.log("TOKEN", token);
    try {
      const response = await axios.get(
        `${QUARKUS_URL}/api/verify?token=${encodeURIComponent(token)}`,
        {
          validateStatus: () => true,
        }
      );
      res.status(response.status).json(response.data);
    } catch (err) {
      console.error("Email verification proxy error:", err);
      res
        .status(500)
        .json({ message: "Internal Server Error", success: false });
    }
  });

  return router;
};
