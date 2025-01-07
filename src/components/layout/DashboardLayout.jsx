import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className={`flex h-screen overflow-hidden transition-colors duration-200 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <Sidebar darkMode={darkMode} toggleDarkMode={toggleDarkMode}  userRole={user?.role} />
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} /> */}
          <main className={`flex-1 overflow-y-auto p-6 transition-colors duration-200 ${darkMode ? 'bg-gray-900 text-white' : 'bg-amber-50/50 text-gray-900'}`}>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
