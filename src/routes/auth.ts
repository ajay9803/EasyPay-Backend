import express from "express";
import {
  login,
  refreshAccessToken,
  sendSignupOtp,
  sendChangeEmailOtp,
  sendForgotPasswordLink,
} from "../controllers/auth";
import { validateReqBody } from "../middlewares/validator";
import { loginUserSchema } from "../schemas/user";
import { authenticate } from "../middlewares/auth";

const router = express();

// login route to generate tokens
router.post("/login", validateReqBody(loginUserSchema), login);

// refresh token route to regenerate access token
router.post("/refresh-access-token", refreshAccessToken);

// sign-up-otp route to send sign-up otp
router.post("/sign-up-otp", sendSignupOtp);

// change-email-otp route to send update-email otp
router.post("/update-email-otp", authenticate, sendChangeEmailOtp);

// forgot-password-link route to send reset password link
router.post("/forgot-password-link", sendForgotPasswordLink);

export default router;
