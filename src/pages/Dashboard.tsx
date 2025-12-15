import React, { useContext, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/Authcontext';
import { GoalContext } from '../context/Goalcontext';
import { goalsAPI } from '../utils/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Target, TrendingUp, Award, BookOpen } from 'lucide-react';
import './Dashboard.css';

let globalHasFetched = false;

const Dashboard: React.FC = () => {
  const authContext = useContext(AuthContext);
  const goalContext = useContext(GoalContext);
  
  if (!authContext || !goalContext) {
    throw new Error('Dashboard must be used within Context Providers');
  }

  const { state: authState } = authContext;
  const { state: goalState, dispatch } = goalContext;

  useEffect(() => {
    if (globalHasFetched) return;
    
    globalHasFetched = true;
    
    goalsAPI.getAll()
      .then(response => {
        dispatch({ type: 'SET_GOALS', payload: response.data });
      })
      .catch(error => {
        console.error('Failed to fetch goals:', error);
        globalHasFetched = false;
      });
  }, [dispatch]);

  const stats = useMemo(() => {
    const total = goalState.goals.length;
    const completed = goalState.goals.filter(g => g.status === 'completed').length;
    const inProgress = goalState.goals.filter(g => g.status === 'in-progress').length;
    
    let totalMilestones = 0;
    let completedMilestones = 0;
    
    goalState.goals.forEach(goal => {
      totalMilestones += goal.milestones.length;
      completedMilestones += goal.milestones.filter(m => m.completed).length;
    });

    return { total, completed, inProgress, totalMilestones, completedMilestones };
  }, [goalState.goals]);

  const categoryData = useMemo(() => {
    const categories: Record<string, number> = {};
    goalState.goals.forEach(goal => {
      categories[goal.category] = (categories[goal.category] || 0) + 1;
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [goalState.goals]);

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe'];

  const completionRate = stats.totalMilestones > 0 
    ? Math.round((stats.completedMilestones / stats.totalMilestones) * 100) 
    : 0;

  const barChartData = useMemo(() => [
    { name: 'Completed', value: stats.completedMilestones },
    { name: 'Remaining', value: stats.totalMilestones - stats.completedMilestones }
  ], [stats.completedMilestones, stats.totalMilestones]);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Welcome back, {authState.user?.name?.split(' ')[0]}! 👋</h1>
        <p>Here's your learning progress overview</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <Target size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Total Goals</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.inProgress}</h3>
            <p>In Progress</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <Award size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.completed}</h3>
            <p>Completed</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
            <BookOpen size={24} />
          </div>
          <div className="stat-content">
            <h3>{completionRate}%</h3>
            <p>Overall Progress</p>
          </div>
        </div>
      </div>

      {goalState.goals.length > 0 && (
        <div className="charts-container">
          <div className="chart-card">
            <h3>Goals by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: any) => {
                    if (!props || props.percent === undefined) return '';
                    return `${props.name} ${(props.percent * 100).toFixed(0)}%`;
                  }}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Milestone Progress</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#667eea" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="recent-goals">
        <div className="section-header">
          <h2>Recent Goals</h2>
          <Link to="/goals/create" className="btn-primary">+ Create Goal</Link>
        </div>

        {goalState.goals.length === 0 ? (
          <div className="empty-state">
            <p>No goals yet. Create your first learning goal to get started!</p>
            <Link to="/goals/create" className="btn-primary">Create Your First Goal</Link>
          </div>
        ) : (
          <div className="goals-preview">
            {goalState.goals.slice(0, 3).map(goal => {
              const progress = goal.milestones.length > 0
                ? (goal.milestones.filter(m => m.completed).length / goal.milestones.length) * 100
                : 0;

              return (
                <Link to={`/goals/${goal._id}`} key={goal._id} className="goal-preview-card">
                  <h3>{goal.title}</h3>
                  <span className={`status-badge ${goal.status}`}>{goal.status}</span>
                  <p>{goal.description}</p>
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="progress-text">{Math.round(progress)}%</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {goalState.goals.length > 3 && (
          <div className="view-all">
            <Link to="/goals" className="btn-secondary">View All Goals →</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;