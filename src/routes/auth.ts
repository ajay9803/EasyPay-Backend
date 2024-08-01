import express from "express";
import {
  login,
  refreshAccessToken,
  sendSignupOtp,
  sendChangeEmailOtp,
  sendForgotPasswordLink,
} from "../controllers/auth";
import { validateReqBody } from "../middlewares/validator";
import { loginUserSchema, sendOtpBodySchema } from "../schemas/user";
import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";

const router = express();

// Login route to generate tokens
router.post("/login", validateReqBody(loginUserSchema), login);

// Refresh token route to regenerate access token
router.post("/refresh-access-token", refreshAccessToken);

// Sign-up-otp route to send sign-up otp
router.post("/sign-up-otp", validateReqBody(sendOtpBodySchema), sendSignupOtp);

// Change-email-otp route to send update-email otp
router.post(
  "/update-email-otp",
  validateReqBody(sendOtpBodySchema),
  authenticate,
  authorize("users.send-update-email-otp"),
  sendChangeEmailOtp
);

// Forgot-password-link route to send reset password link
router.post(
  "/forgot-password-link",
  validateReqBody(sendOtpBodySchema),
  sendForgotPasswordLink
);

export default router;
