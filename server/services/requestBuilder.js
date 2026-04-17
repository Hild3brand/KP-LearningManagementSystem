export const buildChatRequest = (userMessage, level) => {
  let systemPrompt = "";
  
  // Pastikan level berupa angka untuk pengecekan
  const currentLevel = Number(level) || 1; 
  console.log("Level yang masuk dari frontend:", currentLevel);

  // Deteksi otomatis kalau request ini minta kuis JSON
  const isQuizRequest = typeof userMessage === "string" && userMessage.toUpperCase().includes("JSON");

  if (isQuizRequest) {
    console.log(`🔥 MODE KUIS JSON AKTIF (Level: ${currentLevel}) 🔥`);
    
    // Instruksi spesifik berdasarkan level Bloom's Taxonomy
    let levelInstruction = "";
    if (currentLevel === 1) {
      levelInstruction = "TINGKAT KESULITAN: Level 1 (Mengingat). Buat soal hafalan dasar seperti pengenalan huruf (Vokal/Konsonan) atau arti kosakata dasar.";
    } else if (currentLevel === 2) {
      levelInstruction = "TINGKAT KESULITAN: Level 2 (Memahami). Buat soal pemahaman makna kata, penggunaan partikel dasar (seperti 은/는, 이/가), atau terjemahan kalimat sederhana.";
    } else if (currentLevel === 3) {
      levelInstruction = "TINGKAT KESULITAN: Level 3 (Menerapkan). Buat soal praktik seperti melengkapi kalimat rumpang, menyusun kata menjadi kalimat yang benar, atau memilih tata bahasa yang tepat dalam konteks.";
    } else {
      levelInstruction = "TINGKAT KESULITAN: Umum. Buatkan soal bahasa Korea standar.";
    }

    systemPrompt = `
      Anda adalah mesin pembuat kuis bahasa Korea berformat JSON murni.
      
      ${levelInstruction}
      
      ATURAN KONTEN KUIS:
      1. Bagian "question" WAJIB menggunakan abjad Latin/Indonesia (Contoh benar: "Huruf Korea untuk bunyi 'u' adalah?").
      2. DILARANG KERAS menanyakan Hangul dengan Hangul (Contoh salah: "Huruf Korea untuk '우' adalah?").
      3. Bagian "options" dan "answer" WAJIB menggunakan huruf Hangul Korea.
      4. Anda HANYA boleh mengeluarkan output berupa JSON Array Murni. Jangan gunakan markdown (seperti \`\`\`json) atau teks pengantar apapun.
    `;
    
    // Injeksi format wajib ke pesan user
    userMessage = userMessage + `\n\nOUTPUT WAJIB MENGGUNAKAN STRUKTUR JSON INI DAN HANYA JSON INI SAJA:\n[\n  {\n    "question": "Huruf Korea untuk bunyi 'u' adalah?",\n    "options": ["ㅏ", "ㅓ", "ㅗ", "ㅜ"],\n    "answer": "ㅜ"\n  }\n]`;
  } 
  else if (currentLevel === 1) {
    console.log("User is at Remembering level");
    systemPrompt = `
      ROLE:
      You are an AI Korean language tutor.

      LEARNING STATE:
      Bloom Level: Remembering

      INSTRUCTION:
      Ask the student to recall information related to the topic.
      Do not give hints or examples unless the student fails.

      NOTE:
      - Answer clearly and concisely
      - Use short paragraphs
      - Use bullet points if needed
      - Highlight important words using **bold**
      - Use line breaks for readability
      - Do NOT return long dense text
    `;
  } 
  else if (currentLevel === 2) {
    console.log("User is at Understanding level");
    systemPrompt = `
      ROLE:
      You are a Korean language tutor.

      LEARNING STATE:
      Bloom Level: Understanding

      TASK:
      Explain the meaning of the sentence.
      
      NOTE:
      - Answer clearly and concisely
      - Use short paragraphs
      - Use bullet points if needed
      - Highlight important words using **bold**
      - Use line breaks for readability
      - Do NOT return long dense text
    `;
  } 
  else if (currentLevel === 3) {
    console.log("User is at Applying level");
    systemPrompt = `
      ROLE:
      You are a Korean tutor.

      LEARNING STATE:
      Bloom Level: Applying

      INSTRUCTION:
      Guide step by step:
      1 Identify vocabulary
      2 Choose grammar
      3 Construct sentence

      NOTE:
      - Answer clearly and concisely
      - Use short paragraphs
      - Use bullet points if needed
      - Highlight important words using **bold**
      - Use line breaks for readability
      - Do NOT return long dense text
    `;
  } 
  else {
    console.log("User level is unknown or not provided");
    systemPrompt = `
      ROLE:
      You are a helpful AI Korean language tutor.

      INSTRUCTION:
      Answer the user's question clearly and concisely about Korean language. 
      If they ask for a quiz, wait for the proper prompt format.

      NOTE:
      - Answer clearly and concisely
      - Use short paragraphs
      - Use bullet points if needed
      - Highlight important words using **bold**
      - Use line breaks for readability
      - Do NOT return long dense text
    `;
  }

  return {
    messages: [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: userMessage
      }
    ],
    maxTokens: 2000, 
    temperature: 0.3, 
    topP: 0.8
  };
};