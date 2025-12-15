import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/Authcontext';
import { Target, LogOut, Home, BookOpen, PlusCircle, User } from 'lucide-react';
import './Navbar.css';

const Navbar: React.FC = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  if (!authContext) {
    throw new Error('Navbar must be used within AuthContext.Provider');
  }

  const { state, dispatch } = authContext;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Dispatch logout action
    dispatch({ type: 'LOGOUT' });
    
    // Close dropdown
    setShowDropdown(false);
    
    // Navigate to login
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <Target size={28} />
          <span>Learning Tracker</span>
        </Link>

        <div className="navbar-links">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            <Home size={20} />
            <span>Dashboard</span>
          </Link>

          <Link 
            to="/goals" 
            className={`nav-link ${isActive('/goals') ? 'active' : ''}`}
          >
            <Target size={20} />
            <span>Goals</span>
          </Link>

          <Link 
            to="/courses" 
            className={`nav-link ${isActive('/courses') ? 'active' : ''}`}
          >
            <BookOpen size={20} />
            <span>Courses</span>
          </Link>

          <Link 
            to="/goals/create" 
            className="nav-link create-button"
          >
            <PlusCircle size={20} />
            <span>Create Goal</span>
          </Link>
        </div>

        <div className="navbar-user" ref={dropdownRef}>
          <button 
            className="user-button"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {state.user?.picture ? (
              <img 
                src={state.user.picture} 
                alt={state.user.name} 
                className="user-avatar"
              />
            ) : (
              <div className="user-avatar-placeholder">
                <User size={20} />
              </div>
            )}
            <span className="user-name">{state.user?.name}</span>
          </button>

          {showDropdown && (
            <div className="dropdown-menu">
              <div className="dropdown-header">
                <p className="dropdown-user-name">{state.user?.name}</p>
                <p className="dropdown-user-email">{state.user?.email}</p>
              </div>
              <div className="dropdown-divider"></div>
              <button 
                className="dropdown-item logout-item"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;