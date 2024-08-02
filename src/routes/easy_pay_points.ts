import express from "express";
import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";
import {
  redeemTheEasyPayPoints,
  updateEPayPoints,
} from "../controllers/easy_pay_point";
import {
  validateReqBody,
} from "../middlewares/validator";
import { updateEasyPayPointsBodySchema } from "../schemas/easy_pay_points";

const router = express();

// Route to update Easy Pay Points
router.patch(
  "/",
  validateReqBody(updateEasyPayPointsBodySchema),
  authenticate,
  authorize("users.delete"),
  updateEPayPoints
);

// Route to redeem Easy Pay Points
router.patch(
  "/redeem",
  authenticate,
  authorize("users.delete"),
  redeemTheEasyPayPoints
);

export default router;
