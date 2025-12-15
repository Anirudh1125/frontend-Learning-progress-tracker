import React, { useReducer, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthContext, authReducer, initialAuthState } from './context/Authcontext';
import { GoalContext, goalReducer, initialGoalState } from './context/Goalcontext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import CreateGoal from './pages/CreateGoal';
import GoalDetail from './pages/GoalDetail';
import Courses from './pages/Courses';
import './App.css';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function App() {
  const [authState, authDispatch] = useReducer(authReducer, initialAuthState);
  const [goalState, goalDispatch] = useReducer(goalReducer, initialGoalState);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        const user = JSON.parse(storedUser);
        console.log('Restoring auth from localStorage:', user.email);
        authDispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, token: storedToken }
        });
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    
    setAuthLoading(false);
  }, []);

  const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    if (authLoading) {
      return (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      );
    }
    
    return authState.isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
  };

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

  // CRITICAL FIX: Don't memoize! Just pass state directly
  // React will handle re-renders efficiently
  const authContextValue = { state: authState, dispatch: authDispatch };
  const goalContextValue = { state: goalState, dispatch: goalDispatch };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthContext.Provider value={authContextValue}>
        <GoalContext.Provider value={goalContextValue}>
          <Router>
            <div className="app">
              {authState.isAuthenticated && <Navbar />}
              <main className="main-content">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/goals"
                    element={
                      <ProtectedRoute>
                        <Goals />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/goals/create"
                    element={
                      <ProtectedRoute>
                        <CreateGoal />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/goals/:id"
                    element={
                      <ProtectedRoute>
                        <GoalDetail />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/courses"
                    element={
                      <ProtectedRoute>
                        <Courses />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>
            </div>
          </Router>
        </GoalContext.Provider>
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
}

export default App;