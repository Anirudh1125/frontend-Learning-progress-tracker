import React, { useState, useReducer, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoalContext } from '../context/Goalcontext';
import type { Goal } from '../context/Goalcontext';
import { goalsAPI } from '../utils/api';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import './CreateGoal.css';

// Form data interface
interface CreateGoalFormData {
  title: string;
  category: Goal['category'];
  description: string;
  targetDate: string;
  milestones: Array<{ title: string; completed: boolean }>;
}

// Form action interface
interface FormAction {
  type: 'UPDATE_FIELD' | 'ADD_MILESTONE' | 'REMOVE_MILESTONE' | 'RESET';
  field?: string;
  value?: any;
  index?: number;
}

// Multi-step form reducer
const formReducer = (state: CreateGoalFormData, action: FormAction): CreateGoalFormData => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field as string]: action.value };
    case 'ADD_MILESTONE':
      return { ...state, milestones: [...state.milestones, action.value] };
    case 'REMOVE_MILESTONE':
      return { 
        ...state, 
        milestones: state.milestones.filter((_, index) => index !== action.index) 
      };
    case 'RESET':
      return action.value as CreateGoalFormData;
    default:
      return state;
  }
};

const initialFormState: CreateGoalFormData = {
  title: '',
  category: 'Programming',
  description: '',
  targetDate: '',
  milestones: []
};

const CreateGoal: React.FC = () => {
  const navigate = useNavigate();
  const goalContext = useContext(GoalContext);
  
  if (!goalContext) {
    throw new Error('CreateGoal must be used within GoalContext.Provider');
  }

  const { dispatch: goalDispatch } = goalContext;
  const [formData, formDispatch] = useReducer(formReducer, initialFormState);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [newMilestone, setNewMilestone] = useState<string>('');

  const categories: Goal['category'][] = [
    'Programming', 
    'Design', 
    'Business', 
    'Languages', 
    'Music', 
    'Fitness',
    'Other'
  ];

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.title.trim() !== '';
      case 2:
        return formData.description.trim() !== '' && formData.targetDate !== '';
      case 3:
        return formData.milestones.length > 0;
      default:
        return true;
    }
  };

  const handleAddMilestone = () => {
    if (newMilestone.trim()) {
      formDispatch({
        type: 'ADD_MILESTONE',
        value: { title: newMilestone, completed: false }
      });
      setNewMilestone('');
    }
  };

  const handleRemoveMilestone = (index: number) => {
    formDispatch({ type: 'REMOVE_MILESTONE', index });
  };

  const handleSubmit = async () => {
    try {
      const goalData: Partial<Goal> = {
        ...formData,
        status: 'in-progress'
      };

      const response = await goalsAPI.create(goalData);
      goalDispatch({ type: 'ADD_GOAL', payload: response.data });
      navigate('/goals');
    } catch (error) {
      console.error('Failed to create goal:', error);
      alert('Failed to create goal. Please try again.');
    }
  };

  return (
    <div className="create-goal-page">
      <div className="create-goal-container">
        <h1>Create New Learning Goal</h1>
        
        <div className="progress-indicator">
          {[1, 2, 3, 4].map(step => (
            <div 
              key={step} 
              className={`step ${currentStep >= step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}
            >
              {currentStep > step ? <Check size={20} /> : step}
            </div>
          ))}
        </div>

        <div className="form-card">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="form-step">
              <h2>Basic Information</h2>
              <div className="form-group">
                <label>Goal Title *</label>
                <input
                  type="text"
                  placeholder="e.g., Learn React Development"
                  value={formData.title}
                  onChange={(e) => formDispatch({ 
                    type: 'UPDATE_FIELD', 
                    field: 'title', 
                    value: e.target.value 
                  })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => formDispatch({ 
                    type: 'UPDATE_FIELD', 
                    field: 'category', 
                    value: e.target.value as Goal['category']
                  })}
                  className="form-select"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {currentStep === 2 && (
            <div className="form-step">
              <h2>Goal Details</h2>
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  placeholder="Describe what you want to achieve..."
                  value={formData.description}
                  onChange={(e) => formDispatch({ 
                    type: 'UPDATE_FIELD', 
                    field: 'description', 
                    value: e.target.value 
                  })}
                  className="form-textarea"
                  rows={5}
                />
              </div>

              <div className="form-group">
                <label>Target Date *</label>
                <input
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => formDispatch({ 
                    type: 'UPDATE_FIELD', 
                    field: 'targetDate', 
                    value: e.target.value 
                  })}
                  className="form-input"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          )}

          {/* Step 3: Milestones */}
          {currentStep === 3 && (
            <div className="form-step">
              <h2>Add Milestones</h2>
              <p className="step-description">
                Break down your goal into smaller, achievable milestones
              </p>

              <div className="milestone-input-group">
                <input
                  type="text"
                  placeholder="Enter a milestone..."
                  value={newMilestone}
                  onChange={(e) => setNewMilestone(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddMilestone()}
                  className="form-input"
                />
                <button onClick={handleAddMilestone} className="btn-add">
                  Add
                </button>
              </div>

              <div className="milestones-list">
                {formData.milestones.map((milestone, index) => (
                  <div key={index} className="milestone-item">
                    <span>{milestone.title}</span>
                    <button 
                      onClick={() => handleRemoveMilestone(index)}
                      className="btn-remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {formData.milestones.length === 0 && (
                <p className="empty-message">No milestones added yet</p>
              )}
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="form-step">
              <h2>Review Your Goal</h2>
              <div className="review-section">
                <div className="review-item">
                  <strong>Title:</strong>
                  <p>{formData.title}</p>
                </div>
                <div className="review-item">
                  <strong>Category:</strong>
                  <p>{formData.category}</p>
                </div>
                <div className="review-item">
                  <strong>Description:</strong>
                  <p>{formData.description}</p>
                </div>
                <div className="review-item">
                  <strong>Target Date:</strong>
                  <p>{new Date(formData.targetDate).toLocaleDateString()}</p>
                </div>
                <div className="review-item">
                  <strong>Milestones ({formData.milestones.length}):</strong>
                  <ul>
                    {formData.milestones.map((m, i) => (
                      <li key={i}>{m.title}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="form-actions">
            {currentStep > 1 && (
              <button onClick={handlePrevious} className="btn-secondary">
                <ChevronLeft size={20} /> Previous
              </button>
            )}
            
            <div className="spacer" />

            {currentStep < 4 ? (
              <button 
                onClick={handleNext} 
                className="btn-primary"
                disabled={!validateStep(currentStep)}
              >
                Next <ChevronRight size={20} />
              </button>
            ) : (
              <button onClick={handleSubmit} className="btn-success">
                <Check size={20} /> Create Goal
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGoal;