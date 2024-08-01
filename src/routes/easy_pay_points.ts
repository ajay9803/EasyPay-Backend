import express from "express";
import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";
import { redeemTheEasyPayPoints, updateEPayPoints } from "../controllers/easy_pay_point";

const router = express();

// Route to update Easy Pay Points
router.patch("/", authenticate, authorize("users.delete"), updateEPayPoints);

// Route to redeem Easy Pay Points
router.patch("/redeem", authenticate, authorize("users.delete"), redeemTheEasyPayPoints);

export default router;
