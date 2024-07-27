import express from "express";
import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";
import {
  getBalanceTransferStatements,
  fetchLoadFundTransactions,
} from "../controllers/statement";

const router = express();

router.get(
  "/load-fund",
  authenticate,
  authorize("users.load-balance"),
  fetchLoadFundTransactions
);

router.get(
  "/balance-transfer",
  authenticate,
  authorize("users.delete"),
  getBalanceTransferStatements
);

export default router;
