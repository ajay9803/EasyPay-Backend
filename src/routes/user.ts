import express from "express";
import {
  createNewUser,
  deleteUserById,
  getUserById,
  updateUserById,
  applyForKyc,
  fetchKycApplication,
  fetchKycApplications,
  verifyKycApplication,
  loadBalance,
} from "../controllers/user";
import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";
import {
  validateReqBody,
  validateReqQuery,
  validateRequestParams,
} from "../middlewares/validator";
import {
  createUserBodySchema,
  getUserParamsSchema,
  loadBalanceBodySchema,
} from "../schemas/user";
import uploader from "../middlewares/file_upload";
import {
  applyForKycBodySchema,
  fetchKycApplicationsQuerySchema,
  verifyKycApplicationBodySchema,
} from "../schemas/kyc";
import bodyParser from "body-parser";

const router = express();

// create-user route to create new user
router.post("/", validateReqBody(createUserBodySchema), createNewUser);

// get-user router to fetch user by id
// make use of authenticate middleware to authenticate user for accessing further contents
router.get("/", authenticate, authorize("users.fetch"), getUserById);

// update-user-router to  update user data
router.put(
  "/:id",
  validateRequestParams(getUserParamsSchema),
  validateReqBody(createUserBodySchema),
  authenticate,
  authorize("users.update"),
  updateUserById
);

// delete-user-router to delete user data
router.delete(
  "/:id",
  validateRequestParams(getUserParamsSchema),
  authenticate,
  authorize("users.delete"),
  deleteUserById
);

router.post(
  "/apply-for-kyc",
  bodyParser.urlencoded({ extended: true }),
  // validateReqBody(applyForKycBodySchema),
  authenticate,
  authorize("users.apply-for-kyc"),
  uploader.fields([
    { name: "userPhoto", maxCount: 1 },
    { name: "citizenshipPhoto", maxCount: 1 },
  ]),
  applyForKyc
);

router.get(
  "/kyc-application",
  authenticate,
  authorize("users.fetch-kyc-application"),
  fetchKycApplication
);

router.get(
  "/kyc-applications",
  validateReqQuery(fetchKycApplicationsQuerySchema),
  authenticate,
  authorize("users.fetch-kyc-applications"),
  fetchKycApplications
);

router.patch(
  "/verify-kyc-application",
  validateReqBody(verifyKycApplicationBodySchema),
  authenticate,
  authorize("verify-kyc-application"),
  verifyKycApplication
);

router.patch(
  "/load-balance",
  validateReqBody(loadBalanceBodySchema),
  authenticate,
  authorize("load-balance"),
  loadBalance
);
export default router;
