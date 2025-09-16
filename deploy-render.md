# 🚀 RAG Chatbot Deployment Guide

## Quick Deploy to Render.com (FREE)

### Prerequisites
- GitHub account
- Render.com account
- Gemini API key
- Jina API key

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/rag-news-chatbot.git
git push -u origin main
```

### Step 2: Deploy Backend on Render

1. Go to [render.com](https://render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `rag-chatbot-backend`
   - **Environment**: `Node`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Port**: `5000`

5. Add Environment Variables:
   ```
   NODE_ENV=production
   GEMINI_API_KEY=your_gemini_key_here
   JINA_API_KEY=your_jina_key_here
   REDIS_URL=redis://redis:6379
   QDRANT_URL=http://qdrant:6333
   ```

6. Click "Create Web Service"

### Step 3: Deploy Frontend on Render

1. Click "New" → "Static Site"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `rag-chatbot-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

4. Add Environment Variables:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   REACT_APP_SOCKET_URL=https://your-backend-url.onrender.com
   ```

5. Click "Create Static Site"

### Step 4: Test Your Deployment

1. Wait for both services to deploy (5-10 minutes)
2. Visit your frontend URL
3. Test the chat functionality

### Alternative: Railway + Vercel

#### Backend on Railway
1. Go to [railway.app](https://railway.app)
2. Connect GitHub
3. Deploy from repository
4. Add environment variables
5. Get your backend URL

#### Frontend on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Connect GitHub
3. Deploy from repository
4. Update environment variables with Railway backend URL

## Local Testing

To test locally:
```bash
# Start all services
docker-compose up -d

# Check status
docker ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Troubleshooting

### Common Issues:
1. **Port conflicts**: Stop other services using ports 3000, 5000, 6333, 6379
2. **API key errors**: Ensure environment variables are set correctly
3. **CORS errors**: Check frontend URL matches backend CORS settings
4. **WebSocket errors**: Ensure both HTTP and WebSocket are working

### Environment Variables Checklist:
- [ ] GEMINI_API_KEY
- [ ] JINA_API_KEY
- [ ] REACT_APP_API_URL
- [ ] REACT_APP_SOCKET_URL
- [ ] NODE_ENV=production

## Production URLs

After deployment, you'll get:
- **Frontend**: `https://rag-chatbot-frontend.onrender.com`
- **Backend**: `https://rag-chatbot-backend.onrender.com`

Share the frontend URL with anyone to test your chatbot!
