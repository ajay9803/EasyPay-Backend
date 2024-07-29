import express from "express";
import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";
import {
  getBalanceTransferStatements,
  fetchLoadFundTransactions,
} from "../controllers/statement";

const router = express();

// route to fetch load-fund statements
router.get(
  "/load-fund",
  authenticate,
  authorize("users.load-balance"),
  fetchLoadFundTransactions
);

// route to fetch balance-transfer statements
router.get(
  "/balance-transfer",
  authenticate,
  authorize("users.delete"),
  getBalanceTransferStatements
);

export default router;
