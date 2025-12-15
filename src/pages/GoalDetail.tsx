import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GoalContext } from '../context/Goalcontext';
import { goalsAPI } from '../utils/api';
import { ArrowLeft, Calendar, Tag, Trash2, CheckCircle, Circle } from 'lucide-react';
import './GoalDetail.css';

const GoalDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const goalContext = useContext(GoalContext);
  const [newMilestone, setNewMilestone] = useState('');

  if (!goalContext) {
    throw new Error('GoalDetail must be used within GoalContext.Provider');
  }

  const { state, dispatch } = goalContext;

  // 🔑 Derive current goal from context
  useEffect(() => {
  if (!id) return;

  // If we already have this goal, do nothing
  if (state.currentGoal?._id === id) return;

  const fetchGoal = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await goalsAPI.getById(id);
      dispatch({ type: 'SET_CURRENT_GOAL', payload: response.data });
    } catch (err) {
      console.error('Failed to fetch goal', err);
      navigate('/goals');
    }
  };

  fetchGoal();
}, [id]); // ✅ ONLY id


  const handleToggleMilestone = async (milestoneId: string) => {
    if (!id) return;

    try {
      const response = await goalsAPI.toggleMilestone(id, milestoneId);
      dispatch({ type: 'UPDATE_GOAL', payload: response.data });
    } catch (error) {
      console.error('Failed to toggle milestone:', error);
    }
  };

  const handleAddMilestone = async () => {
    if (!id || !state.currentGoal || !newMilestone.trim()) return;

    try {
      const response = await goalsAPI.update(id, {
        milestones: [
          ...state.currentGoal.milestones,
          { title: newMilestone, completed: false }
        ]
      });

      dispatch({ type: 'UPDATE_GOAL', payload: response.data });
      setNewMilestone('');
    } catch (error) {
      console.error('Failed to add milestone:', error);
    }
  };

  const handleDeleteGoal = async () => {
    if (!id) return;

    if (!window.confirm('Are you sure you want to delete this goal?')) return;

    try {
      await goalsAPI.delete(id);
      dispatch({ type: 'DELETE_GOAL', payload: id });
      navigate('/goals', { replace: true });
    } catch (error) {
      console.error('Failed to delete goal:', error);
    }
  };

  if (!state.currentGoal) {
    return (
      <div className="goal-detail-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading goal...</p>
        </div>
      </div>
    );
  }

  const goal = state.currentGoal;
  const completed = goal.milestones.filter(m => m.completed).length;
  const progress = goal.milestones.length
    ? (completed / goal.milestones.length) * 100
    : 0;

  return (
    <div className="goal-detail-page">
      <button onClick={() => navigate('/goals')} className="back-button">
        <ArrowLeft size={20} /> Back to Goals
      </button>

      <div className="goal-detail-header">
        <div className="goal-header-content">
          <h1>{goal.title}</h1>
          <span className={`status-badge ${goal.status}`}>{goal.status}</span>
        </div>
        <button onClick={handleDeleteGoal} className="delete-button">
          <Trash2 size={20} /> Delete Goal
        </button>
      </div>

      <div className="goal-detail-grid">
        <div className="goal-main-content">
          <div className="goal-info-card">
            <h2>Description</h2>
            <p>{goal.description}</p>

            <div className="goal-metadata">
              <div className="metadata-item">
                <Calendar size={18} />
                <span>{new Date(goal.targetDate).toLocaleDateString()}</span>
              </div>
              <div className="metadata-item">
                <Tag size={18} />
                <span>{goal.category}</span>
              </div>
            </div>
          </div>

          <div className="milestones-card">
            <h2>Milestones</h2>

            <div className="add-milestone">
              <input
                value={newMilestone}
                onChange={e => setNewMilestone(e.target.value)}
                placeholder="Add a milestone"
                className="milestone-input"
              />
              <button onClick={handleAddMilestone} className="btn-primary">
                Add
              </button>
            </div>

            <div className="milestones-list">
              {goal.milestones.map(m => (
                <div
                  key={m._id}
                  className={`milestone-item ${m.completed ? 'completed' : ''}`}
                  onClick={() => m._id && handleToggleMilestone(m._id)}
                >
                  {m.completed
                    ? <CheckCircle size={22} />
                    : <Circle size={22} />}
                  <span>{m.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="goal-sidebar">
          <div className="progress-card">
            <h3>Progress</h3>
            <div className="progress-circle">
              {Math.round(progress)}%
            </div>
            <p>{completed} / {goal.milestones.length} completed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalDetail;
