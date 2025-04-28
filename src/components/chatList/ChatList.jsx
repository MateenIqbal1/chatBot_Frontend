import React from 'react';
import './chatList.css';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';

const ChatList = () => {
  const { isAuthenticated, token } = useAuth();
 
  

  const { isPending, error, data } = useQuery({
    queryKey: ['userChats'],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/userchats`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      }).then((res) => res.json()),
    enabled: !!token, 
  });
  


  if (!isAuthenticated) {
    return <p>Please log in to access the chat list.</p>;
  }

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data || !Array.isArray(data)) {
    return <div>Error: {data?.message || 'Invalid response from server'}</div>;
  }

  return (
    <div className="chatList">
      <span className="title">DASHBOARD</span>
      <Link to="/dashboard">Create a new Chat</Link>
      <Link to="/">Explorer Smarter Ai</Link>
      <Link to="/">Contact</Link>
      <hr />
      <span className="title">RECENT CHATS</span>
      <div className="list">
        {data?.map((chat) => (
          <Link to={`/dashboard/chats/${chat._id}`} key={chat._id}>
            {chat.title.length > 25 ? chat.title.slice(0, 25) + '...' : chat.title}
          </Link>
        ))}
      </div>
      <hr />
      <div className="upgrade">
        <img src="/logo.png" alt="" />
        <div className="texts">
          <span>Upgrade to SMARTER AI PRO</span>
          <span>Get unlimited access to all features</span>
        </div>
      </div>
    </div>
  );
};

export default ChatList;