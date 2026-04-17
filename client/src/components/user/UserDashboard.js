import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import CourseMap from './CourseMap'; // Pastikan path-nya sesuai
const axiosJWT = axios.create();


const UserDashboard = () => {
    // --- STATE DITAMBAHKAN DI SINI ---
    const [name, setName] = useState('');
    const [level, setLevel] = useState(''); 
    const [xp, setXp] = useState(0);
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    
    // State untuk kontrol Dropdown
    const [showDropdown, setShowDropdown] = useState(false);
    
    const navigate = useNavigate();

    useEffect(() => {
        refreshToken();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const requestIntercept = axiosJWT.interceptors.request.use(async (config) => {
            const currentDate = new Date();
            if (expire * 1000 < currentDate.getTime()) {
                const response = await axios.get(`${process.env.REACT_APP_BE_API_URL}/token`, {
                    withCredentials: true 
                });
                config.headers.Authorization = `Bearer ${response.data.accessToken}`;
                setToken(response.data.accessToken);
                
                // --- TANGKAP LEVEL DAN XP DARI TOKEN ---
                const decoded = jwtDecode(response.data.accessToken);
                setName(decoded.name);
                setLevel(decoded.level);
                setXp(decoded.xp);
                setExpire(decoded.exp);
            }
            return config;
        }, (error) => {
            return Promise.reject(error);
        });

        return () => {
            axiosJWT.interceptors.request.eject(requestIntercept);
        }
    }, [expire]); 

    const refreshToken = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BE_API_URL}/token`, {
                withCredentials: true 
            });
            
            setToken(response.data.accessToken);
            
            // --- TANGKAP LEVEL DAN XP DARI TOKEN ---
            const decoded = jwtDecode(response.data.accessToken); 
            setName(decoded.name); 
            setLevel(decoded.level);
            setXp(decoded.xp);
            setExpire(decoded.exp);

        } catch (error) {
            console.log("Error Dashboard:", error); 
            if (error.response) {
                navigate('/'); 
            }
        }
    };

    // Fungsi Logout
    const Logout = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_BE_API_URL}/logout`, {
                withCredentials: true 
            });
            navigate('/'); // Arahkan kembali ke halaman login
        } catch (error) {
            console.log(error);
        }
    }
    // --- Warna Tema ---
    const themeColor = "#f97316"; 
    const bgColor = "#f5f6f8";

    return (
        <div style={{ backgroundColor: bgColor, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            
            {/* --- 1. HEADER (Atas) --- */}
            <div style={{ backgroundColor: themeColor, padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
                
                {/* --- KELOMPOK KIRI (Logo & Sapaan) --- */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', fontSize: '28px', marginRight: '20px' }}>
                        <img src="/assets/logo-rubah.png" alt="Daesan Logo" style={{ height: '40px', marginRight: '10px' }} />
                        daesan
                    </div>
                    
                    <div style={{ borderLeft: '2px solid rgba(255,255,255,0.4)', height: '40px', margin: '0 20px' }}></div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', color: 'white' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '18px', letterSpacing: '0.5px' }}>
                            Hi, {name || 'Student'} 👋
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                            {/* --- TAMPILAN LEVEL & XP --- */}
                            <span style={{ fontSize: '13px', backgroundColor: 'rgba(255,255,255,0.2)', padding: '3px 10px', borderRadius: '20px', fontWeight: 'bold' }}>
                                ⭐ {level || 'Beginner 1'}
                            </span>
                            <span style={{ fontSize: '13px', fontWeight: 'bold' }}>
                                ⚡ {xp || 0} XP
                            </span>
                        </div>
                    </div>
                </div>

                {/* --- KELOMPOK KANAN (Notifikasi & Profil) --- */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    
                    <button className="btn btn-outline-light d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px', borderRadius: '10px', border: '2px solid white' }}>
                        <i className="bi bi-bell-fill"></i>
                    </button>
                    
                    {/* WADAH DROPDOWN PROFIL */}
                    <div style={{ position: 'relative' }}>
                        <button 
                            onClick={() => setShowDropdown(!showDropdown)} 
                            className="btn btn-outline-light d-flex align-items-center gap-2" 
                            style={{ borderRadius: '10px', border: '2px solid white', padding: '8px 20px', fontWeight: 'bold' }}
                        >
                            <i className="bi bi-person-circle fs-5"></i>
                            {name || 'Student'}
                            <i className={`bi bi-chevron-${showDropdown ? 'up' : 'down'} ms-2`}></i>
                        </button>

                        {/* ISI DROPDOWN */}
                        {showDropdown && (
                            <div 
                                className="dropdown-menu show shadow-sm" 
                                style={{ position: 'absolute', top: '100%', right: 0, marginTop: '10px', borderRadius: '12px', border: '1px solid #e0e0e0', minWidth: '180px', padding: '10px' }}
                            >
                                <button className="dropdown-item d-flex align-items-center gap-3 py-2" style={{ borderRadius: '8px', fontWeight: '500' }}>
                                    <i className="bi bi-person fs-5"></i> Profile
                                </button>
                                <hr className="dropdown-divider my-2" />
                                <button 
                                    onClick={Logout} 
                                    className="dropdown-item text-danger d-flex align-items-center gap-3 py-2" 
                                    style={{ borderRadius: '8px', fontWeight: 'bold' }}
                                >
                                    <i className="bi bi-box-arrow-right fs-5"></i> Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- KONTEN BAWAH (Sidebar + Main Area) --- */}
            <div style={{ display: 'flex', flexGrow: 1 }}>
                
                {/* --- 2. SIDEBAR (Kiri) --- */}
                <div style={{ width: '260px', backgroundColor: 'white', padding: '30px 20px', display: 'flex', flexDirection: 'column', gap: '15px', borderRight: '1px solid #e0e0e0' }}>
                    {/* Dashboard (AKTIF) */}
                    <button className="btn w-100 d-flex align-items-center gap-3" style={{ border: `2px solid ${themeColor}`, color: themeColor, backgroundColor: '#fff4eb', fontWeight: 'bold', padding: '12px 20px', borderRadius: '12px' }}>
                        <i className="bi bi-grid-fill fs-5"></i> Dashboard
                    </button>
                    
                    {/* Course */}
                    <button className="btn w-100 d-flex align-items-center gap-3 text-secondary" style={{ border: '2px solid #e0e0e0', backgroundColor: 'white', fontWeight: 'bold', padding: '12px 20px', borderRadius: '12px' }}>
                        <i className="bi bi-book-half fs-5"></i> Course
                    </button>
                    
                    {/* TOMBOL BARU: Learning Path (KLIK KE HALAMAN LEVEL) */}
                    <button onClick={() => navigate('/level')} className="btn w-100 d-flex align-items-center gap-3 text-secondary" style={{ border: '2px solid #e0e0e0', backgroundColor: 'white', fontWeight: 'bold', padding: '12px 20px', borderRadius: '12px' }}>
                        <i className="bi bi-map fs-5"></i> Learning Path
                    </button>

                    {/* Chatbot */}
                    <button className="btn w-100 d-flex align-items-center gap-3 text-secondary" style={{ border: '2px solid #e0e0e0', backgroundColor: 'white', fontWeight: 'bold', padding: '12px 20px', borderRadius: '12px' }}>
                        <i className="bi bi-robot fs-5"></i> Chatbot
                    </button>
                </div>

                {/* --- 3. MAIN CONTENT (Kanan) --- */}
                <div style={{ flexGrow: 1, padding: '40px' }}>
                    <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
                        <div className="card-body p-4">
                            <h4 className="mb-1 fw-bold">Selamat datang di Dasbor Anda!</h4>
                            <p className="text-muted">Ini adalah area utama. Klik tombol <strong>Learning Path</strong> di menu samping untuk melihat misi belajarmu.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default UserDashboard;