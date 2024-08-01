import express from "express";
import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";
import { createTheSocket, deleteTheSocket } from "../controllers/socket";

const router = express();

// Route to store socket along with user id
router.post("/", authenticate, authorize("users.delete"), createTheSocket);

// Route to delete the socket 
router.delete("/", authenticate, authorize("users.delete"), deleteTheSocket);

export default router;
