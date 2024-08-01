import express from "express";
import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";
import { createQuizData, fetchQuizData } from "../controllers/quiz";

const router = express();

// Route to store socket along with user id
router.post("/", authenticate, authorize("users.delete"), createQuizData);

// Route to delete the socket
router.get("/", authenticate, authorize("users.delete"), fetchQuizData);

export default router;
