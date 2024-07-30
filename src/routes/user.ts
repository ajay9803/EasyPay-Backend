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
import { createUserBodySchema, getUserParamsSchema } from "../schemas/user";

const router = express();

// create-user route to create new user
router.post("/", validateReqBody(createUserBodySchema), createNewUser);

// get-user route to fetch user by id
// make use of authenticate middleware to authenticate user for accessing further contents
router.get("/", authenticate, authorize("users.fetch"), getUserById);

router.get(
  "/receiver/",
  authenticate,
  authorize("users.fetch"),
  getUserByEmail
);

// update-user-route to  update user data
router.put(
  "/:id",
  validateRequestParams(getUserParamsSchema),
  validateReqBody(createUserBodySchema),
  authenticate,
  authorize("users.update"),
  updateUserById
);

// delete-user-route to delete user data
router.delete(
  "/:id",
  validateRequestParams(getUserParamsSchema),
  authenticate,
  authorize("users.delete"),
  deleteUserById
);

// update-password-route to update user password
router.patch(
  "/password/:id",
  validateRequestParams(getUserParamsSchema),
  authenticate,
  authorize("users.delete"),
  updatePassword
);

// update-email-route to update user email address
router.patch(
  "/email-address/:id",
  validateRequestParams(getUserParamsSchema),
  authenticate,
  authorize("users.delete"),
  updateEmail
);

// set-newpassword-route to set new password
router.patch(
  "/new-password/:id",
  validateRequestParams(getUserParamsSchema),
  setNewPassword
);

export default router;
