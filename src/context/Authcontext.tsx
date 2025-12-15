import { createContext } from 'react';
import type { Dispatch } from 'react';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface AuthAction {
  type: 'LOGIN_START' | 'LOGIN_SUCCESS' | 'LOGIN_FAILURE' | 'LOGOUT';
  payload?: any;
}

interface AuthContextType {
  state: AuthState;
  dispatch: Dispatch<AuthAction>;
}

// Context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial State
export const initialAuthState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

// Reducer
export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user as User,
        token: action.payload.token as string,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    
    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload as string,
        isAuthenticated: false
      };
    
    case 'LOGOUT':
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return {
        ...initialAuthState
      };
    
    default:
      return state;
  }
};