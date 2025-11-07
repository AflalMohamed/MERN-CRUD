import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage'; 
import ResetPasswordPage from './pages/ResetPasswordPage';  
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import PrivateRoute from './components/PrivateRoute';
import MainLayout from './components/MainLayout'; // <-- 1. MainLayout-ஐ import செய்யவும்

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} /> 
      <Route path="/reset-password/:token" element={<ResetPasswordPage/> }/>

      {/* 2. Private Routes-ஐ இவ்வாறு மாற்றவும் */}
      <Route element={<PrivateRoute />}> 
        <Route element={<MainLayout />}> {/* <-- 3. MainLayout-ஐ இங்கே nest செய்யவும் */}
          {/* MainLayout-க்கு உள்ளே காட்டப்படும் பக்கங்கள் (children) */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Default Route */}
      <Route path="/" element={<Navigate to="/login" replace />} /> 
    </Routes>
  );
}

export default App;