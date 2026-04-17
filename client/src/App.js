import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/pages/Login';
import Register from './components/admin/Register';
import Dashboard from './components/Dashboard';

// INI DIA ALAMAT YANG BENAR UNTUK USERDASHBOARD 🎯
import UserDashboard from './components/user/UserDashboard'; 
import TeacherDashboard from './components/teacher/TeacherDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import LevelPage from './components/user/LevelPage';
import QuizPage from './components/user/QuizPage';
import ChatbotPage from './components/user/ChatbotPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        
        {/* Rute ini yang akan dituju oleh Admin (Role 1) saat login berhasil */}
        <Route path='/admin-dashboard' element={<AdminDashboard />} />
        {/* Rute ini yang akan dituju oleh Student (Role 2) saat login berhasil */}
        <Route path='/student-dashboard' element={<UserDashboard />} />
        {/* Rute ini yang akan dituju oleh Teacher (Role 3) saat login berhasil */}
        <Route path='/teacher-dashboard' element={<TeacherDashboard />} />
        <Route path="/quiz/:levelId" element={<QuizPage />} />
        <Route path="/level" element={<LevelPage />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
        
        
        {/* Rute bawaan kamu sebelumnya */}
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;