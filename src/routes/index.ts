import express from "express";

import userRouter from "./user";
import authRouter from "./auth";

// app - router
const router = express();

router.use("/users", userRouter);
router.use("/auth", authRouter);

export default router;
