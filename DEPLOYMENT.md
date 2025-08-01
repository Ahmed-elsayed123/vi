# Deployment Guide

## Vercel Deployment (Frontend Only)

Due to Socket.IO limitations with serverless functions, we'll deploy the frontend to Vercel and the backend separately.

### Frontend Deployment (Vercel)

1. **Deploy to Vercel:**

   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Deploy from the client directory
   cd client
   vercel
   ```

2. **Update Backend URL:**
   After deployment, update the backend URL in `client/src/components/VideoCall.js`:
   ```javascript
   const newSocket = io("https://your-backend-url.com");
   ```

### Backend Deployment Options

#### Option 1: Railway (Recommended)

1. Go to [Railway.app](https://railway.app)
2. Connect your GitHub repository
3. Deploy the `server` directory
4. Get the deployment URL and update the frontend

#### Option 2: Heroku

1. Create a `Procfile` in the server directory:
   ```
   web: node server.js
   ```
2. Deploy to Heroku:
   ```bash
   cd server
   heroku create your-app-name
   git push heroku main
   ```

#### Option 3: DigitalOcean App Platform

1. Go to DigitalOcean App Platform
2. Connect your repository
3. Set the source directory to `server`
4. Deploy and get the URL

### Environment Variables

Set these environment variables in your backend deployment:

```env
NODE_ENV=production
PORT=5000
```

### CORS Configuration

Update the CORS origin in `server/server.js` with your frontend URL:

```javascript
const io = socketIo(server, {
  cors: {
    origin: ["https://your-frontend-url.vercel.app"],
    methods: ["GET", "POST"],
  },
});
```

## Alternative: Full-Stack Deployment

For a simpler full-stack deployment, consider:

### Render.com

1. Create a new Web Service
2. Connect your repository
3. Set build command: `npm run install-all && npm run build`
4. Set start command: `npm run dev`

### Netlify + Backend

1. Deploy frontend to Netlify
2. Deploy backend to Railway/Heroku
3. Update frontend with backend URL

## Troubleshooting

### Common Issues:

1. **CORS Errors:**

   - Ensure backend CORS origin includes your frontend URL
   - Check for trailing slashes in URLs

2. **Socket.IO Connection Failed:**

   - Verify backend URL is correct
   - Check if backend is running
   - Ensure WebSocket connections are allowed

3. **Build Errors:**
   - Clear node_modules and reinstall
   - Check for missing dependencies
   - Verify Node.js version compatibility

### Testing Deployment:

1. **Health Check:**

   ```
   GET https://your-backend-url.com/health
   ```

2. **Test Video Call:**
   - Open your deployed frontend
   - Create a room
   - Test with another browser/tab
   - Check browser console for errors
