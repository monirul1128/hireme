#!/usr/bin/env python3
"""
Production Chat Server for Windows
Uses Waitress (Windows-compatible WSGI server) instead of Gunicorn
"""

from flask import Flask, render_template_string, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from waitress import serve
import os
import logging
import threading
import time

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-change-in-production')
app.config['DEBUG'] = False  # Disable debug mode for production

# Configure CORS
CORS(app, origins=['*'])

# Configure Socket.IO for production
socketio = SocketIO(app, 
                   cors_allowed_origins="*",
                   async_mode='threading',
                   logger=True,
                   engineio_logger=True)

# Simple HTML template for testing
HTML_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <title>Global Chat Server - Production</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.7.4/socket.io.min.js"></script>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .status { padding: 15px; margin: 20px 0; border-radius: 8px; font-weight: bold; }
        .healthy { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .messages { height: 400px; overflow-y: scroll; border: 1px solid #ddd; padding: 15px; border-radius: 5px; background: #f8f9fa; }
        input, button { margin: 10px 5px; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
        button { background: #007bff; color: white; cursor: pointer; }
        button:hover { background: #0056b3; }
        .info { background: #e7f3ff; padding: 15px; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌐 Global Production Chat Server</h1>
        <div class="status healthy">✅ Server Status: {{ status }}</div>
        <div class="info">
            <p><strong>Environment:</strong> {{ environment }}</p>
            <p><strong>Port:</strong> {{ port }}</p>
            <p><strong>Server:</strong> Waitress (Windows Production WSGI)</p>
            <p><strong>Global Access:</strong> Available from any device on your network</p>
        </div>
        <div class="messages" id="messages"></div>
        <input type="text" id="message" placeholder="Type a message..." style="width: 70%;">
        <button onclick="sendMessage()">Send Message</button>
    </div>
    
    <script>
        const socket = io();
        
        socket.on('connect', () => {
            console.log('Connected to global production chat server');
            addMessage('System: Connected to global production chat server! 🌐');
        });
        
        socket.on('chat message', (data) => {
            addMessage(data.username + ': ' + data.msg);
        });
        
        function sendMessage() {
            const message = document.getElementById('message').value;
            if (message.trim()) {
                socket.emit('chat message', {username: 'Test User', msg: message});
                document.getElementById('message').value = '';
            }
        }
        
        function addMessage(text) {
            const div = document.createElement('div');
            div.textContent = text;
            div.style.padding = '5px 0';
            div.style.borderBottom = '1px solid #eee';
            document.getElementById('messages').appendChild(div);
            document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
        }
        
        document.getElementById('message').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    </script>
</body>
</html>
"""

@app.route('/')
def index():
    return render_template_string(HTML_TEMPLATE, 
                                status='Healthy & Global',
                                environment=os.getenv('FLASK_ENV', 'production'),
                                port=os.getenv('PORT', 4000))

@app.route('/health')
def health():
    return jsonify({
        'status': 'healthy', 
        'server': 'python-flask-waitress-production',
        'environment': os.getenv('FLASK_ENV', 'production'),
        'platform': 'Windows',
        'wsgi_server': 'Waitress',
        'timestamp': __import__('datetime').datetime.now().isoformat()
    })

@app.route('/status')
def status():
    return jsonify({
        'server': 'Flask Chat Server - Windows Production',
        'version': '1.0.0',
        'environment': os.getenv('FLASK_ENV', 'production'),
        'platform': 'Windows',
        'wsgi_server': 'Waitress',
        'port': os.getenv('PORT', 4000),
        'global_access': True
    })

@app.route('/network')
def network_info():
    import socket
    hostname = socket.gethostname()
    local_ip = socket.gethostbyname(hostname)
    return jsonify({
        'hostname': hostname,
        'local_ip': local_ip,
        'port': os.getenv('PORT', 4000),
        'access_urls': [
            f'http://localhost:{os.getenv("PORT", 4000)}',
            f'http://{local_ip}:{os.getenv("PORT", 4000)}'
        ]
    })

@socketio.on('connect')
def handle_connect():
    logger.info('Client connected to global server')
    emit('chat message', {'username': 'System', 'msg': 'Welcome to global production chat server! 🌐'})

@socketio.on('chat message')
def handle_message(data):
    logger.info(f'Message received: {data}')
    emit('chat message', data, broadcast=True)

@socketio.on('disconnect')
def handle_disconnect():
    logger.info('Client disconnected from global server')

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

def start_waitress_server():
    """Start the Waitress production server"""
    port = int(os.environ.get('PORT', 4000))
    host = '0.0.0.0'  # Listen on all interfaces for global access
    
    logger.info(f"🚀 Starting Windows Production Chat Server")
    logger.info(f"🌐 Host: {host}")
    logger.info(f"🔌 Port: {port}")
    logger.info(f"📦 WSGI Server: Waitress")
    logger.info(f"🌍 Global Access: Enabled")
    
    # Start Socket.IO in a separate thread
    def run_socketio():
        socketio.run(app, host=host, port=port, debug=False, use_reloader=False)
    
    socketio_thread = threading.Thread(target=run_socketio, daemon=True)
    socketio_thread.start()
    
    # Start Waitress server
    serve(app, host=host, port=port, threads=8)

if __name__ == '__main__':
    start_waitress_server() 