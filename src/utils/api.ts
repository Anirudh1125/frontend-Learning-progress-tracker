import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type { Goal } from '../context/Goalcontext';
import type { User } from '../context/Authcontext';

const API_URL = import.meta.env.VITE_API_URL as string || 'http://localhost:5000';

// Types
export interface Course {
  id: number;
  title: string;
  provider: string;
  category: string;
  rating: number;
  students: number;
  duration: string;
  level: string;
  price: number;
  thumbnail: string;
}

interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

interface GoalsResponse extends AxiosResponse {
  data: Goal[];
}

interface GoalResponse extends AxiosResponse {
  data: Goal;
}

interface CoursesResponse extends AxiosResponse {
  data: {
    success: boolean;
    data: Course[];
    query?: string;
    count?: number;
    category?: string;
  };
}

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  googleLogin: (credential: string): Promise<AxiosResponse<AuthResponse>> => 
    api.post<AuthResponse>('/api/auth/google', { credential })
};

// Goals endpoints
export const goalsAPI = {
  getAll: (): Promise<GoalsResponse> => 
    api.get<Goal[]>('/api/goals'),
  
  getById: (id: string): Promise<GoalResponse> => 
    api.get<Goal>(`/api/goals/${id}`),
  
  create: (goalData: Partial<Goal>): Promise<GoalResponse> => 
    api.post<Goal>('/api/goals', goalData),
  
  update: (id: string, goalData: Partial<Goal>): Promise<GoalResponse> => 
    api.put<Goal>(`/api/goals/${id}`, goalData),
  
  delete: (id: string): Promise<AxiosResponse> => 
    api.delete(`/api/goals/${id}`),
  
  toggleMilestone: (goalId: string, milestoneId: string): Promise<GoalResponse> => 
    api.patch<Goal>(`/api/goals/${goalId}/milestones/${milestoneId}/toggle`)
};

// Courses endpoints
export const coursesAPI = {
  getPopular: (): Promise<CoursesResponse> => 
    api.get('/api/courses/popular'),
  
  search: (query: string): Promise<CoursesResponse> => 
    api.get(`/api/courses/search?q=${query}`),
  
  getByCategory: (category: string): Promise<CoursesResponse> => 
    api.get(`/api/courses/category/${category}`)
};

export default api;