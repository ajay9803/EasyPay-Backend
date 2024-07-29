import express from "express";
import {
  applyForKyc,
  fetchKycApplication,
  fetchKycApplications,
  verifyKycApplication,
} from "../controllers/kyc";
import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";
import uploader from "../middlewares/file_upload";
import { validateReqBody, validateReqQuery } from "../middlewares/validator";
import {
  fetchKycApplicationsQuerySchema,
  verifyKycApplicationBodySchema,
} from "../schemas/kyc";

const router = express();

// user route to apply for kyc
router.post(
  "/apply",
  authenticate,
  authorize("users.apply-for-kyc"),
  uploader.fields([
    { name: "userPhoto", maxCount: 1 },
    { name: "citizenshipPhoto", maxCount: 1 },
  ]),
  applyForKyc
);

// user route to fetch single kyc application
router.get(
  "/application",
  authenticate,
  authorize("users.fetch-kyc-application"),
  fetchKycApplication
);

// admin route to fetch all kyc applications
router.get(
  "/applications",
  validateReqQuery(fetchKycApplicationsQuerySchema),
  authenticate,
  authorize("users.fetch-kyc-applications"),
  fetchKycApplications
);

// admin route to verify kyc application
router.patch(
  "/verify",
  validateReqBody(verifyKycApplicationBodySchema),
  authenticate,
  authorize("users.verify-kyc-application"),
  verifyKycApplication
);

export default router;