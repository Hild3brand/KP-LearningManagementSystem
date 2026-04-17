import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 
import 'bootstrap-icons/font/bootstrap-icons.css';

const QuizPage = () => {
    const { levelId } = useParams(); 
    const navigate = useNavigate();
    const location = useLocation(); 

    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    
    // State Loading
    const [loading, setLoading] = useState(false); // Untuk submit hasil
    const [isGenerating, setIsGenerating] = useState(false); // Untuk loading nunggu AI
    const [errorMsg, setErrorMsg] = useState('');

    const [token, setToken] = useState(''); 
    const [aiQuestions, setAiQuestions] = useState(null); 

    // 1. Refresh Token
    useEffect(() => {
        const refreshToken = async () => {
            try {
                const response = await axios.get('http://localhost:5000/token', { withCredentials: true });
                setToken(response.data.accessToken);
            } catch (error) {
                if (error.response) navigate('/'); 
            }
        };
        refreshToken();
    }, [navigate]);

    // 2. Helper buat format data AI ke format UI Kuis
    const formatQuizData = useCallback((rawData, title) => {
        const formatted = rawData.map((item, index) => {
            const keys = ['A', 'B', 'C', 'D'];
            const formattedOptions = item.options.map((optText, idx) => ({
                key: keys[idx] || 'X',
                text: optText
            }));

            const answerIndex = item.options.indexOf(item.answer);
            const answerKey = answerIndex !== -1 ? keys[answerIndex] : 'A';

            return {
                id: `Q${index + 1}`,
                question: item.question,
                options: formattedOptions,
                answer: answerKey,
                xpReward: 15 // Bisa diubah sesuai kebutuhan
            };
        });

        setAiQuestions({
            title: title,
            questions: formatted
        });
    }, []);

    // 3. Logic FULL AI: Cek dari Chatbot atau Fetch dari Peta
    useEffect(() => {
        const fetchLevelQuizFromAI = async () => {
            if (!token) return; // Tunggu token siap

            // Skenario A: Masuk dari Chatbot (Bawa data)
            if (location.state?.aiQuizData && Array.isArray(location.state.aiQuizData)) {
                formatQuizData(location.state.aiQuizData, '✨ AI Mini Quiz (Chatbot)');
                return;
            }

            // Skenario B: Masuk dari Peta (Gak bawa data, harus digenerate AI)
            setIsGenerating(true);
            setErrorMsg('');
            try {
                // PANGGIL ENDPOINT AI DI BACKEND LU
                const response = await axios.post('http://localhost:5000/api/generate-level-quiz', {
                    levelId: levelId
                }, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                });

                // Asumsi response dari backend lu format array soal JSON: response.data.quizData
                if (response.data && response.data.quizData) {
                    formatQuizData(response.data.quizData, `🚀 Misi: Level ${levelId}`);
                } else {
                    throw new Error("Data AI tidak sesuai format");
                }
            } catch (error) {
                console.error("Gagal generate soal dari AI:", error);
                setErrorMsg("Waduh, AI lagi sibuk nih. Gagal nyiapin soal buat kamu. Coba lagi ya!");
            } finally {
                setIsGenerating(false);
            }
        };

        fetchLevelQuizFromAI();
    }, [location.state, levelId, token, formatQuizData]);


    const handleNext = () => {
        if (selectedOption === aiQuestions.questions[currentQIndex].answer) {
            setScore(prev => prev + 1);
        }

        if (currentQIndex === aiQuestions.questions.length - 1) {
            setIsFinished(true);
        } else {
            setCurrentQIndex(prev => prev + 1);
            setSelectedOption(null);
        }
    };

    const handleFinishMission = async () => {
        setLoading(true);
        try {
            const xpPerQuestion = aiQuestions.questions[0]?.xpReward || 15;
            const earnedXP = score * xpPerQuestion; 
            
            await axios.post('http://localhost:5000/finish-level', {
                levelId: levelId || 'AI-QUIZ', 
                addedXP: earnedXP
            }, { 
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true 
            });

            // Kalau dari chatbot balik ke chatbot, dari peta balik ke peta
            if (location.state?.aiQuizData) {
                navigate('/chatbot');
            } else {
                navigate('/level'); 
            }
            
        } catch (error) {
            console.error("Gagal menyimpan:", error);
            alert("Sesi habis atau server error. Silakan login ulang!");
        } finally {
            setLoading(false);
        }
    };

    const themeColor = "#f97316"; 
    const themeLight = "#fff4eb"; 
    const successColor = "#58cc02"; 

    // LAYAR ERROR (Kalau AI gagal mikir)
    if (errorMsg) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center text-center" style={{height: '100vh', backgroundColor: '#f5f6f8', padding: '20px'}}>
                <i className="bi bi-robot text-danger mb-3" style={{fontSize: '60px'}}></i>
                <h4 className="fw-bold text-dark">{errorMsg}</h4>
                <button onClick={() => navigate('/level')} className="btn text-white mt-4 px-4 py-2" style={{backgroundColor: themeColor, borderRadius: '15px'}}>Kembali ke Peta</button>
            </div>
        );
    }

    // LAYAR LOADING AI (Pas pertama kali klik level dari peta)
    if (isGenerating || !aiQuestions) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center text-center" style={{height: '100vh', backgroundColor: '#f5f6f8'}}>
                <div className="spinner-border mb-4" style={{width: '3rem', height: '3rem', color: themeColor}} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <h4 className="fw-bold text-dark">AI sedang meracik soal spesial untuk level {levelId}...</h4>
                <p className="text-muted">Tunggu sebentar ya! ✨</p>
            </div>
        );
    }

    const totalQuestions = aiQuestions.questions.length;
    const currentQuiz = aiQuestions.questions[currentQIndex];

    // LAYAR SELESAI KUIS
    if (isFinished) {
        const percentage = Math.round((score / totalQuestions) * 100);
        const isPassed = percentage >= 60; 

        return (
            <div style={{ backgroundColor: '#f5f6f8', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
                <div className="card shadow-sm border-0" style={{ width: '100%', maxWidth: '500px', borderRadius: '20px', padding: '40px 20px', textAlign: 'center' }}>
                    <div className="mb-4">
                        <i className={`bi ${isPassed ? 'bi-trophy-fill text-warning' : 'bi-exclamation-circle text-danger'}`} style={{ fontSize: '60px' }}></i>
                    </div>
                    <h1 style={{ fontSize: '60px', color: themeColor, fontWeight: 'bold' }}>{score}/{totalQuestions}</h1>
                    <h4 className="fw-bold mt-3 text-dark">{isPassed ? 'Misi Selesai!' : 'Coba Lagi Yuk!'}</h4>
                    <p className="text-muted mb-4">{percentage}% benar di {aiQuestions.title}</p>
                    
                    {isPassed ? (
                        <button onClick={handleFinishMission} disabled={loading} className="btn w-100 py-3 fw-bold text-white fs-5" 
                            style={{ backgroundColor: successColor, borderRadius: '15px', borderBottom: `4px solid #46a302` }}>
                            {loading ? 'Menyimpan...' : 'Kumpulkan XP'}
                        </button>
                    ) : (
                        <button onClick={() => window.location.reload()} className="btn w-100 py-3 fw-bold fs-5 bg-white text-dark" 
                            style={{ borderRadius: '15px', border: '2px solid #e0e0e0', boxShadow: '0 4px 0 #e0e0e0' }}>
                            Ulangi Quiz
                        </button>
                    )}
                </div>
            </div>
        );
    }

    const progressPercentage = (currentQIndex / totalQuestions) * 100;

    // LAYAR MAIN KUIS
    return (
        <div style={{ backgroundColor: '#f5f6f8', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px 40px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <button onClick={() => { location.state?.aiQuizData ? navigate('/chatbot') : navigate('/level') }} className="btn btn-light" style={{ borderRadius: '12px', border: '2px solid #e0e0e0' }}>
                    <i className="bi bi-x-lg fw-bold text-secondary"></i>
                </button>
                <div style={{ flexGrow: 1 }}>
                    <div className="progress" style={{ height: '16px', borderRadius: '10px', backgroundColor: '#e5e5e5' }}>
                        <div className="progress-bar" style={{ width: `${progressPercentage}%`, backgroundColor: successColor, transition: 'width 0.4s ease' }}></div>
                    </div>
                </div>
            </div>

            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 20px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                <div className="card shadow-sm border-0 w-100 mb-4" style={{ borderRadius: '20px' }}>
                    <div className="card-body p-4 p-md-5">
                        <div className="d-flex justify-content-between">
                            <p className="text-muted fw-bold mb-3">{aiQuestions.title}</p>
                            <p className="fw-bold" style={{color: themeColor}}>{currentQIndex + 1}/{totalQuestions}</p>
                        </div>
                        <h4 className="fw-bold text-dark mb-0">{currentQuiz.question}</h4>
                    </div>
                </div>

                <div className="row w-100 m-0">
                    {currentQuiz.options.map((opt) => {
                        const isSelected = selectedOption === opt.key;
                        return (
                            <div className="col-12 col-sm-6 p-2" key={opt.key}>
                                <button 
                                    onClick={() => setSelectedOption(opt.key)}
                                    className="btn w-100 d-flex align-items-center text-start"
                                    style={{ 
                                        borderRadius: '15px', 
                                        border: `2px solid ${isSelected ? themeColor : '#e0e0e0'}`, 
                                        backgroundColor: isSelected ? themeLight : 'white',
                                        padding: '16px',
                                        boxShadow: isSelected ? 'none' : '0 4px 0 #e0e0e0',
                                        transform: isSelected ? 'translateY(4px)' : 'none',
                                        transition: 'all 0.1s'
                                    }}
                                >
                                    <span className="fw-bold d-flex justify-content-center align-items-center me-3" 
                                        style={{ width: '35px', height: '35px', backgroundColor: isSelected ? 'white' : '#f0f0f0', color: isSelected ? themeColor : '#6c757d', borderRadius: '8px', border: `2px solid ${isSelected ? themeColor : 'transparent'}` }}>
                                        {opt.key}
                                    </span>
                                    <span className="fs-5 fw-medium text-dark">{opt.text}</span>
                                </button>
                            </div>
                        )
                    })}
                </div>

                <div className="mt-auto w-100 py-4 d-flex justify-content-end">
                    <button 
                        onClick={handleNext}
                        disabled={!selectedOption}
                        className="btn px-5 py-3 fw-bold text-white fs-5" 
                        style={{ 
                            borderRadius: '15px', 
                            backgroundColor: selectedOption ? themeColor : '#ccc', 
                            borderBottom: `4px solid ${selectedOption ? '#c2410c' : '#aaa'}` 
                        }}
                    >
                        {currentQIndex === totalQuestions - 1 ? 'LIHAT HASIL' : 'LANJUT'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default QuizPage;