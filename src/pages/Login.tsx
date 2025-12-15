import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';
import { AuthContext } from '../context/Authcontext';
import { authAPI } from '../utils/api';
import './Login.css';

const Login: React.FC = () => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  if (!context) {
    throw new Error('Login must be used within AuthContext.Provider');
  }

  const { dispatch } = context;

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error('No credential received');
      }

      dispatch({ type: 'LOGIN_START' });
      
      const response = await authAPI.googleLogin(credentialResponse.credential);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token }
      });
      
      navigate('/');
    } catch (error: any) {
      console.error('Login failed:', error);
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error.response?.data?.message || 'Login failed'
      });
    }
  };

  const handleGoogleError = () => {
    dispatch({
      type: 'LOGIN_FAILURE',
      payload: 'Google login failed'
    });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <h1>Learning Progress Tracker</h1>
          <p className="subtitle">Track your goals, master your skills</p>
          
          <div className="login-illustration">
            <svg viewBox="0 0 200 200" className="hero-svg">
              <circle cx="100" cy="100" r="80" fill="#667eea" opacity="0.1"/>
              <circle cx="100" cy="100" r="60" fill="#667eea" opacity="0.2"/>
              <circle cx="100" cy="100" r="40" fill="#667eea" opacity="0.3"/>
              <path d="M100,60 L100,100 L130,100" stroke="#667eea" strokeWidth="4" fill="none" strokeLinecap="round"/>
            </svg>
          </div>

          <div className="login-button-container">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              theme="filled_blue"
              size="large"
              text="signin_with"
              shape="rectangular"
            />
          </div>

          <div className="features">
            <div className="feature">
              <span className="feature-icon">🎯</span>
              <span>Set learning goals</span>
            </div>
            <div className="feature">
              <span className="feature-icon">📊</span>
              <span>Track progress</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🎓</span>
              <span>Discover courses</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;