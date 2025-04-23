import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();
const API_BASE_URL = import.meta.env.VITE_API_URL;


export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);

  const checkAuth = async () => {
    try {
      const storedToken = JSON.parse(sessionStorage.getItem('token')); 
      if (!storedToken) {
        setIsAuthenticated(false);
        setUser(null);
        setToken(null);
        setIsLoading(false);
        return;
      }
  
      const response = await axios.get(`${API_BASE_URL}api/auth/check-auth`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
  
      if (response.data.success) {
        setIsAuthenticated(true);
        setUser(response.data.user);
        setToken(storedToken);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setToken(null);
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      setIsAuthenticated(false);
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };
  

  const login = async (email, password, navigate) => {
    setIsLoading(true); 

    try {
      const response = await axios.post(`${API_BASE_URL}api/auth/login`, {
        email,
        password,
      });

      if (response.data.success) {
        sessionStorage.setItem('token', JSON.stringify(response.data.token));
        setIsAuthenticated(true);
        setUser(response.data.user);
        toast.success('Logged In  successful! '); 
        navigate('/'); 
      }else{
        toast.error(response.data.message || 'Registration failed');

      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong!'); 
      console.error('Login error:', error);
    }finally{
      setIsLoading(false)
    }
  };

  const register = async (userName , email, password ,navigate) => {
    setIsLoading(true); 
    try {
      const response = await axios.post(`${API_BASE_URL}api/auth/register`, {
       userName,
        email,
        password,
      });

      if (response.data.success) {
        toast.success('Registration successful! Please sign in.'); 
        navigate('/sign-in');
      }else{
        toast.error(response.data.message || 'Registration failed');

      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong!');

      console.error('Login error:', error);
    }finally{
      setIsLoading(false)
    }
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:3000/api/auth/logout');
      sessionStorage.removeItem('token'); // Remove the token from sessionStorage
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }finally{
      setIsLoading(false)
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
<AuthContext.Provider value={{ isAuthenticated, user, token, isLoading, login, logout ,register}}>
{children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);