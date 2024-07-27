import express from "express";
import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";
import { loadBalance, transferBalance } from "../controllers/balance";
import { loadBalanceBodySchema } from "../schemas/user";
import { validateReqBody } from "../middlewares/validator";

const router = express();

router.patch(
  "/load",
  validateReqBody(loadBalanceBodySchema),
  authenticate,
  authorize("users.load-balance"),
  loadBalance
);

router.patch(
  "/transfer",
  authenticate,
  authorize("users.apply-for-kyc"),
  transferBalance
);

export default router;
