import React, { useEffect, useState } from "react";
import { Outlet, Link,  } from "react-router-dom";
import authService from "../services/authService";

interface UserProfile {
  name: string;
  email: string;
}

const MainLayout: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  //const navigate = useNavigate();

  // 🔹 Fetch user profile once when layout mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authService.getProfile();
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch profile for layout", error);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      {/* 🔹 Sidebar */}
      <aside className="w-64 bg-white/90 backdrop-blur-md shadow-xl border-r border-gray-100 flex flex-col">
        {/* Logo Section */}
        <div className="h-20 flex items-center justify-center border-b border-gray-100">
          <h1 className="text-2xl font-extrabold text-gray-800 tracking-wide">
            <span className="text-blue-600">My</span>Inventory
          </h1>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link
            to="/dashboard"
            className="flex items-center px-4 py-3 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 font-medium"
          >
            <svg
              className="w-6 h-6 mr-3 text-blue-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 7h16M4 12h16M4 17h16"
              />
            </svg>
            Dashboard
          </Link>

          <Link
            to="/profile"
            className="flex items-center px-4 py-3 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 font-medium"
          >
            <svg
              className="w-6 h-6 mr-3 text-blue-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 12c2.28 0 4.12-1.84 4.12-4.12S14.28 3.76 12 3.76 7.88 5.6 7.88 7.88 9.72 12 12 12zm0 2.24c-2.48 0-7.44 1.24-7.44 3.72v1.28h14.88v-1.28c0-2.48-4.96-3.72-7.44-3.72z"
              />
            </svg>
            Profile
          </Link>
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-100 p-4 text-sm text-gray-500 text-center">
          © {new Date().getFullYear()} Inventory App
        </div>
      </aside>

      {/* 🔹 Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-700">
              {user ? `Welcome, ${user.name}` : "Loading user..."}
            </h2>
            <p className="text-sm text-gray-400">
              {user ? user.email : "Fetching email..."}
            </p>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-white to-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
