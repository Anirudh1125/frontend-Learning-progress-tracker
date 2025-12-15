# Learning Progress Tracker

A full-stack web application for tracking learning goals and progress with milestone management, built with React, Express, and MongoDB.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Design Patterns](#design-patterns)
- [External Sources](#external-sources)
- [License](#license)

## Features

- User authentication with Google OAuth 2.0
- Create, read, update, and delete learning goals
- Milestone tracking for each goal
- Interactive dashboard with progress visualization using charts
- Real-time progress calculation
- Responsive design for mobile and desktop
- Persistent sessions across page refreshes
- Category-based goal organization
- Search and filter functionality

## Technology Stack

### Frontend
- React 18 with TypeScript
- React Router for navigation
- Context API with useReducer for state management
- Recharts for data visualization
- Lucide React for icons
- Axios for HTTP requests
- Google OAuth (@react-oauth/google)
- CSS3 with animations

### Backend
- Node.js with Express
- MongoDB with Mongoose ODM
- JWT for authentication
- Google OAuth verification
- CORS enabled
- Express Validator for input validation

### Development Tools
- Vite for build tooling
- ESLint for code quality
- TypeScript for type safety

## Architecture

The application follows a client-server architecture with clear separation of concerns:

### Frontend Architecture
```
src/
├── components/         # Reusable UI components
├── pages/             # Page-level components
├── context/           # React Context for state management
├── utils/             # Helper functions and API client
└── styles/            # CSS modules
```

### Backend Architecture
```
backend/
├── models/            # MongoDB schemas
├── routes/            # API endpoints
├── middleware/        # Authentication middleware
└── server.js          # Express application
```

### State Management
The application uses React Context API with useReducer for global state management:
- AuthContext: Manages user authentication state
- GoalContext: Manages goals and milestones

### Data Flow
1. User actions trigger events in React components
2. Actions dispatch to reducers via Context API
3. Reducers update global state
4. Components re-render with new state
5. API calls synchronize with backend
6. MongoDB persists data

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB instance)
- Google Cloud Platform account for OAuth

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd learning-progress-tracker
```

### 2. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 3. Install Backend Dependencies
```bash
cd ../backend
npm install
```

## Configuration

### Frontend Configuration

Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

### Backend Configuration

Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/learning_tracker
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
JWT_SECRET=your_random_secret_key_here
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### Google OAuth Setup

1. Go to Google Cloud Console
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized JavaScript origins:
   - http://localhost:5173
   - http://localhost:3000
6. Add authorized redirect URIs (same as origins)
7. Copy the Client ID to your .env files

### MongoDB Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string
6. Replace username, password, and database name in MONGODB_URI

## Running the Application

### Development Mode

Start the backend:
```bash
cd backend
npm start
```

Start the frontend (in a new terminal):
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## API Documentation

### Authentication Endpoints

#### POST /api/auth/google
Authenticate with Google OAuth token

Request:
```json
{
  "credential": "google_oauth_token"
}
```

Response:
```json
{
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "picture": "profile_picture_url"
  }
}
```

### Goals Endpoints

#### GET /api/goals
Get all goals for authenticated user

Headers:
```
Authorization: Bearer <jwt_token>
```

Response:
```json
[
  {
    "_id": "goal_id",
    "title": "Learn React",
    "description": "Master React fundamentals",
    "category": "Programming",
    "status": "in-progress",
    "targetDate": "2025-12-31",
    "milestones": [
      {
        "_id": "milestone_id",
        "title": "Complete tutorial",
        "completed": true
      }
    ],
    "userId": "user_id",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
]
```

#### POST /api/goals
Create a new goal

Request:
```json
{
  "title": "Learn TypeScript",
  "description": "Learn TypeScript basics",
  "category": "Programming",
  "targetDate": "2025-12-31",
  "milestones": [
    {
      "title": "Read documentation",
      "completed": false
    }
  ]
}
```

#### GET /api/goals/:id
Get a specific goal

#### PUT /api/goals/:id
Update a goal

#### DELETE /api/goals/:id
Delete a goal

#### PUT /api/goals/:id/milestones/:milestoneId/toggle
Toggle milestone completion status

## Testing

### Run Playwright Tests
```bash
cd frontend
npx playwright test
```

### Run Tests in UI Mode
```bash
npx playwright test --ui
```

## Deployment

### Frontend Deployment (Google Cloud Storage)

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Deploy to Google Cloud Storage:
```bash
gsutil -m rsync -r dist/ gs://your-bucket-name/
```

### Backend Deployment (Google Cloud Run)

1. Create a Dockerfile in backend directory
2. Build and deploy:
```bash
gcloud run deploy learning-tracker-api \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

## Project Structure

```
learning-progress-tracker/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.tsx
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Goals.tsx
│   │   │   ├── GoalDetail.tsx
│   │   │   ├── CreateGoal.tsx
│   │   │   ├── Courses.tsx
│   │   │   └── Login.tsx
│   │   ├── context/
│   │   │   ├── AuthContext.tsx
│   │   │   └── GoalContext.tsx
│   │   ├── utils/
│   │   │   └── api.ts
│   │   ├── styles/
│   │   │   ├── index.css
│   │   │   ├── App.css
│   │   │   ├── Dashboard.css
│   │   │   ├── Goals.css
│   │   │   └── animations.css
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Goal.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── goals.js
│   │   └── courses.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
└── README.md
```

## Design Patterns

### 1. Context Provider Pattern
Used for global state management with AuthContext and GoalContext. Provides centralized state accessible throughout the component tree.

### 2. Reducer Pattern
Implements predictable state updates through action dispatching. Used in conjunction with React's useReducer hook.

### 3. Higher-Order Component (HOC) Pattern
ProtectedRoute component wraps routes requiring authentication, implementing the decorator pattern.

### 4. Custom Hooks Pattern
Although not extensively used, the pattern is available for extracting reusable logic.

### 5. Singleton Pattern
API client (axios instance) is created once and reused throughout the application.

## External Sources

### Frontend Libraries
- React: https://react.dev/
- React Router: https://reactrouter.com/
- Recharts: https://recharts.org/
- Lucide React: https://lucide.dev/
- Axios: https://axios-http.com/
- @react-oauth/google: https://www.npmjs.com/package/@react-oauth/google

### Backend Libraries
- Express: https://expressjs.com/
- Mongoose: https://mongoosejs.com/
- jsonwebtoken: https://www.npmjs.com/package/jsonwebtoken
- google-auth-library: https://www.npmjs.com/package/google-auth-library
- express-validator: https://express-validator.github.io/

### Documentation References
- MongoDB Atlas: https://www.mongodb.com/docs/atlas/
- Google OAuth 2.0: https://developers.google.com/identity/protocols/oauth2
- JWT Authentication: https://jwt.io/introduction

### Learning Resources
- React TypeScript: https://react-typescript-cheatsheet.netlify.app/
- Express Best Practices: https://expressjs.com/en/advanced/best-practice-security.html

## CSS Animations

The application features meaningful CSS animations including:
- Fade-in animations for page transitions
- Staggered animations for list items
- Hover effects with elevation
- Progress bar animations
- Loading state animations
- Success/error feedback animations

All animations are defined in `animations.css` and enhance user experience without being distracting.

## Known Issues and Limitations

- Goals list requires page refresh after deletion to show updated list (trade-off to prevent infinite render loops)
- Google OAuth requires specific domain configuration
- Development mode uses hot module replacement which may cause occasional state inconsistencies

## Future Enhancements

- Add course recommendations based on goals
- Implement goal sharing and collaboration
- Add notifications for approaching deadlines
- Export progress reports
- Mobile application version
- Dark mode support
