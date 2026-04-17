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
            // Kita kirim 5 data persis seperti yang diminta backend kamu
            await axios.post('http://localhost:5000/register', {
                id: id,
                name: name,
                password: password,
                status: status,
                roles_id: roles_id 
            });
            alert('Registration Successful');
            navigate('/');
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            } else {
                setMsg('Tidak dapat terhubung ke server!'); 
            }
        }
    };

  return (
    <div>
      <section className="hero has-background-grey-light is-fullheight is-fullwidth">
        <div className="hero-body">
          <div className="container">
            <div className="columns is-centered">
              <div className="column is-5-desktop">
                <form onSubmit={handleRegister} className="box">
                  <h3 className="title is-4 has-text-centered">Admin: Tambah User Baru</h3>
                  
                  {msg && <p className="has-text-centered has-text-danger mb-3">{msg}</p>}

                  <div className="field mt-4">
                    <label className="label">User ID</label>
                    <div className="control">
                      <input className="input" type="text" placeholder="Masukkan ID (Misal: U-001)" 
                      value={id} onChange={(e) => setId(e.target.value)} required />
                    </div>
                  </div>

                  <div className="field mt-4">
                    <label className="label">Nama Lengkap</label>
                    <div className="control">
                      <input className="input" type="text" placeholder="Masukkan Nama Lengkap" 
                      value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                  </div>

                  {/* Tambahan Kolom Dropdown Status untuk Admin */}
                  <div className="field mt-4">
                    <label className="label">Status</label>
                    <div className="control">
                      <div className="select is-fullwidth">
                        <select value={status} onChange={(e) => setStatus(e.target.value)}>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Tambahan Kolom Dropdown Role untuk Admin */}
                  <div className="field mt-4">
                    <label className="label">Role Akses</label>
                    <div className="control">
                      <div className="select is-fullwidth">
                        <select value={roles_id} onChange={(e) => setRolesId(e.target.value)}>
                          <option value="3">Teacher (ID: 3)</option>
                          <option value="2">Student (ID: 2)</option>
                          <option value="1">Admin (ID: 1)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="field mt-4">
                    <label className="label">Password</label>
                    <div className="control">
                      <input className="input" type="password" placeholder="••••••••" 
                      value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                  </div>

                  <div className="field mt-4">
                    <label className="label">Confirm Password</label>
                    <div className="control">
                      <input className="input" type="password" placeholder="••••••••" 
                      value={confPassword} onChange={(e) => setConfPassword(e.target.value)} required />
                    </div>
                  </div>

                  <div className="field mt-5">
                    <div className="control">
                      <button className="button is-success is-fullwidth">Register User</button>
                    </div>
                  </div>

                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;