import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [id, setId] = useState(''); 
    const [password, setPassword] = useState('');    
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();  
 
    const Auth = async (e) => {
        e.preventDefault();

        // Pengecekan confPassword SUDAH DIHAPUS karena tidak diperlukan saat Login

        try {
            await axios.post(`${process.env.BE_API_URL}/login`, {
                id: id,
                password: password,
            });
            alert('Login Successful');
            navigate('/dashboard'); // Mengarahkan ke halaman dashboard setelah sukses
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
              <div className="column is-4-desktop">
                <form onSubmit={ Auth } className="box">
                  
                  {/* Menambahkan sedikit warna merah untuk pesan error agar lebih jelas */}
                  {msg && <p className='has-text-centered has-text-danger mb-3'>{msg}</p>}
                  
                  <div className="field mt-5">
                    <label className="label">User ID</label>
                    <div className="control">
                      <input className="input" type="text" placeholder="Masukkan ID" value={id} onChange={(e) => setId(e.target.value)} required />
                    </div>
                  </div>
                  
                  <div className="field mt-5">
                    <label className="label">Password</label>
                    <div className="control">
                      <input className="input" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                  </div>
                  
                  <div className="field mt-5">
                    <div className="control">
                      <button className="button is-success is-fullwidth">Login</button>
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

export default Login;