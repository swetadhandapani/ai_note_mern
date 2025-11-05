import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from './components/ThemeToggle.jsx';

export default function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // 👈 detect route change

  // Recheck login status every time route changes
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location]); // 👈 triggers on navigation (like after login)

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            to="/notes"
            className="font-bold text-lg text-gray-900 dark:text-gray-100"
          >
            AI Notes
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            {user ? (
              <>
                <span className="text-sm">
                  Hi, <strong>{user.name}</strong>
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm border px-2 py-1 rounded hover:bg-red-600 hover:text-white transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm hover:underline">
                  Login
                </Link>
                <Link to="/register" className="text-sm hover:underline">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
