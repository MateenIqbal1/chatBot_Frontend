import React, { useEffect, useState } from 'react';
import './dashBoardLayout.css';
import { Outlet, useNavigate } from 'react-router-dom';
import ChatList from '../../components/chatList/ChatList';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const DashBoardLayout = () => {
   const { user, isLoading ,isAuthenticated} = useAuth();
   const navigate = useNavigate();
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

   

   const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
   };

   const closeSidebar = () => {
      if (window.innerWidth <= 768) {
         setIsSidebarOpen(false);
      }
   };

   if (isLoading) {
      return "Loading.....";
   }

 

   return (
      <div className='dashboardLayout'>
         <div className="hamburger-menu" onClick={toggleSidebar}>
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
         </div>

         <div className={`menu ${isSidebarOpen ? 'open' : ''}`}>
            <ChatList onClick={closeSidebar} />
         </div>

         <div className="content" onClick={closeSidebar}>
            <Outlet />
         </div>
      </div>
   );
};

export default DashBoardLayout;