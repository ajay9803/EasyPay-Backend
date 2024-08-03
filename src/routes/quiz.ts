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

// Route to create quiz data
router.post("/", validateReqBody(createQuizDataBodySchema), authenticate, authorize("users.delete"), createQuizData);

// Route to fetch quiz data
router.get("/", authenticate, authorize("users.delete"), fetchQuizData);

export default router;
