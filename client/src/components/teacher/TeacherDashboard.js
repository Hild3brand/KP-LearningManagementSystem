import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 
import { useNavigate } from 'react-router-dom';

// Pastikan jalur import Navbar disesuaikan dengan lokasi file ini ya
// Kalau file ini ada di src/components/teacher/, berarti mundurnya 2 folder (../../)
import Navbar from '../../components/Navbar'; 

const axiosJWT = axios.create();

const TeacherDashboard = () => {
    const [name, setName] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        refreshToken();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const requestIntercept = axiosJWT.interceptors.request.use(async (config) => {
            const currentDate = new Date();
            if (expire * 1000 < currentDate.getTime()) {
                const response = await axios.get(`${process.env.BE_API_URL}/token`, {
                    withCredentials: true 
                });
                config.headers.Authorization = `Bearer ${response.data.accessToken}`;
                setToken(response.data.accessToken);
                const decoded = jwtDecode(response.data.accessToken);
                setName(decoded.name);
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
            const response = await axios.get(`${process.env.BE_API_URL}/token`, {
                withCredentials: true 
            });
            
            setToken(response.data.accessToken);
            const decoded = jwtDecode(response.data.accessToken); 
            setName(decoded.name); 
            setExpire(decoded.exp);

        } catch (error) {
            console.log("Error Dashboard:", error); 
            if (error.response) {
                navigate('/'); 
            }
        }
    };

    return (
        <div className="bg-light min-vh-100"> 
            <Navbar dashboardRoute='/teacher-dashboard' /> 
            <div className='container mt-5'>
                {/* Sedikit modifikasi warna border atas (border-primary) biar beda dengan murid */}
                <div className="card shadow-sm border-0 border-top border-primary border-4">
                    <div className="card-body p-5 text-center">
                        <h1 className="mb-3">Halo, Bapak/Ibu <strong>{name}</strong>! 👨‍🏫👩‍🏫</h1>
                        <p className="text-muted fs-5">Selamat datang di Dasbor Guru.</p>
                        <p className="mb-0">Di sini Anda dapat mengelola kelas, melihat daftar siswa, dan memasukkan nilai akademik.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TeacherDashboard;