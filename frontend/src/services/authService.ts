import api from './api'; // நாம் உருவாக்கிய axios instance-ஐ import செய்கிறோம்

// 1. Register
const register = (userData: any) => {
  return api.post('/auth/register', userData);
};

// 2. Login
const login = async (userData: any) => {
  // api.post ஆனது axios response-ஐத் திருப்பிக் கொடுக்கும்
  const response = await api.post('/auth/login', userData);

  // response-இன் உள்ளே 'data' என்ற property-ல் (e.g., { user, token })
  // backend அனுப்பிய JSON இருக்கும்.
  if (response.data && response.data.token) {
    // Login வெற்றி பெற்றால், token-ஐ Local Storage-ல் சேமிக்கிறோம்
    localStorage.setItem('token', response.data.token);
  }
  
  return response.data; // { user, token }
};

// 3. Logout
const logout = () => {
  // Local Storage-லிருந்து token-ஐ நீக்குகிறோம்
  localStorage.removeItem('token');
  // (Backend-ல் token-ஐ invalidate செய்ய நாம் எதுவும் செய்யவில்லை,
  // அதனால் frontend-ல் token-ஐ அழித்தால் போதும்)
};

// 4. Get Profile
const getProfile = () => {
  return api.get('/users/profile');
};

// 5. Update Profile
const updateProfile = (profileData: any) => {
  return api.put('/users/profile', profileData);
};
// ... (register, login, logout, getProfile, updateProfile)

// 6. Forgot Password (Request Token)
const forgotPassword = (email: string) => {
  return api.post('/auth/forgot-password', { email });
};

// 7. Reset Password (Submit new password and token)
const resetPassword = (token: string, password: string) => {
  return api.post(`/auth/reset-password/${token}`, { password });
};

// அனைத்தையும் export செய்தல்
const authService = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  forgotPassword, // <-- இதைச் சேர்க்கவும்
  resetPassword,  // <-- இதைச் சேர்க்கவும்
};

export default authService;

