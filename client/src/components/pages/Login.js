import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();

    const Auth = async (e) => {
        e.preventDefault();
        console.log(process.env.BE_API_URL);
        try {
            const response = await axios.post(`${process.env.BE_API_URL}/login`, {
                id: id,
                password: password,
            });

            const tokenResponse = await axios.get(`${process.env.BE_API_URL}/token`, {
                withCredentials: true
            });

            const decoded = jwtDecode(tokenResponse.data.accessToken);

            if (decoded.roles_id === 1) {
                navigate('/admin-dashboard');
            } else if (decoded.roles_id === 2) {
                navigate('/student-dashboard');
            } else if (decoded.roles_id === 3) {
                navigate('/teacher-dashboard');
            } else {
                setMsg('Role pengguna tidak dikenali!');
            }
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            } else {
                setMsg('Tidak dapat terhubung ke server!');
            }
        }
    };

    // Warna tema khusus agar sesuai dengan gambar
    const themeColor = "#f97316"; 

    return (
        <div style={{ backgroundColor: '#f5f6f8', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            
            {/* --- NAVBAR --- */}
            <div style={{ backgroundColor: themeColor, padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', color: 'white', fontWeight: 'bold', fontSize: '24px' }}>
                    {/* Ganti src dengan path logo Daesan kamu */}
                    <img src="/logo-daesan-putih.png" alt="Daesan Logo" style={{ height: '40px', marginRight: '10px' }} />
                    daesan
                </div>
                <div style={{ display: 'flex', gap: '15px', color: 'white', fontSize: '20px' }}>
                    {/* Kamu bisa pakai library react-icons atau FontAwesome untuk ini */}
                    <i className="bi bi-instagram" style={{ cursor: 'pointer' }}></i>
                    <i className="bi bi-tiktok" style={{ cursor: 'pointer' }}></i>
                    <i className="bi bi-twitter-x" style={{ cursor: 'pointer' }}></i>
                </div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="container flex-grow-1 d-flex align-items-center justify-content-center py-5">
                <div className="row w-100 align-items-center justify-content-center" style={{ maxWidth: '1000px' }}>
                    
                    {/* Kolom Kiri: Ilustrasi Maskot */}
                    <div className="col-12 col-md-6 d-flex justify-content-center mb-5 mb-md-0">
                        {/* Ganti src dengan path gambar maskot rubah kamu */}
                        <img src="/maskot-rubah.png" alt="Mascot" style={{ maxWidth: '100%', maxHeight: '350px' }} />
                    </div>

                    {/* Kolom Kanan: Form Login */}
                    <div className="col-12 col-md-5">
                        <div className="card border-0 shadow-sm p-5" style={{ borderRadius: '15px' }}>
                            <h4 className="text-center mb-4 fw-bold" style={{ color: '#2b2b2b', letterSpacing: '1px' }}>
                                WELCOME
                            </h4>
                            
                            <form onSubmit={Auth}>
                                {msg && <p className='text-center text-danger mb-3'>{msg}</p>}
                                
                                {/* Label dihilangkan agar sesuai desain, menggunakan placeholder saja */}
                                <div className="mb-3">
                                    <input 
                                        className="form-control form-control-lg bg-light border-1" 
                                        type="text" 
                                        placeholder="ID User" 
                                        value={id} 
                                        onChange={(e) => setId(e.target.value)} 
                                        required 
                                        style={{ fontSize: '15px' }}
                                    />
                                </div>
                                
                                <div className="mb-4">
                                    <input 
                                        className="form-control form-control-lg bg-light border-1" 
                                        type="password" 
                                        placeholder="Password" 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        required 
                                        style={{ fontSize: '15px' }}
                                    />
                                </div>
                                
                                <button 
                                    className="btn w-100 text-white" 
                                    style={{ backgroundColor: themeColor, fontWeight: 'bold', padding: '12px', fontSize: '16px' }}>
                                    LOGIN
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;