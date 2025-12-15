# Architecture Documentation

## System Architecture Overview

The Learning Progress Tracker follows a three-tier architecture:

1. Presentation Layer (React Frontend)
2. Application Layer (Express Backend)
3. Data Layer (MongoDB Database)

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                         │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │           React Application (Port 5173)             │    │
│  │                                                      │    │
│  │  ├── Components (UI Elements)                      │    │
│  │  ├── Pages (Route Components)                      │    │
│  │  ├── Context (State Management)                    │    │
│  │  │   ├── AuthContext                               │    │
│  │  │   └── GoalContext                               │    │
│  │  └── Utils (API Client)                            │    │
│  │                                                      │    │
│  └────────────────────────────────────────────────────┘    │
│                            │                                 │
│                            │ HTTP/HTTPS                      │
│                            ▼                                 │
└─────────────────────────────────────────────────────────────┘
                             │
                             │
┌─────────────────────────────────────────────────────────────┐
│                 SERVER (Node.js/Express)                     │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │         Express Application (Port 5000)             │    │
│  │                                                      │    │
│  │  ├── Routes (API Endpoints)                        │    │
│  │  │   ├── /api/auth/google                          │    │
│  │  │   ├── /api/goals                                │    │
│  │  │   └── /api/courses                              │    │
│  │  │                                                  │    │
│  │  ├── Middleware                                     │    │
│  │  │   ├── CORS                                       │    │
│  │  │   ├── JWT Authentication                         │    │
│  │  │   └── Error Handling                             │    │
│  │  │                                                  │    │
│  │  └── Models (Data Schemas)                         │    │
│  │      ├── User                                       │    │
│  │      └── Goal                                       │    │
│  │                                                      │    │
│  └────────────────────────────────────────────────────┘    │
│                            │                                 │
│                            │ MongoDB Protocol                │
│                            ▼                                 │
└─────────────────────────────────────────────────────────────┘
                             │
                             │
┌─────────────────────────────────────────────────────────────┐
│                   DATABASE (MongoDB Atlas)                   │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              Collections                            │    │
│  │                                                      │    │
│  │  ├── users                                          │    │
│  │  │   └── { googleId, email, name, picture }        │    │
│  │  │                                                  │    │
│  │  └── goals                                          │    │
│  │      └── { userId, title, description, category,   │    │
│  │           status, targetDate, milestones[] }       │    │
│  │                                                      │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘

External Services:
┌──────────────────────┐
│  Google OAuth 2.0    │  ←──── Authentication
└──────────────────────┘
```

## Component Architecture

### Frontend Component Hierarchy

```
App
├── Router
│   ├── Navbar (persistent)
│   ├── Login (public route)
│   └── Protected Routes
│       ├── Dashboard
│       │   ├── StatsGrid
│       │   ├── Charts (Recharts)
│       │   └── RecentGoals
│       ├── Goals
│       │   ├── SearchBar
│       │   ├── FilterDropdown
│       │   └── GoalCard[]
│       ├── GoalDetail
│       │   ├── GoalInfo
│       │   ├── MilestoneList
│       │   └── ProgressCard
│       ├── CreateGoal
│       │   ├── MultiStepForm
│       │   └── MilestoneBuilder
│       └── Courses
│           └── CourseCard[]
```

### State Management Flow

```
User Action
    │
    ▼
Component Event Handler
    │
    ▼
Dispatch Action to Context
    │
    ▼
Reducer Processes Action
    │
    ▼
Update Context State
    │
    ▼
Components Re-render
    │
    ▼
API Call (if needed)
    │
    ▼
Backend Processing
    │
    ▼
Database Update
    │
    ▼
Response to Frontend
    │
    ▼
Update Context State Again
    │
    ▼
UI Reflects Changes
```

## Authentication Flow

```
1. User clicks "Sign in with Google"
        │
        ▼
2. Google OAuth popup opens
        │
        ▼
3. User authorizes application
        │
        ▼
4. Google returns credential token
        │
        ▼
5. Frontend sends token to backend
        │
        ▼
6. Backend verifies with Google
        │
        ▼
7. Backend checks/creates user in DB
        │
        ▼
