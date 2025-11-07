import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute: React.FC = () => {
  // 1. localStorage-லிருந்து token-ஐச் சரிபார்க்கிறது
  const token = localStorage.getItem('token');

  // 2. Token இருந்தால், பயனரை அனுமதிக்கிறது
  if (token) {
    // 'Outlet' என்பது child route-ஐ (e.g., <DashboardPage />) குறிக்கிறது
    return <Outlet />; 
  }

  // 3. Token இல்லையென்றால், login பக்கத்திற்குத் திருப்பி விடுகிறது
  return <Navigate to="/login" replace />;
};

export default PrivateRoute;