# Environment Configuration Guide

This guide explains how to properly configure environment variables for development and production deployments.

## 📁 Environment Files

### Backend Environment Variables
- **Development**: Copy `backend/env.example` to `backend/.env`
- **Production**: Set environment variables in your deployment platform (Render.com, Railway, etc.)

### Frontend Environment Variables
- **Development**: Copy `frontend/env.example` to `frontend/.env`
- **Production**: Set environment variables in your deployment platform

## 🔧 Backend Environment Variables

| Variable | Development | Production | Description |
|----------|-------------|------------|-------------|
| `NODE_ENV` | `development` | `production` | Environment mode |
| `PORT` | `5000` | `5000` | Server port |
| `FRONTEND_URL` | `http://localhost:3000` | `https://your-frontend-domain.com` | Frontend URL for CORS |
| `GEMINI_API_KEY` | `your_key_here` | `your_production_key` | Google Gemini API key |
| `JINA_API_KEY` | `your_key_here` | `your_production_key` | Jina AI API key |
| `REDIS_URL` | `redis://localhost:6379` | `redis://your-redis-url:6379` | Redis connection URL |
| `QDRANT_URL` | `http://localhost:6333` | `https://your-qdrant-url.com` | Qdrant vector database URL |
| `QDRANT_API_KEY` | `your_key_here` | `your_production_key` | Qdrant API key (optional) |

## 🎨 Frontend Environment Variables

| Variable | Development | Production | Description |
|----------|-------------|------------|-------------|
| `REACT_APP_ENV` | `development` | `production` | Environment mode |
| `REACT_APP_API_URL` | `http://localhost:5000/api` | `https://your-backend-domain.com/api` | Backend API URL |
| `REACT_APP_SOCKET_URL` | `http://localhost:5000` | `https://your-backend-domain.com` | WebSocket URL |

## 🚀 Quick Setup

### Development
```bash
# Backend
cd backend
cp env.example .env
# Edit .env with your API keys

# Frontend
cd frontend
cp env.example .env
# Edit .env if needed (defaults work for local development)
```

### Production (Render.com)
1. **Backend Service**:
   - Add all backend environment variables in Render dashboard
   - Set `NODE_ENV=production`
   - Set `FRONTEND_URL=https://your-frontend-url.onrender.com`

2. **Frontend Service**:
   - Add all frontend environment variables in Render dashboard
   - Set `REACT_APP_ENV=production`
   - Set `REACT_APP_API_URL=https://your-backend-url.onrender.com/api`
   - Set `REACT_APP_SOCKET_URL=https://your-backend-url.onrender.com`

## ⚠️ Important Notes

1. **Never commit `.env` files** - they're in `.gitignore`
2. **Use different API keys** for development and production
3. **HTTPS URLs required** for production deployments
4. **CORS configuration** must match your frontend URL exactly
5. **WebSocket URLs** must use the same protocol (http/https) as the API

## 🔍 Troubleshooting

### Common Issues:
- **CORS errors**: Check that `FRONTEND_URL` matches your actual frontend domain
- **WebSocket connection failed**: Ensure `REACT_APP_SOCKET_URL` uses correct protocol
- **API not found**: Verify `REACT_APP_API_URL` includes `/api` suffix
- **Vector search not working**: Check `QDRANT_URL` and `QDRANT_API_KEY`

### Validation:
The application will show warnings in the console if required environment variables are missing.
