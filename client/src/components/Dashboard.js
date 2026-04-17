import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';


const axiosJWT = axios.create();

const Dashboard = () => {
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
                const response = await axios.get(`${process.env.REACT_APP_BE_API_URL}/token`, {
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
            const response = await axios.get(`${process.env.REACT_APP_BE_API_URL}/token`, {
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

    const getUsers = async () => {
        try {
            const response = await axiosJWT.get(`${process.env.REACT_APP_BE_API_URL}/users`, {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            });
            console.log("Users:", response.data); 
        } catch (error) {
            console.log("Error get users:", error);
        }
    }; 

    return (
        <> 
            <Navbar /> 
            <div className='container mt-5'>
                {/* 1. Class 'title' dihapus (di Bootstrap, tag h1 sudah punya styling bawaan). Tambahkan mb-4 untuk margin bawah */}
                <h1 className="mb-4">Welcome Back: <strong>{name}</strong></h1>
                
                {/* 2. Class 'button is-info' diubah jadi 'btn btn-info' */}
                <button onClick={getUsers} className='btn btn-info text-white'>Get Users</button>
            </div>
        </>
    );
}

export default Dashboard;