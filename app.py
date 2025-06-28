from flask import Flask, render_template_string, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import os
import logging

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
                   async_mode='eventlet',
                   logger=True,
                   engineio_logger=True)

# Simple HTML template for testing
HTML_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <title>Chat Server - Production</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.7.4/socket.io.min.js"></script>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .status { padding: 10px; margin: 10px 0; border-radius: 5px; }
        .healthy { background: #d4edda; color: #155724; }
        .messages { height: 300px; overflow-y: scroll; border: 1px solid #ccc; padding: 10px; }
        input, button { margin: 5px; padding: 5px; }
    </style>
</head>
<body>
    <h1>Production Chat Server</h1>
    <div class="status healthy">✅ Server Status: {{ status }}</div>
    <p>Environment: {{ environment }}</p>
    <p>Port: {{ port }}</p>
    <div class="messages" id="messages"></div>
    <input type="text" id="message" placeholder="Type a message...">
    <button onclick="sendMessage()">Send</button>
    
    <script>
        const socket = io();
        
        socket.on('connect', () => {
            console.log('Connected to production chat server');
            addMessage('System: Connected to production chat server');
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
            document.getElementById('messages').appendChild(div);
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
                                status='Healthy',
                                environment=os.getenv('FLASK_ENV', 'production'),
                                port=os.getenv('PORT', 4000))

@app.route('/health')
def health():
    return jsonify({
        'status': 'healthy', 
        'server': 'python-flask-production',
        'environment': os.getenv('FLASK_ENV', 'production'),
        'timestamp': __import__('datetime').datetime.now().isoformat()
    })

@app.route('/status')
def status():
    return jsonify({
        'server': 'Flask Chat Server',
        'version': '1.0.0',
        'environment': os.getenv('FLASK_ENV', 'production'),
        'workers': os.getenv('GUNICORN_WORKERS', '4'),
        'port': os.getenv('PORT', 4000)
    })

@socketio.on('connect')
def handle_connect():
    logger.info('Client connected')
    emit('chat message', {'username': 'System', 'msg': 'Welcome to production chat server!'})

@socketio.on('chat message')
def handle_message(data):
    logger.info(f'Message received: {data}')
    emit('chat message', data, broadcast=True)

@socketio.on('disconnect')
def handle_disconnect():
    logger.info('Client disconnected')

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 4000))
    logger.info(f"🚀 Production Flask Chat Server starting on port {port}")
    socketio.run(app, host='0.0.0.0', port=port, debug=False) 