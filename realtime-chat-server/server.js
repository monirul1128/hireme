const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// Serve a simple homepage for testing
app.get('/', (req, res) => {
  res.send('Real-time Chat Server is running!');
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Broadcast received messages to all clients
  socket.on('chat message', (data) => {
    if (typeof data.msg === 'string' && data.msg.trim() !== '') {
      io.emit('chat message', { username: data.username, msg: data.msg });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Socket.IO chat server running on port ${PORT}`);
}); 