import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GoalContext } from '../context/Goalcontext';
import { goalsAPI } from '../utils/api';
import { PlusCircle, Filter, Target } from 'lucide-react';
import './Goals.css';

// Global flag outside component - same pattern as Dashboard
let globalHasFetchedGoals = false;

const Goals: React.FC = () => {
  const goalContext = useContext(GoalContext);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  if (!goalContext) {
    throw new Error('Goals must be used within GoalContext.Provider');
  }

  const { state, dispatch } = goalContext;

  useEffect(() => {
    if (globalHasFetchedGoals) {
      console.log('Goals already fetched, skipping...');
      return;
    }
    
    console.log('Fetching goals...');
    globalHasFetchedGoals = true;
    
    goalsAPI.getAll()
      .then(response => {
        console.log('Got goals:', response.data);
        dispatch({ type: 'SET_GOALS', payload: response.data });
      })
      .catch(error => {
        console.error('Failed to fetch goals:', error);
        globalHasFetchedGoals = false; // Reset on error
      });
  }, []); // Empty dependency array

  const filteredGoals = state.goals.filter(goal => {
    const matchesFilter = filter === 'all' || goal.status === filter;
    const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="goals-page">
      <div className="goals-header">
        <div>
          <h1>My Goals</h1>
          <p>{state.goals.length} total goals</p>
        </div>
        <Link to="/goals/create" className="btn-primary">
          <PlusCircle size={20} /> Create New Goal
        </Link>
      </div>

      <div className="goals-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search goals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-container">
          <Filter size={18} />
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Goals</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="not-started">Not Started</option>
            <option value="on-hold">On Hold</option>
          </select>
        </div>
      </div>

      {state.loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading goals...</p>
        </div>
      ) : filteredGoals.length === 0 ? (
        <div className="empty-state">
          <Target size={64} />
          <h3>No goals found</h3>
          <p>
            {state.goals.length === 0 
              ? "Create your first learning goal to get started!"
              : "Try adjusting your filters or search term."}
          </p>
          {state.goals.length === 0 && (
            <Link to="/goals/create" className="btn-primary">
              Create Your First Goal
            </Link>
          )}
        </div>
      ) : (
        <div className="goals-grid">
          {filteredGoals.map(goal => {
            const progress = goal.milestones.length > 0
              ? (goal.milestones.filter(m => m.completed).length / goal.milestones.length) * 100
              : 0;

            return (
              <Link to={`/goals/${goal._id}`} key={goal._id} className="goal-card">
                <div className="goal-card-header">
                  <h3>{goal.title}</h3>
                  <span className={`status-badge ${goal.status}`}>
                    {goal.status}
                  </span>
                </div>

                <p className="goal-description">{goal.description}</p>

                <div className="goal-meta">
                  <span className="category-tag">{goal.category}</span>
                  <span className="target-date">
                    Due: {new Date(goal.targetDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="goal-progress">
                  <div className="progress-info">
                    <span>Progress</span>
                    <span className="progress-percentage">{Math.round(progress)}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="milestone-count">
                    {goal.milestones.filter(m => m.completed).length} / {goal.milestones.length} milestones
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Goals;