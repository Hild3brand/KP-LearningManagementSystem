import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Register = () => {
    const [id, setId] = useState(''); 
    const [name, setName] = useState(''); 
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState(''); 
    
    // Tambahkan state untuk status dan roles_id (berikan nilai default)
    const [status, setStatus] = useState('active'); 
    const [roles_id, setRolesId] = useState('2'); 
    
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confPassword) {
            return setMsg('Password dan Confirm Password tidak cocok!');
        }

        try {
            await axios.post(`${process.env.REACT_APP_BE_API_URL}/register`, {
                id: id,
                name: name,
                password: password,
                status: status,
                roles_id: roles_id 
            });
            alert('Registration Successful');
            navigate('/admin-dashboard');
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            } else {
                setMsg('Tidak dapat terhubung ke server!'); 
            }
        }
    };

  return (
    // Menggunakan vh-100 dan d-flex untuk menempatkan form di tengah secara vertikal
    <div className="vh-100 bg-light d-flex align-items-center">
      <div className="container">
        {/* row dan justify-content-center untuk menempatkan form di tengah secara horizontal */}
        <div className="row justify-content-center">
          {/* Lebar form disesuaikan: col-12 (HP), col-md-8 (Tablet), col-lg-5 (Laptop) */}
          <div className="col-12 col-md-8 col-lg-5">
            
            {/* Form container dengan background putih, padding, rounded corners, dan bayangan lembut */}
            <form onSubmit={handleRegister} className="bg-white p-4 rounded shadow-sm">
              <h3 className="text-center mb-4">Admin: Tambah User Baru</h3>
              
              {msg && <p className="text-center text-danger mb-3">{msg}</p>}

              <div className="mb-3">
                <label className="form-label fw-bold">User ID</label>
                <input className="form-control" type="text" placeholder="Masukkan ID (Misal: U-001)" 
                value={id} onChange={(e) => setId(e.target.value)} required />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Nama Lengkap</label>
                <input className="form-control" type="text" placeholder="Masukkan Nama Lengkap" 
                value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              {/* Dropdown Status */}
              <div className="mb-3">
                <label className="form-label fw-bold">Status</label>
                {/* Gunakan form-select untuk dropdown di Bootstrap */}
                <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Dropdown Role */}
              <div className="mb-3">
                <label className="form-label fw-bold">Role Akses</label>
                <select className="form-select" value={roles_id} onChange={(e) => setRolesId(e.target.value)}>
                  <option value="3">Teacher (ID: 3)</option>
                  <option value="2">Student (ID: 2)</option>
                  <option value="1">Admin (ID: 1)</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Password</label>
                <input className="form-control" type="password" placeholder="••••••••" 
                value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">Confirm Password</label>
                <input className="form-control" type="password" placeholder="••••••••" 
                value={confPassword} onChange={(e) => setConfPassword(e.target.value)} required />
              </div>

              <button className="btn btn-success w-100">Register User</button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;