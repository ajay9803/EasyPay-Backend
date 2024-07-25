import express from "express";
import { getBankAccounts } from "../controllers/bank_account";
import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";

const router = express();

router.get(
  "/bank-accounts",
  authenticate,
  authorize("users.fetch-linked-bank-accounts"),
  getBankAccounts
);

export default router;
