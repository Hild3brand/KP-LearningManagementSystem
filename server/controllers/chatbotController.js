import { buildChatRequest } from "../services/requestBuilder.js";
import { callHyperClova } from "../services/hyperclovaClient.js";
import { processClovaResponse } from "../services/responseProcessor.js";
import { logMetric } from "../utils/logger.js";
import axios from "axios"; 

// ==========================================
// 1. FUNGSI CHATBOT (ASLI PUNYA LU)
// ==========================================
export const chat = async (req, res, next) => {
  const start = Date.now();

  try {
    if (!req.body || !req.body.message) {
      return res.status(400).json({
        success: false,
        error: "Message is required",
      });
    }

    const { message, level, currentXP, quizScore } = req.body;
    const payload = buildChatRequest(message, level);
    const clovaResponse = await callHyperClova(payload);
    const result = processClovaResponse(clovaResponse);
    const end = Date.now();

    logMetric(message, result.message, end - start);

    let updatedXP = currentXP || 0; 
    let currentLevel = Number(level) || 1; 
    let feedbackNotif = null;

    if (quizScore !== undefined) {
      updatedXP += quizScore; 
      if (updatedXP >= 100) {
        currentLevel += 1;
        updatedXP = updatedXP - 100; 
        feedbackNotif = `🎉 Selamat! Kamu naik ke Level ${currentLevel}! Sistem belajar sekarang meningkat.`;
      }
    }

    res.json({
      success: true,
      reply: result.message,
      level: currentLevel, 
      xp: updatedXP,       
      notif: feedbackNotif 
    });

  } catch (error) {
    console.error("Chatbot Error:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

// ==========================================
// 2. FUNGSI BARU BUAT GENERATE SOAL DI PETA 
// ==========================================
export const generateLevelQuiz = async (req, res) => {
    const { levelId } = req.body;

    try {
        const payload = {
            messages: [
                {
                    role: "system",
                    content: `Kamu adalah mesin pembuat soal Bahasa Korea berformat JSON array murni. 
                    ATURAN WAJIB JSON:
                    1. Semua nama properti (key) WAJIB menggunakan kutip ganda (contoh: "question").
                    2. Jangan gunakan koma di elemen terakhir array atau object.
                    3. Jangan berikan teks pembuka/penutup apapun selain JSON.`
                },
                {
                    role: "user",
                    // 👇 KITA TAMBAHIN KATA "BAHASA KOREA" DAN CONTOHNYA KITA GANTI 👇
                    content: `Buatlah 5 soal kuis pilihan ganda seputar Bahasa Korea (kosakata, tata bahasa, atau terjemahan) untuk tingkat kesulitan level ${levelId}. 
                    Berikan dalam format persis seperti ini:
                    [
                      {
                        "question": "Apa bahasa Koreanya 'Terima kasih'?",
                        "options": ["Kamsahamnida", "Saranghae", "Mianhae", "Annyeonghaseyo"],
                        "answer": "Kamsahamnida"
                      }
                    ]`
                }
            ],
            temperature: 0.2, 
            topP: 0.8,
            maxTokens: 1500
        };
        
        const clovaResponse = await callHyperClova(payload);
        const aiText = clovaResponse.result.message.content; 
        const cleanJson = aiText.replace(/```json|```/g, "").trim();
        
        // 👇 CCTV BUAT NGINTIP HASIL MENTAH AI DI TERMINAL 👇
        console.log("--- HASIL MENTAH DARI AI ---");
        console.log(cleanJson);
        console.log("----------------------------");
        
        let quizData;
        try {
            quizData = JSON.parse(cleanJson);
        } catch (parseError) {
            console.error("❌ FORMAT JSON DARI AI RUSAK!");
            return res.status(500).json({ 
                success: false, 
                message: "Aduh, AI kepotong pas ngomong. Coba klik lagi!" 
            });
        }

        res.json({
            success: true,
            quizData: quizData
        });

    } catch (error) {
        console.error("Error HyperCLOVA Map AI:", error.response?.data || error.message);
        res.status(500).json({ success: false, message: "Gagal generate soal dari API" });
    }
};