8. Backend generates JWT token
        │
        ▼
9. Frontend stores JWT in localStorage
        │
        ▼
10. Frontend stores user in AuthContext
        │
        ▼
11. User redirected to Dashboard
        │
        ▼
12. All API requests include JWT in Authorization header
```

## Data Models

### User Model
```javascript
{
  googleId: String (unique, required),
  email: String (required),
  name: String (required),
  picture: String,
  createdAt: Date (auto)
}
```

### Goal Model
```javascript
{
  userId: ObjectId (ref: User, required),
  title: String (required),
  description: String (required),
  category: Enum (required),
  status: Enum (required),
  targetDate: Date (required),
  milestones: [
    {
      title: String (required),
      completed: Boolean (default: false)
    }
  ],
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## API Request/Response Flow

### Example: Creating a Goal

```
Frontend                          Backend                      Database
   │                                 │                            │
   │  POST /api/goals                │                            │
   │  Authorization: Bearer <JWT>    │                            │
   │  Body: { title, description,    │                            │
   │         category, ... }          │                            │
   ├────────────────────────────────>│                            │
   │                                  │                            │
   │                                  │  Verify JWT                │
   │                                  │  Extract userId            │
   │                                  │                            │
   │                                  │  Validate request body     │
   │                                  │                            │
   │                                  │  Create Goal document      │
   │                                  ├───────────────────────────>│
   │                                  │                            │
   │                                  │  Save to database          │
   │                                  │<───────────────────────────│
   │                                  │                            │
   │  Response: { goal object }       │                            │
   │<─────────────────────────────────│                            │
   │                                  │                            │
   │  Dispatch ADD_GOAL action        │                            │
   │  Update GoalContext              │                            │
   │  Navigate to /goals              │                            │
   │                                  │                            │
```

## Security Architecture

### Authentication & Authorization

1. Google OAuth 2.0 for initial authentication
2. JWT tokens for subsequent requests
3. Token stored in localStorage
4. Authorization header on all protected routes
5. Backend middleware validates JWT on protected endpoints
6. User ID extracted from JWT for data isolation

### Data Protection

1. CORS configured for specific origins
2. Input validation on all endpoints
3. MongoDB injection prevention through Mongoose
4. User data isolated by userId in queries
5. No sensitive data in JWT payload

## Performance Optimizations

### Frontend
- React Context with useReducer for efficient state updates
- Global flags prevent duplicate API calls
- Custom event system for cross-component communication
- CSS animations use GPU acceleration
- Lazy loading for route components (can be implemented)

### Backend
- MongoDB indexes on userId and _id fields
- Connection pooling with Mongoose
- Async/await for non-blocking operations
- Error handling prevents server crashes

### Database
- Indexed queries on userId
- Compound indexes on frequently queried fields
- Virtual fields for computed properties

## Error Handling Strategy

### Frontend
```
Try/Catch blocks in async operations
    │
    ▼
Console logging for debugging
    │
    ▼
User-friendly error messages
    │
    ▼
State recovery (reset flags on error)
```

### Backend
```
Express error middleware
    │
    ▼
Structured error responses
    │
    ▼
Console logging with context
    │
    ▼
Appropriate HTTP status codes
```

## Scalability Considerations

### Current Architecture
- Monolithic backend (suitable for small-medium scale)
- Single MongoDB cluster
- Stateless backend (horizontally scalable)

### Future Improvements
- Microservices architecture for specific features
- Redis caching layer
- Load balancer for multiple backend instances
- CDN for static frontend assets
- Database read replicas

## Technology Decisions

### Why React?
- Component-based architecture
- Rich ecosystem
- TypeScript support
- Excellent developer experience

### Why Express?
- Minimalist and flexible
- Large middleware ecosystem
- Node.js allows JavaScript across stack
- Good performance for I/O operations

### Why MongoDB?
- Flexible schema for evolving requirements
- Good performance for document-based data
- Easy integration with Node.js
- Atlas provides managed hosting

### Why Context API over Redux?
- Simpler for application scale
- Built into React
- Sufficient for current state complexity
- Easier to understand and maintain