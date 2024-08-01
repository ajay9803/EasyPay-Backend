import express from "express";
import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";
import { fetchTheNotifications } from "../controllers/notification";
import { validateReqQuery } from "../middlewares/validator";
import { fetchNotificationsQuerySchema } from "../schemas/notification";

const router = express();

// Route to fetch Notifications
router.get(
  "/notifications",
  validateReqQuery(fetchNotificationsQuerySchema),
  authenticate,
  authorize("users.fetch-notifications"),
  fetchTheNotifications
);

export default router;
