import express from "express";
import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";
import {
  getBalanceTransferStatements,
  fetchLoadFundTransactions,
} from "../controllers/statement";
import { validateReqQuery } from "../middlewares/validator";
import { fetchBalanceTransferStatementQuerySchema } from "../schemas/statement";

const router = express();

// Route to fetch load-fund statements
router.get(
  "/load-fund",
  authenticate,
  authorize("users.load-balance"),
  fetchLoadFundTransactions
);

// Route to fetch balance-transfer statements
router.get(
  "/balance-transfer",
  validateReqQuery(fetchBalanceTransferStatementQuerySchema),
  authenticate,
  authorize("users.fetch-balance-transfer-statements"),
  getBalanceTransferStatements
);

export default router;
