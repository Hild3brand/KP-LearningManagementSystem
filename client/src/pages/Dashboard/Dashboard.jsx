import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    const decoded = jwtDecode(token);
    setUser(decoded);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Dashboard</h3>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <p>Halo, <b>{user?.userId} - {user?.name}</b></p>
      <p>Level: {user?.level_detail || "N/A"} - {user?.level || "N/A"}</p>

      <div className="row">
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Chatbot AI</h5>
              <p className="card-text">
                Belajar Bahasa Korea dengan AI tutor interaktif.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/chatbot")}
              >
                Buka Chatbot
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;