# RAG News Chatbot - Frontend

A React TypeScript frontend for the RAG-powered news chatbot with real-time chat capabilities, session management, and modern UI design.

## Features

- **Real-time Chat**: Socket.io integration for instant messaging
- **Session Management**: Persistent chat history with session clearing
- **Modern UI**: Responsive design with SCSS styling and dark mode support
- **Typing Indicators**: Visual feedback during bot responses
- **Relevant Articles**: Display of source articles used for responses
- **Mobile Responsive**: Optimized for all screen sizes

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Styling**: SCSS with CSS modules
- **State Management**: React Context API
- **Real-time**: Socket.io Client
- **HTTP Client**: Axios
- **Build Tool**: Create React App

## Prerequisites

- Node.js (v16 or higher)
- Backend server running on port 5000

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp env.example .env
```

3. Configure your `.env` file with the backend URL.

4. Start the development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | http://localhost:5000/api |
| `REACT_APP_SOCKET_URL` | Socket.io server URL | http://localhost:5000 |
| `REACT_APP_ENV` | Environment | development |

## Project Structure

```
src/
├── components/
│   ├── ChatInterface.tsx    # Main chat component
│   ├── ChatMessages.tsx     # Message display component
│   ├── ChatInput.tsx        # Input form component
│   ├── TypingIndicator.tsx  # Typing animation
│   └── Header.tsx           # App header
├── contexts/
│   └── SessionContext.tsx   # Session state management
├── App.tsx                  # Main app component
├── App.scss                 # Global styles
└── index.tsx               # App entry point
```

## Components

### ChatInterface
Main chat container that manages:
- Socket.io connection
- Message sending/receiving
- Session management
- Relevant articles display

### SessionContext
React context for managing:
- Session ID persistence
- Chat history
- Loading states
- Error handling

### ChatInput
Input component with:
- Auto-resizing textarea
- Enter key submission
- Send button with loading states

### ChatMessages
Message display with:
- User/bot message styling
- Timestamp formatting
- Typing indicators
- Welcome message

## Features

### Real-time Communication
- Uses Socket.io for instant messaging
- Falls back to REST API if socket connection fails
- Automatic reconnection handling

### Session Management
- Automatic session creation on app load
- Session persistence in localStorage
- Clear session functionality
- Chat history loading

### Responsive Design
- Mobile-first approach
- Adaptive layout for different screen sizes
- Touch-friendly interface
- Dark mode support

### User Experience
- Typing indicators during bot responses
- Smooth scrolling to new messages
- Loading states and error handling
- Relevant articles display

## Styling

The app uses SCSS with:
- CSS custom properties for theming
- Responsive breakpoints
- Dark mode support
- Smooth animations and transitions
- Modern gradient backgrounds

### Key Style Features
- Glassmorphism design
- Smooth animations
- Hover effects
- Responsive typography
- Accessible color contrast

## Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Adding New Features

1. **New Components**: Add to `src/components/`
2. **State Management**: Use SessionContext or create new contexts
3. **Styling**: Add SCSS files and import in components
4. **API Integration**: Add new methods to context or create service files

### Code Style

- Use TypeScript for type safety
- Follow React hooks patterns
- Use functional components
- Implement proper error boundaries
- Use semantic HTML

## Deployment

### Build for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

### Environment Configuration

For production, update environment variables:

```bash
REACT_APP_API_URL=https://your-backend-url.com/api
REACT_APP_SOCKET_URL=https://your-backend-url.com
```

### Hosting Options

- **Netlify**: Drag and drop the build folder
- **Vercel**: Connect your GitHub repository
- **GitHub Pages**: Use `gh-pages` package
- **AWS S3**: Upload build files to S3 bucket

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Performance Optimization

- Code splitting with React.lazy()
- Memoization with React.memo()
- Optimized bundle size
- Lazy loading of components
- Efficient re-renders

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Troubleshooting

### Common Issues

1. **Socket Connection Failed**: Check backend server and CORS settings
2. **API Errors**: Verify backend URL and API endpoints
3. **Build Errors**: Check TypeScript types and dependencies
4. **Styling Issues**: Verify SCSS compilation

### Debug Mode

Enable debug logging by setting:
```javascript
localStorage.setItem('debug', 'true');
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

ISC
