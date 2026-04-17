import express from "express";
// Ubah baris import ini biar dia manggil 2 fungsi sekaligus
import { chat, generateLevelQuiz } from "../controllers/chatbotController.js"; 

const router = express.Router();

router.post("/chat", chat);
// Tambahkan rute baru ini
router.post("/generate-level-quiz", generateLevelQuiz); 

export default router;