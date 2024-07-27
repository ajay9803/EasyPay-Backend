import express from "express";

import userRouter from "./user";
import authRouter from "./auth";
import bankAccountRouter from "./bank_account";
import kycRouter from "./kyc";
import balanceRouter from "./balance";
import statementRouter from "./statement";

// app - router
const router = express();

router.use("/users", userRouter);
router.use("/auth", authRouter);
router.use("/user", bankAccountRouter);
router.use("/kyc", kycRouter);
router.use("/balance", balanceRouter);
router.use("/statements", statementRouter);

export default router;
