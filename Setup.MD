# Setup Guide

Step-by-step instructions for setting up the Learning Progress Tracker application.

## Quick Start

### 1. System Requirements

- Node.js v18 or higher
- npm v9 or higher
- Git
- Modern web browser (Chrome, Firefox, Safari, Edge)

### 2. Clone and Install

```bash
# Clone repository
git clone <repository-url>
cd learning-progress-tracker

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 3. Environment Setup

#### Frontend .env
Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=<your-google-client-id>
```

#### Backend .env
Create `backend/.env`:
```env
MONGODB_URI=<your-mongodb-connection-string>
GOOGLE_CLIENT_ID=<your-google-client-id>
JWT_SECRET=<generate-random-string>
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### 4. Google OAuth Configuration

1. Visit https://console.cloud.google.com
2. Create new project or select existing
3. Navigate to "APIs & Services" > "Credentials"
4. Create OAuth 2.0 Client ID
5. Application type: Web application
6. Authorized JavaScript origins:
   - http://localhost:5173
   - http://localhost:5000
7. Authorized redirect URIs: (same as above)
8. Copy Client ID to both .env files

### 5. MongoDB Atlas Configuration

1. Visit https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create new cluster (free tier)
4. Database Access: Create database user
5. Network Access: Add IP (0.0.0.0/0 for development)
6. Connect: Get connection string
7. Replace <password> and <dbname> in connection string
8. Add to backend/.env as MONGODB_URI

### 6. Start Development Servers

Terminal 1 - Backend:
```bash
cd backend
npm start
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

### 7. Access Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Troubleshooting

### Port Already in Use

If port 5173 or 5000 is in use:

```bash
# Find process using port (macOS/Linux)
lsof -i :5173
lsof -i :5000

# Kill process
kill -9 <PID>

# Or change port in vite.config.ts or backend .env
```

### MongoDB Connection Failed

- Verify connection string format
- Check database user credentials
- Ensure IP address is whitelisted
- Confirm network connectivity

### Google OAuth Errors

- Verify Client ID matches in both .env files
- Check authorized origins in Google Console
- Ensure redirect URIs are configured
- Clear browser cache and cookies

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors

- Verify FRONTEND_URL in backend .env
- Check that backend is running
- Ensure ports match configuration

## Development Workflow

### Making Changes

1. Create feature branch
```bash
git checkout -b feature/your-feature-name
```

2. Make changes to code

3. Test changes locally

4. Commit changes
```bash
git add .
git commit -m "Description of changes"
```

5. Push to repository
```bash
git push origin feature/your-feature-name
```

### Database Operations

View MongoDB data:
1. MongoDB Atlas Dashboard > Browse Collections
2. Or use MongoDB Compass with connection string

Reset database:
```javascript
// In MongoDB Atlas or Compass
db.goals.deleteMany({})
db.users.deleteMany({})
```

### Clearing Application State

Clear localStorage in browser:
```javascript
// In browser console
localStorage.clear()
```

## Production Deployment Checklist

- [ ] Update VITE_API_URL to production backend URL
- [ ] Update FRONTEND_URL to production frontend URL
- [ ] Generate secure JWT_SECRET
- [ ] Restrict MongoDB IP whitelist
- [ ] Update Google OAuth authorized origins
- [ ] Enable environment-specific logging
- [ ] Set up error monitoring
- [ ] Configure HTTPS
- [ ] Test all features in production environment