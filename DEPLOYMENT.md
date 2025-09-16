# Deployment Guide

This guide covers various deployment options for the RAG News Chatbot.

## 🚀 Quick Start with Docker Compose

The easiest way to deploy the entire application is using Docker Compose.

### Prerequisites

- Docker and Docker Compose installed
- API keys for Gemini and Jina AI

### Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd rag-news-chatbot
```

2. **Set up environment variables**
```bash
# Create .env file in the root directory
cat > .env << EOF
GEMINI_API_KEY=your_gemini_api_key_here
JINA_API_KEY=your_jina_api_key_here
EOF
```

3. **Start all services**
```bash
docker-compose up -d
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Qdrant UI: http://localhost:6333/dashboard

## 🌐 Cloud Deployment

### Option 1: Railway (Recommended)

Railway provides easy deployment with built-in Redis and PostgreSQL.

#### Backend Deployment

1. **Connect GitHub repository to Railway**
2. **Set environment variables:**
   - `GEMINI_API_KEY`
   - `JINA_API_KEY`
   - `REDIS_URL` (Railway provides this)
   - `QDRANT_URL` (use Qdrant Cloud)

3. **Deploy backend**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

#### Frontend Deployment

1. **Build and deploy to Railway**
```bash
cd frontend
npm run build
railway up
```

### Option 2: Render

#### Backend Deployment

1. **Create new Web Service on Render**
2. **Connect GitHub repository**
3. **Configure build settings:**
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
4. **Set environment variables**

#### Frontend Deployment

1. **Create new Static Site on Render**
2. **Configure build settings:**
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/build`

### Option 3: Vercel + Railway

#### Backend on Railway
- Deploy backend to Railway as described above

#### Frontend on Vercel
```bash
cd frontend
npm install -g vercel
vercel --prod
```

## 🐳 Docker Deployment

### Manual Docker Deployment

#### 1. Build Images

```bash
# Build backend
cd backend
docker build -t rag-chatbot-backend .

# Build frontend
cd ../frontend
docker build -t rag-chatbot-frontend .
```

#### 2. Run Containers

```bash
# Start Redis
docker run -d --name redis -p 6379:6379 redis:7-alpine

# Start Qdrant
docker run -d --name qdrant -p 6333:6333 qdrant/qdrant:latest

# Start backend
docker run -d --name backend \
  -p 5000:5000 \
  -e REDIS_URL=redis://host.docker.internal:6379 \
  -e QDRANT_URL=http://host.docker.internal:6333 \
  -e GEMINI_API_KEY=your_key \
  -e JINA_API_KEY=your_key \
  rag-chatbot-backend

# Start frontend
docker run -d --name frontend \
  -p 3000:80 \
  -e REACT_APP_API_URL=http://localhost:5000/api \
  -e REACT_APP_SOCKET_URL=http://localhost:5000 \
  rag-chatbot-frontend
```

## ☁️ Cloud Services Setup

### Redis Cloud

1. **Sign up at Redis Cloud**
2. **Create a new database**
3. **Get connection details**
4. **Update environment variables**

### Qdrant Cloud

1. **Sign up at Qdrant Cloud**
2. **Create a new cluster**
3. **Get API key and URL**
4. **Update environment variables**

### Google Gemini API

1. **Go to Google AI Studio**
2. **Create API key**
3. **Add to environment variables**

### Jina AI API

1. **Sign up at Jina AI**
2. **Get API key**
3. **Add to environment variables**

## 🔧 Environment Configuration

### Backend Environment Variables

```env
# Server Configuration
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.com

# API Keys
GEMINI_API_KEY=your_gemini_api_key
JINA_API_KEY=your_jina_api_key

# Database Configuration
REDIS_URL=redis://your-redis-url:6379
QDRANT_URL=https://your-qdrant-cluster.qdrant.tech
QDRANT_API_KEY=your_qdrant_api_key
```

### Frontend Environment Variables

```env
REACT_APP_API_URL=https://your-backend-url.com/api
REACT_APP_SOCKET_URL=https://your-backend-url.com
REACT_APP_ENV=production
```

## 📊 Monitoring and Logs

### Health Checks

- Backend: `GET /api/health`
- Frontend: `GET /health`

### Logging

#### Backend Logs
```bash
# Docker
docker logs rag-chatbot-backend

# Railway
railway logs

# Render
# Check in Render dashboard
```

#### Frontend Logs
```bash
# Docker
docker logs rag-chatbot-frontend

# Vercel
vercel logs
```

## 🔒 Security Considerations

### Production Security

1. **Use HTTPS everywhere**
2. **Set secure CORS origins**
3. **Implement rate limiting**
4. **Use environment variables for secrets**
5. **Enable Redis AUTH**
6. **Use Qdrant API keys**

### Environment Variables Security

```bash
# Never commit .env files
echo ".env" >> .gitignore
echo "*.env" >> .gitignore
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Backend Won't Start
- Check Redis connection
- Verify Qdrant connection
- Check API keys
- Review logs

#### 2. Frontend Can't Connect to Backend
- Check CORS settings
- Verify API URLs
- Check network connectivity

#### 3. Vector Search Not Working
- Verify Qdrant connection
- Check Jina API key
- Ensure articles are indexed

#### 4. Session Management Issues
- Check Redis connection
- Verify session TTL settings
- Check Redis memory usage

### Debug Commands

```bash
# Check backend health
curl http://localhost:5000/api/health

# Check Redis connection
redis-cli ping

# Check Qdrant health
curl http://localhost:6333/health

# View backend logs
docker logs rag-chatbot-backend -f

# View frontend logs
docker logs rag-chatbot-frontend -f
```

## 📈 Performance Optimization

### Backend Optimization

1. **Enable Redis persistence**
2. **Configure Qdrant for production**
3. **Set appropriate TTLs**
4. **Use connection pooling**

### Frontend Optimization

1. **Enable gzip compression**
2. **Use CDN for static assets**
3. **Implement caching headers**
4. **Optimize bundle size**

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy Backend
        run: |
          # Deploy backend to Railway
          railway up --service backend
          
      - name: Deploy Frontend
        run: |
          # Deploy frontend to Vercel
          vercel --prod
```

## 📋 Pre-deployment Checklist

- [ ] All environment variables configured
- [ ] API keys are valid and have sufficient quota
- [ ] Redis is accessible and configured
- [ ] Qdrant is accessible and configured
- [ ] CORS settings are correct
- [ ] HTTPS is enabled
- [ ] Health checks are working
- [ ] Monitoring is set up
- [ ] Backup strategy is in place

## 🆘 Support

For deployment issues:

1. Check the logs first
2. Verify all services are running
3. Check environment variables
4. Review the troubleshooting section
5. Open an issue in the repository

---

**Note**: Always test your deployment in a staging environment before going to production.
