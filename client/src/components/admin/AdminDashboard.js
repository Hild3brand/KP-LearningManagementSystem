import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar'; 

const axiosJWT = axios.create();

const AdminDashboard = () => {
    const [name, setName] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [users, setUsers] = useState([]); 
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState({ id: '', name: '', status: '' });

    useEffect(() => {
        refreshToken();
    }, []);

    useEffect(() => {
        if (token) {
            getUsers();
        }
    }, [token]);

    useEffect(() => {
        const requestIntercept = axiosJWT.interceptors.request.use(async (config) => {
            const currentDate = new Date();
            if (expire * 1000 < currentDate.getTime()) {
                const response = await axios.get(`${process.env.BE_API_URL}/token`, { withCredentials: true });
                config.headers.Authorization = `Bearer ${response.data.accessToken}`;
                setToken(response.data.accessToken);
                const decoded = jwtDecode(response.data.accessToken);
                setName(decoded.name);
                setExpire(decoded.exp);
            }
            return config;
        }, (error) => Promise.reject(error));

        return () => axiosJWT.interceptors.request.eject(requestIntercept);
    }, [expire]); 

    const refreshToken = async () => {
        try {
            const response = await axios.get(`${process.env.BE_API_URL}/token`, { withCredentials: true });
            setToken(response.data.accessToken);
            const decoded = jwtDecode(response.data.accessToken); 
            setName(decoded.name); 
            setExpire(decoded.exp);
        } catch (error) {
            if (error.response) navigate('/'); 
        }
    };

    const getUsers = async () => {
        try {
            const response = await axiosJWT.get(`${process.env.BE_API_URL}/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
        } catch (error) { 
            console.log("Error fetching users:", error); 
        }
    };

    // --- PERBAIKAN: Tambah token pada header DELETE ---
    const deleteUser = async (id) => {
        if (window.confirm("Yakin ingin menghapus secara permanen?")) {
            try {
                await axiosJWT.delete(`${process.env.BE_API_URL}/users/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                getUsers(); 
                alert("User berhasil dihapus!");
            } catch (error) { 
                console.log(error);
                if (error.response && error.response.status === 401) {
                    alert("Sesi kamu berakhir, silakan refresh halaman.");
                }
            }
        }
    };

    const openEditModal = (user) => {
        setEditData({ id: user.id, name: user.name, status: user.status || 'Active' });
        setShowModal(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axiosJWT.patch(`${process.env.BE_API_URL}/users/${editData.id}`, {
                name: editData.name,
                status: editData.status
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setShowModal(false);
            getUsers(); 
            alert("Update Berhasil!");
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert("Sesi habis, silakan refresh halaman.");
            }
            console.log(error);
        }
    };

    // --- PERBAIKAN: Tukar ID Roles Teacher dan Student ---
    const adminUsers = users.filter(user => user.roles_id === 1);
    const teacherUsers = users.filter(user => user.roles_id === 3); // Teacher sekarang id 3
    const studentUsers = users.filter(user => user.roles_id === 2); // Student sekarang id 2

    const renderTable = (data, title, headerColor) => (
        <div className="card shadow-sm border-0 mb-5">
            <div className={`card-header ${headerColor} text-white p-3`}>
                <h5 className="mb-0">{title} <span className="badge bg-light text-dark ms-2">{data.length}</span></h5>
            </div>
            <div className="card-body p-0">
                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>No</th>
                                <th>Nama Lengkap</th>
                                <th>Status</th>
                                <th className="text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length > 0 ? data.map((user, index) => (
                                <tr key={user.id}>
                                    <td>{index + 1}</td>
                                    <td>{user.name}</td>
                                    <td>
                                        <span className={`badge ${user.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                                            {user.status || 'Active'}
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        <button onClick={() => openEditModal(user)} className="btn btn-sm btn-info text-white me-2">Edit</button>
                                        <button onClick={() => deleteUser(user.id)} className="btn btn-sm btn-outline-danger">Hapus</button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-4 text-muted">Tidak ada data untuk kategori ini.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-light min-vh-100 pb-5"> 
            <Navbar dashboardRoute='/admin-dashboard' /> 
            
            <div className='container mt-5'>
                <div className="card shadow-sm border-0 border-top border-dark border-4 mb-5">
                    <div className="card-body p-4 d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="mb-1">Halo, Admin <strong>{name}</strong>! 👨‍💻</h2>
                            <p className="text-muted mb-0">Kelola data seluruh civitas akademik secara terpisah.</p>
                        </div>
                        <div className="d-flex gap-2">
                            <button onClick={getUsers} className="btn btn-dark px-4">🔄 Refresh</button>
                            <Link to="/register" className="btn btn-success px-4">+ Tambah User</Link>
                        </div>
                    </div>
                </div>

                {/* --- MENAMPILKAN 3 TABEL --- */}
                {renderTable(adminUsers, "Daftar Administrator", "bg-dark")}
                {renderTable(teacherUsers, "Daftar Teacher (Guru)", "bg-warning text-dark")}
                {renderTable(studentUsers, "Daftar Student (Siswa)", "bg-primary")}
            </div>

            {showModal && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow">
                            <div className="modal-header bg-dark text-white">
                                <h5 className="modal-title">Update Data Pengguna</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleUpdate}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label font-weight-bold">Nama Lengkap</label>
                                        <input type="text" className="form-control" value={editData.name} 
                                            onChange={(e) => setEditData({...editData, name: e.target.value})} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label font-weight-bold">Status Akun</label>
                                        <select className="form-select" value={editData.status}
                                            onChange={(e) => setEditData({...editData, status: e.target.value})}>
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer bg-light">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Batal</button>
                                    <button type="submit" className="btn btn-dark px-4">Simpan Perubahan</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;