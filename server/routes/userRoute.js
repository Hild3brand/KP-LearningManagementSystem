import express from "express";
import { getUsers, createUser } from "../controllers/userController.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

router.get("/users", verifyToken, getUsers);
router.post("/users", verifyToken, createUser);

export default router;