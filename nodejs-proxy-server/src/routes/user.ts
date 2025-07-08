import express, { Request, Response } from "express";
import axios from "axios";
import { requireAuth } from "../middleware/requireAuth";
import { QuarkusApiResponse } from "../type/qurarkusApiResponse";

const router = express.Router();

export default (QUARKUS_URL: string) => {
  router.get(
    "/status",
    requireAuth,
    async (req: Request, res: Response): Promise<void> => {
      try {
        const userId = (req as any).user?.userId;
        if (!userId) {
          res
            .status(401)
            .json({ success: false, message: "User not authenticated" });
          return;
        }

        const response: Axios.AxiosXHR<QuarkusApiResponse> = await axios.get(
          `${QUARKUS_URL}/api/check-status/${userId}`,
          {
            validateStatus: () => true,
          }
        );

        if (response.status === 200 && response.data && response.data.success) {
          res.status(200).json(response.data);
        } else {
          res.status(response.status).json(response.data);
        }
      } catch (err) {
        console.error("User status proxy error:", err);
        res.status(500).json({ message: "Proxy error", success: false });
      }
    }
  );

  return router;
};
