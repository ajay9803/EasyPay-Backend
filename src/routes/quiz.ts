import express from "express";
import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";
import { createQuizData, fetchQuizData } from "../controllers/quiz";
import {
  validateReqBody,
  validateRequestParams,
} from "../middlewares/validator";
import { createQuizDataBodySchema } from "../schemas/quiz";

const router = express();

// Route to store socket along with user id
router.post("/", validateReqBody(createQuizDataBodySchema), authenticate, authorize("users.delete"), createQuizData);

// Route to delete the socket
router.get("/", authenticate, authorize("users.delete"), fetchQuizData);

export default router;
