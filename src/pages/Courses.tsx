import React, { useState, useEffect } from 'react';
import { coursesAPI } from '../utils/api';
import type { Course } from '../utils/api';
import { Search, Filter, Star, Users, Clock } from 'lucide-react';
import './Courses.css';

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Programming', 'Design', 'Business', 'Languages', 'Music'];

  useEffect(() => {
    fetchPopularCourses();
  }, []);

  const fetchPopularCourses = async () => {
    try {
      setLoading(true);
      const response = await coursesAPI.getPopular();
      setCourses(response.data.data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchPopularCourses();
      return;
    }

    try {
      setLoading(true);
      const response = await coursesAPI.search(searchQuery);
      setCourses(response.data.data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = async (category: string) => {
    setSelectedCategory(category);
    
    if (category === 'all') {
      fetchPopularCourses();
      return;
    }

    try {
      setLoading(true);
      const response = await coursesAPI.getByCategory(category);
      setCourses(response.data.data);
    } catch (error) {
      console.error('Filter failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="courses-page">
      <div className="courses-header">
        <h1>Discover Courses</h1>
        <p>Find the perfect course to achieve your learning goals</p>
      </div>

      <div className="courses-filters">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-container">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <button type="submit" className="btn-primary">
            Search
          </button>
        </form>

        <div className="category-filters">
          <Filter size={18} />
          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryFilter(category)}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading courses...</p>
        </div>
      ) : (
        <div className="courses-grid">
          {courses.map(course => (
            <div key={course.id} className="course-card">
              <div className="course-thumbnail">
                <img src={course.thumbnail} alt={course.title} />
                <span className="course-level">{course.level}</span>
              </div>
              
              <div className="course-content">
                <h3>{course.title}</h3>
                <p className="course-provider">{course.provider}</p>
                
                <div className="course-meta">
                  <div className="meta-item">
                    <Star size={16} fill="#fbbf24" stroke="#fbbf24" />
                    <span>{course.rating}</span>
                  </div>
                  <div className="meta-item">
                    <Users size={16} />
                    <span>{(course.students / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="meta-item">
                    <Clock size={16} />
                    <span>{course.duration}</span>
                  </div>
                </div>

                <div className="course-footer">
                  <span className="course-price">
                    {course.price === 0 ? 'Free' : `$${course.price}`}
                  </span>
                  <button className="btn-enroll">View Course</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && courses.length === 0 && (
        <div className="empty-state">
          <p>No courses found. Try a different search or filter.</p>
        </div>
      )}
    </div>
  );
};

export default Courses;