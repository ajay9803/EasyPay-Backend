import express from "express";
import {
  createNewUser,
  deleteUserById,
  getUserByEmail,
  getUserById,
  updateUserById,
  updatePassword,
  updateEmail,
  setNewPassword,
} from "../controllers/user";
import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";
import {
  validateReqBody,
  validateRequestParams,
} from "../middlewares/validator";
import {
  createUserBodySchema,
  getUserParamsSchema,
  setNewPasswordBodySchema,
  updateEmailBodySchema,
  updatePasswordBodySchema,
} from "../schemas/user";

const router = express();

// Create-user route to create new user
router.post("/", validateReqBody(createUserBodySchema), createNewUser);

// Get-user route to fetch user by id
router.get("/", authenticate, authorize("users.fetch"), getUserById);

router.get(
  "/receiver/",
  authenticate,
  authorize("users.fetch"),
  getUserByEmail
);

// Update-user-route to  update user data
router.put(
  "/:id",
  validateRequestParams(getUserParamsSchema),
  validateReqBody(createUserBodySchema),
  authenticate,
  authorize("users.update"),
  updateUserById
);

// Delete-user-route to delete user data
router.delete(
  "/:id",
  validateRequestParams(getUserParamsSchema),
  authenticate,
  authorize("users.delete"),
  deleteUserById
);

// Update-password-route to update user password
router.patch(
  "/password/:id",
  validateRequestParams(getUserParamsSchema),
  validateReqBody(updatePasswordBodySchema),
  authenticate,
  authorize("users.update-password"),
  updatePassword
);

// Update-email-route to update user email address
router.patch(
  "/email-address/:id",
  validateRequestParams(getUserParamsSchema),
  validateReqBody(updateEmailBodySchema),
  authenticate,
  authorize("users.update-email"),
  updateEmail
);

// Set-newpassword-route to set new password
router.patch(
  "/new-password/:id",
  validateRequestParams(getUserParamsSchema),
  validateReqBody(setNewPasswordBodySchema),
  setNewPassword
);

export default router;
