import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signinPage.css';
import axios from 'axios'
import { useAuth } from '../../context/AuthContext';
import { SyncLoader } from 'react-spinners';

const SigninPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {login,isLoading} = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password,navigate);
  };
  if(isLoading){
    return(
      <div>
        <SyncLoader color="#36D7B7" />
      </div>
    )
  }

  return (
    <div className="signInPage">
      <div className="signInContainer">
        <div className="signInHeader">
          <h2>Welcome Back!</h2>
          <p>Sign in to continue to your account.</p>
        </div>
        <form onSubmit={handleSubmit} className="signInForm">
          <div className="formGroup">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="formGroup">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="showPassword"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </span>
          </div>
        
          <button type="submit" className="signInButton">
            Sign In
          </button>
        </form>
        <div className="signInFooter">
          <p>
            Don't have an account? <a href="/sign-up">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;