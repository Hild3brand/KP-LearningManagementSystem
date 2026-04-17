import express from "express";

import { getUsers, Register, Login, Logout, deleteUser, updateUser, getUserProgress, finishLevel} from "../controllers/Users.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { RefreshToken } from "../controllers/RefreshToken.js";

const router = express.Router();

router.get('/users', verifyToken,getUsers);
router.delete('/users/:id', verifyToken, deleteUser);
router.patch('/users/:id', verifyToken, updateUser);
router.post('/register', Register);
router.post('/login', Login);
router.get('/token', RefreshToken);
router.delete('/logout', Logout);
router.get('/user-progress', getUserProgress);
router.post('/finish-level', finishLevel);

export default router;