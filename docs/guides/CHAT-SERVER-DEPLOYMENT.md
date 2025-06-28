# Live Chat Server Deployment Guide

## Overview
This guide will help you deploy the real-time chat server to your cloud server so the live chat functionality works properly.

## Prerequisites
- Node.js installed on your server
- Access to your cloud server (SSH or control panel)
- Domain name pointing to your server

## Step 1: Upload Chat Server Files

1. **Upload the chat server folder** to your cloud server:
   ```bash
   # Upload the realtime-chat-server folder to your server
   scp -r realtime-chat-server/ user@your-server:/path/to/your/project/
   ```

2. **Or use your hosting control panel** to upload the `realtime-chat-server` folder

## Step 2: Install Dependencies

SSH into your server and navigate to the chat server directory:

```bash
cd /path/to/your/project/realtime-chat-server
npm install
```

## Step 3: Configure the Server

### Option A: Using Environment Variables (Recommended)

Create a `.env` file in the chat server directory:

```bash
# Create .env file
touch .env
```

Add the following configuration:

```env
# Server Configuration
PORT=4000
NODE_ENV=production

# CORS Configuration (update with your domain)
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Optional: Database configuration if you want to persist messages
# DATABASE_URL=your_database_url
```

### Option B: Update server.js directly

If you prefer to modify the server file directly, update `realtime-chat-server/server.js`:

```javascript
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Configure CORS for production
const io = new Server(server, {
  cors: {
    origin: [
      'https://topdigitalservice.shop',
      'https://topdigitalservice.shop',
      'http://localhost:3000' // for local development
    ],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.use(cors({
  origin: [
    'https://topdigitalservice.shop',
    'https://topdigitalservice.shop',
    'http://localhost:3000'
  ],
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

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
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Socket.IO chat server running on port ${PORT}`);
});
```

## Step 4: Start the Chat Server

### Option A: Direct Start (for testing)
```bash
cd /path/to/your/project/realtime-chat-server
node server.js
```

### Option B: Using PM2 (Recommended for production)

Install PM2 globally:
```bash
npm install -g pm2
```

Start the chat server with PM2:
```bash
cd /path/to/your/project/realtime-chat-server
pm2 start server.js --name "chat-server"
pm2 save
pm2 startup
```

### Option C: Using Systemd (Alternative)

Create a systemd service file:
```bash
sudo nano /etc/systemd/system/chat-server.service
```

Add the following content:
```ini
[Unit]
Description=Chat Server
After=network.target

[Service]
Type=simple
User=your-username
WorkingDirectory=/path/to/your/project/realtime-chat-server
ExecStart=/usr/bin/node server.js
Restart=on-failure
Environment=NODE_ENV=production
Environment=PORT=4000

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
sudo systemctl enable chat-server
sudo systemctl start chat-server
sudo systemctl status chat-server
```

## Step 5: Configure Firewall

Make sure port 4000 is open on your server:

```bash
# For UFW (Ubuntu)
sudo ufw allow 4000

# For iptables
sudo iptables -A INPUT -p tcp --dport 4000 -j ACCEPT

# For cloud providers, configure security groups/firewall rules
```

## Step 6: Configure Reverse Proxy (Optional but Recommended)

### Using Nginx

Add this to your Nginx configuration:

```nginx
# Add to your existing nginx config
upstream chat_server {
    server 127.0.0.1:4000;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Your existing website configuration...
    
    # Chat server proxy
    location /socket.io/ {
        proxy_pass http://chat_server;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Health check for chat server
    location /chat-health {
        proxy_pass http://chat_server/health;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Reload Nginx:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Step 7: Update Frontend Configuration

If you're using a reverse proxy, update the chat client to use the same domain:

```javascript
// In frontend/js/chat.js, update the getChatServerUrl function:
function getChatServerUrl() {
    const currentHost = window.location.hostname;
    const currentProtocol = window.location.protocol;
    
    // If running on localhost, use localhost:4000
    if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
        return 'http://localhost:4000';
    }
    
    // For production with reverse proxy, use the same domain
    return `${currentProtocol}//${currentHost}`;
}
```

## Step 8: Test the Chat Server

1. **Test the health endpoint:**
   ```bash
   curl https://yourdomain.com/chat-health
   ```

2. **Test WebSocket connection:**
   - Open your website
   - Open browser developer tools
   - Check the console for connection messages
   - Try sending a chat message

## Troubleshooting

### Common Issues:

1. **Connection refused:**
   - Check if the chat server is running
   - Verify port 4000 is open
   - Check firewall settings

2. **CORS errors:**
   - Update the CORS configuration with your domain
   - Make sure the origin matches exactly

3. **WebSocket upgrade failed:**
   - Check reverse proxy configuration
   - Verify Nginx/Apache WebSocket support

4. **Server not starting:**
   - Check Node.js version (requires 14+)
   - Verify all dependencies are installed
   - Check log files for errors

### Debug Commands:

```bash
# Check if server is running
ps aux | grep node

# Check port usage
netstat -tlnp | grep :4000

# Check PM2 status
pm2 status
pm2 logs chat-server

# Check systemd status
sudo systemctl status chat-server
sudo journalctl -u chat-server -f
```

## Security Considerations

1. **Rate Limiting:** Consider adding rate limiting to prevent spam
2. **Message Validation:** Validate and sanitize all messages
3. **User Authentication:** Consider adding user authentication for production
4. **HTTPS:** Always use HTTPS in production
5. **Input Sanitization:** Sanitize user inputs to prevent XSS

## Monitoring

Set up monitoring for your chat server:

```bash
# PM2 monitoring
pm2 monit

# System monitoring
htop
iotop
```

## Backup and Recovery

1. **Backup your chat server configuration**
2. **Set up log rotation**
3. **Monitor disk space usage**
4. **Set up alerts for server downtime**

## Support

If you encounter issues:
1. Check the server logs
2. Verify network connectivity
3. Test with a simple WebSocket client
4. Check browser console for errors

---

**Note:** This guide assumes you have basic server administration knowledge. If you're using a managed hosting service, some steps may need to be adapted to your specific hosting environment. 
 