import React, { useState } from 'react';
import './rootLayout.css';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const queryClient = new QueryClient();

const RootLayout = () => {
  const { isAuthenticated, user, logout ,isLoading} = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  

  return (
    <QueryClientProvider client={queryClient}>
      <div className='rootLayout'>
        <header>
          <Link to='/' className='logo'>
            <img src="/logo.png" alt="" />
            <span>SMARTER AI</span>
          </Link>
          <div className="user">

            {isAuthenticated ? (
              <div className="profile-container">
                <button
                  className="profile-icon"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <FaUserCircle size={24} />
                </button>
                {isProfileOpen && (
                  <div className="profile-dropdown">
                    <p>Logged in as     <span  className='username'>{user?.userName}</span> </p>
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/sign-in" className="login-button">
                Login
              </Link>
            )}
          </div>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </QueryClientProvider>
  );
};

export default RootLayout;