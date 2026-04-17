import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import ChatBubble from "../../components/ChatBubble";
import "./ChatbotPage.css";


const ChatbotPage = () => {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      console.log("DECODED:", decoded);
      setUser(decoded);
    } catch (err) {
      console.error("Invalid token");
      navigate("/");
    }
  }, [navigate]);

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const token = localStorage.getItem("token");

    if (!token || !user) {
      console.log("User belum ready / token tidak ada");
      navigate("/");
      return;
    }
    console.log("USER:", user);
    console.log("LEVEL DIKIRIM:", user.level_detail_id, user.level);

    const currentInput = input;
    setInput("");

    const userMessage = { sender: "user", message: currentInput };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BE_API_URL}/api/chat`,
        {
          message: currentInput,
          level_detail_id: user.level_detail_id,
          level: user.level
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const botMessage = {
        sender: "bot",
        message: res.data.reply,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);

      setMessages((prev) => [
        ...prev,
        { sender: "bot", message: "Terjadi error, coba lagi." },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Chatbot</h3>
        <button className="btn btn-outline-secondary" onClick={goToDashboard}>
          ← Back
        </button>
      </div>

      <p>
        Level: <b>{user?.level || "Loading..."}</b>
      </p>

      <div
        className="border p-3 mb-3"
        style={{ height: "600px", overflowY: "auto" }}
      >
        {messages.map((msg, index) => (
          <ChatBubble key={index} {...msg} />
        ))}

        {loading && (
          <div className="d-flex justify-content-start mb-2">
            <div className="px-3 py-2 bg-light border rounded-4 d-inline-flex gap-1">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}
      </div>

      <div className="input-group">
        <input
          type="text"
          className="form-control"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ketik pesan..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <button
          className="btn btn-primary"
          onClick={sendMessage}
          disabled={loading || !user}
        >
          Kirim
        </button>
      </div>
    </div>
  );
};

export default ChatbotPage;