# Live Chat Troubleshooting Guide

## Quick Fixes for Common Issues

### 1. Chat Button Not Appearing
**Problem:** The chat button doesn't show up on your website.

**Solution:**
- Check if `frontend/js/chat.js` is loaded in your HTML
- Verify Socket.IO CDN is included before chat.js
- Check browser console for JavaScript errors

### 2. Connection Failed Error
**Problem:** "Chat server is not available" error appears.

**Solutions:**
1. **For Local Development:**
   ```bash
   cd realtime-chat-server
   npm install
   node server.js
   ```

2. **For Production:**
   - Upload chat server to your cloud server
   - Run the deployment script: `./scripts/deploy-chat-server.sh`
   - Check if port 4000 is open in firewall

### 3. CORS Errors
**Problem:** Browser shows CORS policy errors.

**Solution:**
Update the `.env` file in your chat server:
```env
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### 4. Messages Not Sending
**Problem:** Messages appear to send but don't show up.

**Solutions:**
- Check browser console for errors
- Verify chat server is running: `pm2 status`
- Check server logs: `pm2 logs chat-server`

### 5. Chat Server Won't Start
**Problem:** Server fails to start or crashes.

**Solutions:**
1. Check Node.js version (needs 16+):
   ```bash
   node --version
   ```

2. Reinstall dependencies:
   ```bash
   cd realtime-chat-server
   rm -rf node_modules package-lock.json
   npm install
   ```

3. Check port availability:
   ```bash
   netstat -tlnp | grep :4000
   ```

### 6. Reverse Proxy Issues
**Problem:** Chat works locally but not through domain.

**Solution:**
Add this to your Nginx config:
```nginx
location /socket.io/ {
    proxy_pass http://127.0.0.1:4000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
}
```

## Testing Commands

### Check Server Status
```bash
# Check if server is running
curl http://localhost:4000/health

# Check PM2 status
pm2 status

# View server logs
pm2 logs chat-server
```

### Test WebSocket Connection
```javascript
// In browser console
const socket = io('http://localhost:4000');
socket.on('connect', () => console.log('Connected!'));
socket.on('connect_error', (err) => console.log('Error:', err));
```

## Emergency Fixes

### Reset Everything
```bash
# Stop all processes
pm2 stop all
pm2 delete all

# Restart chat server
cd realtime-chat-server
pm2 start server.js --name "chat-server"
pm2 save
```

### Quick Local Test
```bash
# Start server directly
cd realtime-chat-server
node server.js

# In another terminal, test connection
curl http://localhost:4000/health
```

## Common Error Messages

| Error | Cause | Fix |
|-------|-------|-----|
| `ECONNREFUSED` | Server not running | Start chat server |
| `CORS error` | Wrong origins | Update .env file |
| `Port already in use` | Another service on port 4000 | Change port or stop other service |
| `Module not found` | Dependencies missing | Run `npm install` |

## Getting Help

1. **Check logs first:**
   ```bash
   pm2 logs chat-server --lines 50
   ```

2. **Test basic connectivity:**
   ```bash
   curl http://localhost:4000/
   ```

3. **Verify configuration:**
   - Check `.env` file exists
   - Verify `ALLOWED_ORIGINS` includes your domain
   - Ensure port 4000 is open

4. **Common issues checklist:**
   - [ ] Node.js version 16+
   - [ ] Dependencies installed
   - [ ] Port 4000 available
   - [ ] Firewall allows port 4000
   - [ ] CORS origins configured
   - [ ] PM2 process running

## Support

If you're still having issues:
1. Check the deployment guide: `docs/guides/CHAT-SERVER-DEPLOYMENT.md`
2. Review server logs for specific error messages
3. Test with a simple WebSocket client
4. Verify network connectivity to your server 