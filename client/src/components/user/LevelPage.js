import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import CourseMap from './CourseMap'; 

const LevelPage = () => {
    const [userData, setUserData] = useState({ name: '', level: '', xp: 0 });
    const [token, setToken] = useState('');
    const [completedLevels, setCompletedLevels] = useState([]); 
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    // EFFECT 1: Ambil Token & Info User (Cuma jalan sekali)
    useEffect(() => {
        const getInitialData = async () => {
            try {
                const response = await axios.get(`${process.env.BE_API_URL}/token`, { withCredentials: true });
                const accessToken = response.data.accessToken;
                const decoded = jwtDecode(accessToken);
                
                setToken(accessToken);
                setUserData({ name: decoded.name, level: decoded.level || 'Beginner 1', xp: decoded.xp });
            } catch (error) { navigate('/'); }
        };
        getInitialData();
    }, [navigate]);

    // EFFECT 2: Ambil Progress (Hanya kalau token siap)
    useEffect(() => {
        if (!token) return; 

        const fetchProgress = async () => {
            try {
                const response = await axios.get(`${process.env.BE_API_URL}/user-progress`, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true 
                });
                setCompletedLevels(response.data.completedLevels || []);
            } catch (error) { console.error(error); }
        };
        fetchProgress();
    }, [token]);

    const Logout = async () => {
        try {
            await axios.delete(`${process.env.BE_API_URL}/logout`, { withCredentials: true });
            navigate('/'); 
        } catch (error) { console.log(error); }
    }

    // --- STYLE ASLI LU (DARI FOTO 1) ---
    const themeColor = "#f97316"; // Oranye Duolingo
    const bgColor = "#f5f6f8"; // Abu-abu muda

    return (
        <div style={{ backgroundColor: bgColor, minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>
            {/* 1. HEADER (Sesuai Foto 1) */}
            <div style={{ backgroundColor: themeColor, padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '24px', marginRight: '20px' }}>Daesan Logo daesan</span>
                    <div style={{ borderLeft: '1px solid rgba(255,255,255,0.3)', height: '30px', margin: '0 20px' }}></div>
                    <div>
                        <div style={{ fontSize: '16px', fontWeight: '600' }}>Hi, {userData.name} 👋</div>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '2px' }}>
                            <span style={{ fontSize: '11px', backgroundColor: '#e67e22', padding: '2px 8px', borderRadius: '15px' }}>⭐ {userData.level}</span>
                            <span style={{ fontSize: '11px', backgroundColor: '#e67e22', padding: '2px 8px', borderRadius: '15px' }}>⚡ {userData.xp} XP</span>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ backgroundColor: '#e67e22', padding: '8px', borderRadius: '8px' }}><i className="bi bi-bell-fill"></i></div>
                    <button onClick={() => setShowDropdown(!showDropdown)} className="btn text-white d-flex align-items-center gap-2" style={{ border: '1px solid white', borderRadius: '20px', padding: '5px 15px' }}>
                        <i className="bi bi-person-circle fs-5"></i> {userData.name} <i className={`bi bi-chevron-down`}></i>
                    </button>
                    {showDropdown && (
                        <div className="dropdown-menu show shadow-sm" style={{ position: 'absolute', top: '70px', right: '40px' }}>
                            <button onClick={Logout} className="dropdown-item text-danger fw-bold">Logout</button>
                        </div>
                    )}
                </div>
            </div>

            <div style={{ display: 'flex', flexGrow: 1 }}>
                {/* 2. SIDEBAR PUTIH (Sesuai Foto 1 - 4 Menu) */}
                <div style={{ width: '280px', backgroundColor: 'white', padding: '30px 20px', borderRight: '1px solid #e0e0e0' }}>
                    {[
                        { name: 'Dashboard', icon: 'bi-grid-fill', path: '/student-dashboard' },
                        { name: 'Course', icon: 'bi-journal-text', path: '#' },
                        { name: 'Learning Path', icon: 'bi-signpost-2-fill', path: '/level', active: true },
                        { name: 'Chatbot', icon: 'bi-robot', path: '/chatbot' }
                    ].map((menu) => (
                        <button key={menu.name} onClick={() => menu.path !== '#' && navigate(menu.path)} className="btn w-100 d-flex align-items-center gap-3 mb-3 p-3 text-start" 
                            style={{ 
                                border: menu.active ? `2px solid ${themeColor}` : '1px solid #e0e0e0', 
                                color: menu.active ? themeColor : '#4b4b4b', 
                                backgroundColor: menu.active ? '#fff4eb' : 'white', 
                                fontWeight: 'bold', borderRadius: '12px' 
                            }}>
                            <i className={`bi ${menu.icon} fs-5`}></i> {menu.name}
                        </button>
                    ))}
                </div>

                {/* AREA MAP */}
                <div style={{ flexGrow: 1, padding: '40px', overflowY: 'auto' }}>
                    <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: '15px' }}>
                        <div className="card-body p-4">
                            <h4 className="fw-bold mb-0">Perjalanan Belajarmu 🚀</h4>
                        </div>
                    </div>
                    <div className="card shadow-sm border-0" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                        <div className="card-body p-0"> 
                            <CourseMap userXP={userData.xp} completedLevels={completedLevels} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LevelPage;