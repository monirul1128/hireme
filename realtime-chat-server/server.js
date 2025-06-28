const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Environment variables
const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:3000', 'http://localhost:5000', 'http://127.0.0.1:3000'];

// Configure Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Configure Express CORS
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    uptime: process.uptime()
  });
});

// Serve a simple homepage for testing
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Chat Server</title></head>
      <body>
        <h1>Real-time Chat Server is running!</h1>
        <p>Environment: ${NODE_ENV}</p>
        <p>Port: ${PORT}</p>
        <p>Uptime: ${Math.floor(process.uptime())} seconds</p>
        <p><a href="/health">Health Check</a></p>
      </body>
    </html>
  `);
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id} (${new Date().toISOString()})`);

  // Send welcome message
  socket.emit('chat message', { 
    username: 'System', 
    msg: 'Welcome to the chat! Type a message to start chatting.' 
  });

  // Broadcast user joined message
  socket.broadcast.emit('chat message', { 
    username: 'System', 
    msg: 'A new user has joined the chat.' 
  });

  // Handle chat messages
  socket.on('chat message', (data) => {
    try {
      // Validate message data
      if (typeof data === 'object' && data !== null) {
        const username = (typeof data.username === 'string' && data.username.trim() !== '') 
          ? data.username.trim() 
          : 'Anonymous';
        const msg = (typeof data.msg === 'string' && data.msg.trim() !== '') 
          ? data.msg.trim() 
          : '';

        if (msg.length > 0 && msg.length <= 500) { // Limit message length
          // Sanitize message (basic XSS prevention)
          const sanitizedMsg = msg.replace(/[<>]/g, '');
          
          console.log(`Message from ${username}: ${sanitizedMsg}`);
          
          // Broadcast to all clients
          io.emit('chat message', { 
            username: username, 
            msg: sanitizedMsg,
            timestamp: new Date().toISOString()
          });
        }
      }
    } catch (error) {
      console.error('Error processing chat message:', error);
    }
  });

  // Handle typing indicator
  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', {
      username: data.username || 'Someone',
      isTyping: data.isTyping
    });
  });

  // Handle disconnect
  socket.on('disconnect', (reason) => {
    console.log(`User disconnected: ${socket.id} (${reason})`);
    socket.broadcast.emit('chat message', { 
      username: 'System', 
      msg: 'A user has left the chat.' 
    });
  });

  // Handle errors
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Error handling for the server
server.on('error', (error) => {
  console.error('Server error:', error);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Start the server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Socket.IO chat server running on port ${PORT}`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📡 Allowed origins: ${allowedOrigins.join(', ')}`);
}); 