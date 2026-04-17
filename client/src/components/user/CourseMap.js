import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

const CourseMap = ({ userXP = 0, completedLevels = [] }) => { 
    const navigate = useNavigate();

    // 1. Data Base Sub-Level (Tambahin maxLevel buat ngatur batas akhirnya)
    const baseCategories = [
        // LEVEL REMEMBER
        { id: 'R1', type: 'Remember', name: 'Recognition', maxLevel: 4 }, // <-- SET CUMA SAMPAI 4
        { id: 'R2', type: 'Remember', name: 'Recall', maxLevel: 10 },
        { id: 'R3', type: 'Remember', name: 'Grammar Identification', maxLevel: 10 },
        { id: 'R4', type: 'Remember', name: 'Vocabulary Retrieval', maxLevel: 10 },
        
        // LEVEL UNDERSTAND 
        { id: 'U1', type: 'Understand', name: 'Interpretation', maxLevel: 10 },
        { id: 'U2', type: 'Understand', name: 'Classification', maxLevel: 10 },
        { id: 'U3', type: 'Understand', name: 'Comparison', maxLevel: 10 },
        { id: 'U4', type: 'Understand', name: 'Summarization', maxLevel: 10 },
        
        // LEVEL APPLY
        { id: 'A1', type: 'Apply', name: 'Guided Sentence', maxLevel: 10 },
        { id: 'A2', type: 'Apply', name: 'Contextual Usage', maxLevel: 10 },
        { id: 'A3', type: 'Apply', name: 'Language Problem Solving', maxLevel: 10 }
    ];

    // 2. Generate Level secara Otomatis Sesuai maxLevel
    const stages = useMemo(() => {
        const generatedStages = [];
        let currentMinXP = 0; 

        baseCategories.forEach(base => {
            // Looping sekarang berhenti sesuai maxLevel yang kita set di atas
            const batasLevel = base.maxLevel || 10; 
            
            for (let i = 1; i <= batasLevel; i++) {
                generatedStages.push({
                    id: `${base.id}-${i}`,        
                    type: base.type,              
                    name: `${base.name} ${i}`,    
                    minXP: currentMinXP
                });
                currentMinXP += 50; 
            }
        });
        return generatedStages;
    }, []);

    const getTranslateX = (index) => {
        const pattern = [0, 60, 90, 60, 0, -60, -90, -60]; 
        return pattern[index % pattern.length];
    };

    const getButtonStyle = (status) => {
        switch (status) {
            case 'completed':
                return { backgroundColor: '#58cc02', borderColor: '#58a700', color: 'white' }; 
            case 'current':
                return { backgroundColor: '#ffc800', borderColor: '#e5b400', color: 'white', transform: 'scale(1.15)', boxShadow: '0 0 15px rgba(255, 200, 0, 0.6)' }; 
            case 'locked':
            default:
                return { backgroundColor: '#e5e5e5', borderColor: '#cecece', color: '#afafaf' }; 
        }
    };

    const getIcon = (status, type) => {
        if (status === 'completed') return <i className="bi bi-check-lg fs-3"></i>;
        if (status === 'locked') return <i className="bi bi-lock-fill fs-4"></i>;
        
        if (type === 'Remember') return <i className="bi bi-brain fs-3"></i>;
        if (type === 'Understand') return <i className="bi bi-lightbulb-fill fs-3"></i>;
        if (type === 'Apply') return <i className="bi bi-tools fs-3"></i>;
    };

    return (
        <div style={{ padding: '40px', backgroundColor: '#f5f6f8', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ fontWeight: 'bold', color: '#3c3c3c', marginBottom: '40px' }}>Capaian  Level</h2>
            
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '30px' }}>
                {stages.map((stage, index) => {
                    let currentStatus = 'locked';
                    
                    const isCompleted = completedLevels.includes(stage.id); 
                    const hasEnoughXP = userXP >= stage.minXP;              
                    const prevStage = stages[index - 1];                    

                    if (isCompleted) {
                        currentStatus = 'completed'; 
                    } else if (hasEnoughXP) {
                        if (!prevStage || completedLevels.includes(prevStage.id)) {
                            currentStatus = 'current'; 
                        } 
                    }

                    const translateX = getTranslateX(index);
                    const style = getButtonStyle(currentStatus);
                    
                    return (
                        <div key={stage.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `translateX(${translateX}px)` }}>
                            
                            {/* Garis Konektor */}
                            {index !== 0 && (
                                <div style={{ 
                                    width: '10px', height: '40px', position: 'absolute', top: '-30px', zIndex: 0,
                                    backgroundColor: currentStatus === 'locked' ? '#e5e5e5' : '#58cc02'
                                }}></div>
                            )}

                            {/* Tombol Level */}
                            <button 
                                className="btn d-flex justify-content-center align-items-center"
                                style={{
                                    width: '80px', height: '80px', borderRadius: '50%', borderBottom: `6px solid ${style.borderColor}`,
                                    backgroundColor: style.backgroundColor, color: style.color, position: 'relative', zIndex: 1,
                                    transition: 'all 0.2s ease', cursor: currentStatus === 'locked' ? 'not-allowed' : 'pointer'
                                }}
                                onClick={() => {
                                    if(currentStatus === 'locked') {
                                        if (!hasEnoughXP) {
                                            alert(`🔒 Terkunci! Kamu butuh minimal ${stage.minXP} XP. (XP saat ini: ${userXP})`);
                                        } else {
                                            alert(`🔒 Terkunci! Kamu harus menyelesaikan level sebelumnya terlebih dahulu!`);
                                        }
                                    } else if (currentStatus === 'completed') {
                                        alert(`✅ Kamu sudah menyelesaikan Misi ${stage.id}. Ingin mengulang?`);
                                        navigate(`/quiz/${stage.id}`);
                                    } else {
                                        navigate(`/quiz/${stage.id}`);
                                    }
                                }}
                            >
                                {getIcon(currentStatus, stage.type)}
                            </button>

                            {/* Label Level (contoh: R1-1: Recognition 1) */}
                            <div style={{ 
                                marginTop: '10px', fontWeight: 'bold', textAlign: 'center', backgroundColor: 'white',
                                padding: '4px 12px', borderRadius: '12px', border: '2px solid #e5e5e5', fontSize: '14px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                color: currentStatus === 'locked' ? '#afafaf' : '#4b4b4b',
                                maxWidth: '160px', wordWrap: 'break-word'
                            }}>
                                {stage.id}: {stage.name}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CourseMap;