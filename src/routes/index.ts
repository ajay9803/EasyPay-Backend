import express from "express";

import userRouter from "./user";
import authRouter from "./auth";
import bankAccountRouter from "./bank_account";

// app - router
const router = express();

router.use("/users", userRouter);
router.use("/auth", authRouter);
router.use("/user", bankAccountRouter);

export default router;
