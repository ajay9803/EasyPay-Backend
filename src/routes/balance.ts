import express from "express";
import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";
import { loadBalance, transferBalance } from "../controllers/balance";
import { loadBalanceBodySchema, transferBalanceBodySchema } from "../schemas/balance";
import { validateReqBody } from "../middlewares/validator";

const router = express();

// route to load balance
router.patch(
  "/load",
  validateReqBody(loadBalanceBodySchema),
  authenticate,
  authorize("users.load-balance"),
  loadBalance
);

// route to transfer balance
router.patch(
  "/transfer",
  validateReqBody(transferBalanceBodySchema),
  authenticate,
  authorize("users.apply-for-kyc"),
  transferBalance
);

export default router;