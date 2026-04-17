import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "./LoginPage.css";


const LoginPage = () => {
  const navigate = useNavigate();

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_BE_API_URL}/login`, {
        id,
        password
      });

      localStorage.setItem("token", res.data.accessToken);

      navigate("/dashboard");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <div className="d-flex flex-row w-100 h-100">
      <div className="box-left d-flex flex-column align-items-center">
        <div className="logo-header d-flex flex-row align-items-center">
          <img src="/images/logo.png" alt="logo" style={{ width: "32px", height: "32px", marginRight: "14px" }} />
          <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: "700", fontSize: "28px", lineHeight: "30px", margin: 0, color: "#FF7700" }}>daesan</p>
        </div>
        <img src="/images/smart-people.png" alt="smart-people" style={{ height:'60vh', marginTop: "10vh" }}/>
      </div>
      <div className="box-right d-flex flex-column align-items-center justify-content-center">
        <div className="form-container flex-column align-items-center justify-content-center d-inline-flex" style={{ padding: "56px 48px", borderRadius:"8px" }}>
          <div className="header-text d-flex flex-column align-items-center">
            <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: "900", fontSize: "36px", lineHeight: "40px", margin: 0, color: "#212121" }}>Korean Class</p>
            <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: "900", fontSize: "24px", lineHeight: "30px", margin: "6px 0 0 0", color: "#212121" }}>LEARNING MANAGEMENT SYSTEM</p>
          </div>
          <hr style={{ width: "100%", border: "none", borderTop: "2px solid #ccc", borderRadius: "10px", margin: "12px 0"}}/>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>User ID</label>
              <input
                type="text"
                placeholder="Enter your User ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-orange w-100">
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
    // <div className="d-flex justify-content-center align-items-center vh-100">
    //   <div className="card shadow-sm p-4" style={{ width: "350px" }}>
    //     <h3 className="text-center mb-4">Login</h3>

    //     <p className="text-danger text-center">{msg}</p>

    //     <form onSubmit={handleLogin}>
    //       <div className="mb-3">
    //         <label className="form-label">User ID</label>
    //         <input
    //           type="text"
    //           className="form-control"
    //           placeholder="Masukkan User ID"
    //           value={id}
    //           onChange={(e) => setId(e.target.value)}
    //           required
    //         />
    //       </div>

    //       <div className="mb-3">
    //         <label className="form-label">Password</label>
    //         <input
    //           type="password"
    //           className="form-control"
    //           placeholder="Masukkan password"
    //           value={password}
    //           onChange={(e) => setPassword(e.target.value)}
    //           required
    //         />
    //       </div>

    //       <button type="submit" className="btn btn-primary w-100">
    //         Login
    //       </button>
    //     </form>
    //   </div>
    // </div>
  );
};

export default LoginPage;