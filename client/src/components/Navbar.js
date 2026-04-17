import React from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = ({ dashboardRoute }) => {
  const navigate = useNavigate();  

  const Logout = async() => {
    try {
        await axios.delete(`${process.env.BE_API_URL}/logout`);
        navigate("/");
    } catch (error) {
        console.log(error);
    }
  }

  const homeTarget = dashboardRoute || "/dashboard";

  return (
    <nav className="navbar navbar-expand-lg navbar-warning bg-warning shadow-sm">
      <div className="container">
        
        {/* 3. Ganti tag <a> menjadi <Link to={homeTarget}> */}
        <Link className="navbar-brand fw-bold" to={homeTarget}>
          MyDashboard
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarBasicExample" aria-controls="navbarBasicExample" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarBasicExample">
          
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              {/* 4. Ganti tag <a> menjadi <Link to={homeTarget}> */}
              <Link className="nav-link" to={homeTarget}>
                Home
              </Link>
            </li>
          </ul>

          <div className="d-flex">
            <button onClick={Logout} className="btn btn-outline-danger">
              Logout
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;