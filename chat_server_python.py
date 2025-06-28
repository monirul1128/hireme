from flask import Flask, render_template_string, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Simple HTML template for testing
HTML_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <title>Chat Server Test</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.7.4/socket.io.min.js"></script>
</head>
<body>
    <h1>Chat Server is Running!</h1>
    <p>Environment: {{ environment }}</p>
    <p>Port: {{ port }}</p>
    <div id="messages"></div>
    <input type="text" id="message" placeholder="Type a message...">
    <button onclick="sendMessage()">Send</button>
    
    <script>
        const socket = io();
        
        socket.on('connect', () => {
            console.log('Connected to chat server');
            addMessage('System: Connected to chat server');
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
                                environment=os.getenv('FLASK_ENV', 'development'),
                                port=os.getenv('PORT', 4000))

@app.route('/health')
def health():
    return {'status': 'healthy', 'server': 'python-flask'}

@socketio.on('connect')
def handle_connect():
    print(f'Client connected')
    emit('chat message', {'username': 'System', 'msg': 'Welcome to the chat!'})

@socketio.on('chat message')
def handle_message(data):
    print(f'Message received: {data}')
    emit('chat message', data, broadcast=True)

@socketio.on('disconnect')
def handle_disconnect():
    print(f'Client disconnected')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 4000))
    print(f"🚀 Python Chat Server running on port {port}")
    socketio.run(app, host='0.0.0.0', port=port, debug=True) 