import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';


const ChatbotPage = () => {
    const [userData, setUserData] = useState({ name: 'Student', level: 'Beginner 1', xp: 0 });
    const [token, setToken] = useState('');
    const [completedLevels, setCompletedLevels] = useState([]); 
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    const [messages, setMessages] = useState([
        { sender: 'bot', type: 'text', text: 'Halo! Saya Asisten AI Daesan. Jika kamu sudah menyelesaikan Stage 1, kamu bisa ngobrol atau minta Mini Quiz dari saya!' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false); 
    const messagesEndRef = useRef(null);

    const themeColor = "#f97316"; 

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resToken = await axios.get(`${process.env.REACT_APP_BE_API_URL}/token`, { withCredentials: true });
                const accessToken = resToken.data.accessToken;
                const decoded = jwtDecode(accessToken);
                setToken(accessToken);
                setUserData({ name: decoded.name, level: decoded.level || 'Beginner 1', xp: decoded.xp });

                const resProgress = await axios.get(`${process.env.REACT_APP_BE_API_URL}/user-progress`, { 
                    headers: { Authorization: `Bearer ${accessToken}` }, 
                    withCredentials: true 
                });
                setCompletedLevels(resProgress.data.completedLevels || []);
            } catch (error) { navigate('/'); }
        };
        fetchData();
    }, [navigate]);

    const isChatbotUnlocked = completedLevels.includes('R1-4'); 

    const extractJSONArray = (text) => {
        try {
            const match = text.match(/\[[\s\S]*\]/);
            return match ? JSON.parse(match[0]) : null;
        } catch (e) { return null; }
    };

    const handleSendMessage = async (customMessage = null) => {
        const textToSend = customMessage || input;
        if (!textToSend.trim() || isLoading || isGeneratingQuiz) return;

        if (!customMessage) {
            setMessages(prev => [...prev, { sender: 'user', type: 'text', text: textToSend }]);
            setInput(''); 
        }
        
        setIsLoading(true); 
        try {
            const response = await axios.post(`${process.env.REACT_APP_BE_API_URL}/api/chat`, {
                message: `(PENTING: Jawablah selalu dalam Bahasa Indonesia) ${textToSend}`,
                history: messages.filter(m => m.type === 'text').slice(-5)
            }, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true });

            let botReply = response.data.reply || response.data.response || "Pesan diterima.";
            setMessages(prev => [...prev, { sender: 'bot', type: 'text', text: botReply }]);
        } catch (error) {
            setMessages(prev => [...prev, { sender: 'bot', type: 'text', text: "Maaf, server AI sedang sibuk." }]);
        } finally { setIsLoading(false); }
    };

    const handleQuickReply = (text) => {
        if (isLoading || isGeneratingQuiz) return;
        setMessages(prev => [...prev, { sender: 'user', type: 'text', text: text }]);
        handleSendMessage(text);
    };

    const handleGenerateQuiz = async () => {
        setIsGeneratingQuiz(true); 
        setMessages(prev => [...prev, { sender: 'user', type: 'text', text: "Mulai Mini Quiz!" }]);
        
        const prompt = `Buatkan 5 soal kuis Bahasa Korea untuk orang Indonesia.
        
        ATURAN KETAT:
        1. SEMUA jawaban (field "answer") dan pilihan (field "options") HARUS menggunakan Bahasa Indonesia.
        2. USER TIDAK BOLEH diminta mengetik dalam karakter Hangul.
        3. Jenis soal: "Apa arti dari kata [Bahasa Korea]..." atau "Terjemahkan ke Indonesia...".
        4. Field "explanation" harus dalam Bahasa Indonesia.

        Balas HANYA JSON array: 
        [{"type":"multiple_choice","question":"...","options":["...","...","...","..."],"answer":"...","explanation":"..."},{"type":"fill_in_the_blank","question":"...","answer":"...","explanation":"..."}]`;

        try {
            const response = await axios.post(`${process.env.REACT_APP_BE_API_URL}/api/chat`, { 
                message: prompt, 
                history: [] 
            }, { headers: { Authorization: `Bearer ${token}` } });
            
            const quizData = extractJSONArray(response.data.reply || response.data.response);
            
            if (quizData) {
                setMessages(prev => [...prev, { 
                    sender: 'bot', 
                    type: 'quiz_batch', 
                    questions: quizData,
                    userAnswers: Array(quizData.length).fill(""),
                    currentIndex: 0,
                    isSubmitted: false,
                    score: 0
                }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { sender: 'bot', type: 'text', text: "Gagal memuat kuis." }]);
        } finally { setIsGeneratingQuiz(false); }
    };

    const calculateScore = (quizMsg) => {
        let correctCount = 0;
        quizMsg.questions.forEach((q, i) => {
            const uAns = (quizMsg.userAnswers[i] || "").trim().toLowerCase();
            const cAns = (q.answer || "").trim().toLowerCase();
            if (uAns === cAns) correctCount++;
        });
        return Math.round((correctCount / quizMsg.questions.length) * 100);
    };

    const sidebarBtnStyle = (isActive) => ({
        border: isActive ? `1px solid ${themeColor}` : '1px solid #ced4da',
        color: isActive ? themeColor : '#6c757d',
        backgroundColor: isActive ? '#fff4eb' : 'white',
        fontWeight: '600', padding: '10px 15px', borderRadius: '8px',
        display: 'flex', alignItems: 'center', gap: '12px', width: '100%', fontSize: '14px', marginBottom: '12px', cursor: 'pointer', transition: 'all 0.2s'
    });

    return (
        <div style={{ backgroundColor: "#f8f9fa", minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>
            
            {/* NAVBAR */}
            <div style={{ backgroundColor: themeColor, padding: '12px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '20px' }}>Daesan</span>
                    <div style={{ borderLeft: '1px solid rgba(255,255,255,0.4)', height: '30px', margin: '0 20px' }}></div>
                    <div style={{ lineHeight: '1.2' }}>
                        <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Hi, {userData.name} 👋</div>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                            <span style={{ fontSize: '11px', backgroundColor: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>⭐ {userData.level}</span>
                            <span style={{ fontSize: '11px', backgroundColor: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>⚡ {userData.xp} XP</span>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button style={{ background: 'transparent', border: '1px solid white', borderRadius: '8px', color: 'white', padding: '6px 12px' }}><i className="bi bi-bell-fill"></i></button>
                    <div style={{ position: 'relative' }}>
                        <button onClick={() => setShowDropdown(!showDropdown)} style={{ background: 'transparent', border: '1px solid white', borderRadius: '20px', color: 'white', padding: '6px 16px', display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px', fontWeight: 'bold' }}>
                            <i className="bi bi-person-circle fs-5"></i> {userData.name}
                        </button>
                        {showDropdown && (
                            <div className="dropdown-menu show shadow-sm" style={{ position: 'absolute', top: '120%', right: 0, fontSize: '13px' }}>
                                <button className="dropdown-item text-danger fw-bold" onClick={() => navigate('/')}>Logout</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', flexGrow: 1 }}>
                {/* SIDEBAR */}
                <div style={{ width: '240px', backgroundColor: 'white', padding: '25px 20px', borderRight: '1px solid #dee2e6' }}>
                    <button onClick={() => navigate('/student-dashboard')} style={sidebarBtnStyle(false)}><i className="bi bi-grid-fill"></i> Dashboard</button>
                    <button style={sidebarBtnStyle(false)}><i className="bi bi-journal-text"></i> Course</button>
                    <button onClick={() => navigate('/level')} style={sidebarBtnStyle(false)}><i className="bi bi-signpost-2-fill"></i> Learning Path</button>
                    <button style={sidebarBtnStyle(true)}><i className="bi bi-robot"></i> Chatbot</button>
                </div>

                {/* CONTENT */}
                <div style={{ flexGrow: 1, padding: '30px', display: 'flex', flexDirection: 'column' }}>
                    <div className="card shadow-sm border-0 d-flex flex-column" style={{ borderRadius: '12px', flexGrow: 1, maxHeight: 'calc(100vh - 100px)', position: 'relative' }}>
                        
                        <div className="card-header bg-white border-0 pt-4 pb-2 px-4 d-flex justify-content-between align-items-center">
                            <h4 className="fw-bold mb-0">Konsultasi AI HyperCLOVA 🤖</h4>
                            {isChatbotUnlocked && (
                                <button onClick={handleGenerateQuiz} disabled={isLoading || isGeneratingQuiz} className="btn btn-sm text-white fw-bold shadow-sm" style={{ backgroundColor: '#10b981', borderRadius: '8px', padding: '8px 16px' }}>
                                    {isGeneratingQuiz ? 'Meracik...' : 'Start Exercise!'}
                                </button>
                            )}
                        </div>
                        
                        <div className="card-body p-4 d-flex flex-column" style={{ overflow: 'hidden' }}>
                            <div style={{ flexGrow: 1, overflowY: 'auto', paddingRight: '10px', marginBottom: '20px' }}>
                                {messages.map((msg, index) => (
                                    <div key={index} className={`d-flex mb-3 ${msg.sender === 'user' ? 'justify-content-end' : ''}`}>
                                        {msg.type === 'quiz_batch' ? (
                                            <div className="card border shadow-sm w-100" style={{ maxWidth: '600px', borderRadius: '15px' }}>
                                                <div className="card-body p-4">
                                                    {!msg.isSubmitted ? (
                                                        <>
                                                            <div className="mb-2 text-muted small fw-bold">SOAL {msg.currentIndex + 1} / {msg.questions.length}</div>
                                                            <h5 className="fw-bold mb-4">{msg.questions[msg.currentIndex].question}</h5>
                                                            
                                                            {msg.questions[msg.currentIndex].type === 'multiple_choice' ? (
                                                                <div className="d-grid gap-2">
                                                                    {msg.questions[msg.currentIndex].options.map((opt, i) => (
                                                                        <button key={i} onClick={() => {
                                                                            const newMsgs = [...messages];
                                                                            newMsgs[index].userAnswers[msg.currentIndex] = opt;
                                                                            setMessages(newMsgs);
                                                                        }} className={`btn text-start p-3 border ${msg.userAnswers[msg.currentIndex] === opt ? 'border-warning bg-light' : ''}`} style={{ borderRadius: '10px' }}>
                                                                            {opt}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <input type="text" className="form-control p-3 border-warning" placeholder="Ketik jawaban (Indonesia)..." value={msg.userAnswers[msg.currentIndex]} onChange={(e) => {
                                                                    const newMsgs = [...messages];
                                                                    newMsgs[index].userAnswers[msg.currentIndex] = e.target.value;
                                                                    setMessages(newMsgs);
                                                                }} style={{ borderRadius: '10px' }} />
                                                            )}

                                                            <div className="d-flex justify-content-between mt-4">
                                                                <button className="btn btn-light border" onClick={() => {
                                                                    const newMsgs = [...messages];
                                                                    newMsgs[index].currentIndex--;
                                                                    setMessages(newMsgs);
                                                                }} disabled={msg.currentIndex === 0}> <i className="bi bi-arrow-left"></i> Kembali</button>
                                                                
                                                                {msg.currentIndex === msg.questions.length - 1 ? (
                                                                    <button className="btn text-white fw-bold" style={{ backgroundColor: themeColor }} onClick={() => {
                                                                        const newMsgs = [...messages];
                                                                        newMsgs[index].isSubmitted = true;
                                                                        newMsgs[index].score = calculateScore(newMsgs[index]);
                                                                        setMessages(newMsgs);
                                                                        handleSendMessage(`Saya selesai! Skor saya: ${newMsgs[index].score}`);
                                                                    }}>Periksa Jawaban</button>
                                                                ) : (
                                                                    <button className="btn btn-dark" onClick={() => {
                                                                        const newMsgs = [...messages];
                                                                        newMsgs[index].currentIndex++;
                                                                        setMessages(newMsgs);
                                                                    }}>Lanjut <i className="bi bi-arrow-right"></i></button>
                                                                )}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div>
                                                            <div className="text-center mb-4">
                                                                <h3 className="fw-bold mb-0">Hasil Kuis 📝</h3>
                                                                <div className="display-4 fw-bold text-warning">{msg.score}</div>
                                                                <p className="text-muted">Poin yang kamu dapatkan</p>
                                                            </div>
                                                            <hr/>
                                                            <h6 className="fw-bold mb-3">Pembahasan Soal:</h6>
                                                            <div style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '5px' }}>
                                                                {msg.questions.map((q, i) => {
                                                                    const isCorrect = (msg.userAnswers[i] || "").trim().toLowerCase() === (q.answer || "").trim().toLowerCase();
                                                                    return (
                                                                        <div key={i} className="mb-4 p-3 rounded bg-light border-start border-4 border-warning">
                                                                            <p className="fw-bold mb-1">{i + 1}. {q.question}</p>
                                                                            <div className="small mb-2">
                                                                                <span className="text-muted">Jawabanmu: </span> 
                                                                                <span className={isCorrect ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                                                                                    {msg.userAnswers[i] || "(Kosong)"}
                                                                                </span>
                                                                                {!isCorrect && (
                                                                                    <div className="text-success small fw-bold mt-1">Jawaban Benar: {q.answer}</div>
                                                                                )}
                                                                            </div>
                                                                            <div className="p-2 bg-white rounded border small italic">
                                                                                <strong>Penjelasan:</strong> {q.explanation || "Pelajari lebih lanjut tentang kosakata ini."}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                            <button className="btn btn-outline-warning w-100 mt-3 fw-bold" onClick={handleGenerateQuiz}>Coba Kuis Lagi</button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div style={{ 
                                                maxWidth: '75%', padding: '12px 18px', 
                                                borderRadius: msg.sender === 'user' ? '15px 15px 0px 15px' : '15px 15px 15px 0px',
                                                backgroundColor: msg.sender === 'user' ? themeColor : '#f1f3f5',
                                                color: msg.sender === 'user' ? 'white' : '#333',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)', whiteSpace: 'pre-wrap'
                                            }}>
                                                {msg.text}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* TEMPLATE PROMPT BUTTONS */}
                            <div className="d-flex gap-2 mb-3 flex-wrap">
                                {[
                                    { label: "Konsonan", prompt: "Saya ingin belajar huruf konsonan Korea" },
                                    { label: "Vokal", prompt: "Saya ingin belajar huruf vokal Korea" },
                                    { label: "Kalimat Dasar", prompt: "Ajarkan saya kalimat-kalimat dasar Korea" }
                                ].map((item, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleQuickReply(item.prompt)}
                                        disabled={isLoading || isGeneratingQuiz}
                                        className="btn btn-sm btn-outline-warning fw-bold shadow-sm"
                                        style={{ borderRadius: '20px', fontSize: '12px', padding: '5px 15px' }}
                                    >
                                        + {item.label}
                                    </button>
                                ))}
                            </div>

                            {/* INPUT AREA YANG DI-DISABLE PERMANEN */}
                            <div className="d-flex gap-2 p-2 rounded-3 border bg-light shadow-sm" style={{ opacity: 0.8 }}>
                                <input 
                                    type="text" 
                                    value={input} 
                                    readOnly 
                                    placeholder="Pilih materi di atas untuk mulai belajar..." 
                                    className="form-control border-0 bg-transparent shadow-none" 
                                    style={{ cursor: 'not-allowed' }}
                                    disabled={true} 
                                />
                                <button 
                                    disabled={true} 
                                    className="btn text-white fw-bold d-flex align-items-center gap-2" 
                                    style={{ 
                                        backgroundColor: '#adb5bd', // Warna abu-abu pasif
                                        borderRadius: '8px', 
                                        padding: '10px 24px', 
                                        cursor: 'not-allowed' 
                                    }}
                                >
                                    Kirim <i className="bi bi-send-fill"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatbotPage;