import { createContext } from 'react';
import type { Dispatch } from 'react';

// Types
export interface Milestone {
  _id?: string;
  title: string;
  completed: boolean;
  completedAt?: Date | null;
}

export interface Goal {
  _id: string;
  userId: string;
  title: string;
  description: string;
  category: 'Programming' | 'Design' | 'Business' | 'Languages' | 'Music' | 'Fitness' | 'Other';
  status: 'not-started' | 'in-progress' | 'completed' | 'on-hold';
  targetDate: string | Date;
  milestones: Milestone[];
  createdAt: Date;
  updatedAt: Date;
  progress?: number;
}

export interface GoalState {
  goals: Goal[];
  currentGoal: Goal | null;
  loading: boolean;
  error: string | null;
}

export interface GoalAction {
  type: 'SET_GOALS' | 'SET_CURRENT_GOAL' | 'ADD_GOAL' | 'UPDATE_GOAL' | 
        'DELETE_GOAL' | 'TOGGLE_MILESTONE' | 'SET_LOADING' | 'SET_ERROR';
  payload?: any;
}

interface GoalContextType {
  state: GoalState;
  dispatch: Dispatch<GoalAction>;
}

// Context
export const GoalContext = createContext<GoalContextType | undefined>(undefined);

// Initial State
export const initialGoalState: GoalState = {
  goals: [],
  currentGoal: null,
  loading: false,
  error: null
};

// Reducer
export const goalReducer = (state: GoalState, action: GoalAction): GoalState => {
  switch (action.type) {
    case 'SET_GOALS':
      return {
        ...state,
        goals: action.payload as Goal[],
        loading: false
      };
    
    case 'SET_CURRENT_GOAL':
      return {
        ...state,
        currentGoal: action.payload as Goal,
        loading: false
      };
    
    case 'ADD_GOAL':
      return {
        ...state,
        goals: [...state.goals, action.payload as Goal],
        loading: false
      };
    
    case 'UPDATE_GOAL':
      const updatedGoal = action.payload as Goal;
      return {
        ...state,
        goals: state.goals.map(goal => 
          goal._id === updatedGoal._id ? updatedGoal : goal
        ),
        currentGoal: state.currentGoal?._id === updatedGoal._id 
          ? updatedGoal 
          : state.currentGoal,
        loading: false
      };
    
    case 'DELETE_GOAL':
      return {
        ...state,
        goals: state.goals.filter(goal => goal._id !== action.payload),
        loading: false
      };
    
    case 'TOGGLE_MILESTONE':
      if (!state.currentGoal) return state;
      
      const updatedMilestones = state.currentGoal.milestones.map(milestone =>
        milestone._id && milestone._id === action.payload.milestoneId
          ? { ...milestone, completed: !milestone.completed }
          : milestone
      );
      
      const currentGoalUpdated: Goal = {
        ...state.currentGoal,
        milestones: updatedMilestones
      };
      
      return {
        ...state,
        currentGoal: currentGoalUpdated,
        goals: state.goals.map(goal =>
          goal._id === currentGoalUpdated._id ? currentGoalUpdated : goal
        )
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload as boolean
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload as string,
        loading: false
      };
    
    default:
      return state;
  }
};