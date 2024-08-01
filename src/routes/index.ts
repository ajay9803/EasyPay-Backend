import express from "express";

import userRouter from "./user";
import authRouter from "./auth";
import bankAccountRouter from "./bank_account";
import kycRouter from "./kyc";
import balanceRouter from "./balance";
import statementRouter from "./statement";
import notificationRouter from "./notification";
import socketRouter from "./socket";
import quizDataRouter from "./quiz";
import easyPayPointsRouter from "./easy_pay_points";

// App - router
const router = express();

router.use("/users", userRouter);
router.use("/auth", authRouter);
router.use("/user", bankAccountRouter);
router.use("/kyc", kycRouter);
router.use("/balance", balanceRouter);
router.use("/statements", statementRouter);
router.use("/user", notificationRouter);
router.use("/sockets", socketRouter);
router.use("/quiz-data", quizDataRouter);
router.use("/easy-pay-points", easyPayPointsRouter);

export default router;
