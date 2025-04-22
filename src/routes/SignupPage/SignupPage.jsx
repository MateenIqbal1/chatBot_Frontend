import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './signupPage.css';
import {SyncLoader} from 'react-spinners'

const SignupPage = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { register ,isLoading} = useAuth();
  const navigate = useNavigate();


  if(isLoading){
    return(
      <div>
        <SyncLoader color="#36D7B7" />
      </div>
    )
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
   
     register(userName , email, password ,navigate);
     
  };

  return (
    <div className="signUpPage">
      <div className="signUpContainer">
        <div className="signUpHeader">
          <h3>Create Your Account</h3>
          <p>Join us to get started!</p>
        </div>
        <form onSubmit={handleSubmit} className="signUpForm">
          <div className="formGroup">
            <input
              type="text"
              id="name"
              placeholder="Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div className="formGroup">
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="formGroup">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
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
          
          <button type="submit" className="signUpButton">
            Sign Up
          </button>
        </form>
        <div className="signUpFooter">
          <p>
            Already have an account? <a href="/sign-in">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;