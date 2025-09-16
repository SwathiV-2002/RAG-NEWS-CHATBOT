# 🚀 RAG Chatbot Deployment with Redis

## Complete Production Deployment Guide

### Prerequisites
- GitHub account
- Render.com account
- Gemini API key
- Jina API key

### Step 1: Deploy Redis Service

1. **Go to [render.com](https://render.com)**
2. **Click "New" → "Redis"**
3. **Configure:**
   - **Name**: `rag-chatbot-redis`
   - **Plan**: Free tier (if available) or paid
   - **Region**: Same as your backend
4. **Click "Create Redis"**
5. **Copy the Redis URL** (e.g., `redis://red-xxxxx:6379`)

### Step 2: Deploy Backend with Redis

1. **Go to [render.com](https://render.com)**
2. **Click "New" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure:**
   - **Name**: `rag-chatbot-backend`
   - **Environment**: `Node`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Port**: `5000`

5. **Add Environment Variables:**
   ```
   NODE_ENV=production
   GEMINI_API_KEY=your_gemini_key_here
   JINA_API_KEY=your_jina_key_here
   REDIS_URL=redis://your-redis-url-here
   QDRANT_URL=http://qdrant:6333
   ```

6. **Click "Create Web Service"**

### Step 3: Deploy Frontend

1. **Click "New" → "Static Site"**
2. **Connect your GitHub repository**
3. **Configure:**
   - **Name**: `rag-chatbot-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

4. **Add Environment Variables:**
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   REACT_APP_SOCKET_URL=https://your-backend-url.onrender.com
   ```

5. **Click "Create Static Site"**

### Step 4: Test Your Deployment

1. **Wait for all services to deploy** (5-10 minutes)
2. **Visit your frontend URL**
3. **Test the chat functionality**
4. **Check that sessions persist** (refresh page, messages should remain)

### Alternative: Railway + Vercel (More Reliable)

#### Backend + Redis on Railway
1. **Go to [railway.app](https://railway.app)**
2. **Connect GitHub**
3. **Deploy from repository**
4. **Add Redis service** (Railway provides Redis)
5. **Add environment variables:**
   ```
   NODE_ENV=production
   GEMINI_API_KEY=your_gemini_key
   JINA_API_KEY=your_jina_key
   REDIS_URL=redis://your-railway-redis-url
   ```

#### Frontend on Vercel
1. **Go to [vercel.com](https://vercel.com)**
2. **Connect GitHub**
3. **Deploy from repository**
4. **Update environment variables** with Railway backend URL

### Environment Variables Checklist

#### Backend (.env or Render Environment Variables):
- [ ] NODE_ENV=production
- [ ] GEMINI_API_KEY
- [ ] JINA_API_KEY
- [ ] REDIS_URL
- [ ] QDRANT_URL (optional, will use fallback)

#### Frontend (.env or Vercel Environment Variables):
- [ ] REACT_APP_API_URL
- [ ] REACT_APP_SOCKET_URL

### Production URLs

After deployment, you'll get:
- **Frontend**: `https://rag-chatbot-frontend.onrender.com`
- **Backend**: `https://rag-chatbot-backend.onrender.com`
- **Redis**: `redis://red-xxxxx:6379` (internal)

### Troubleshooting

#### Common Issues:
1. **Redis connection errors**: Check REDIS_URL is correct
2. **CORS errors**: Ensure frontend URL matches backend CORS settings
3. **WebSocket errors**: Check both HTTP and WebSocket are working
4. **Session not persisting**: Verify Redis is connected and working

#### Check Logs:
- **Backend logs**: Should show "Redis client connected"
- **Frontend logs**: Check browser console for errors
- **Redis logs**: Check Redis service status

### Assignment Requirements Met:

✅ **Redis for in-memory chat history (per session)**
✅ **Production deployment**
✅ **Session management**
✅ **Real-time chat with Socket.io**
✅ **RAG pipeline with vector search**
✅ **AI responses with Gemini**

### Cost Estimation:
- **Render.com**: Free tier available
- **Railway**: $5/month for Redis + Backend
- **Vercel**: Free for frontend
- **Total**: $0-5/month

### Next Steps:
1. Deploy Redis service
2. Update backend with Redis URL
3. Deploy frontend
4. Test complete functionality
5. Share the public URL for testing!
