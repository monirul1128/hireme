// Enhanced real-time chat client with fallback support
let username = '';
let chatEnabled = false;
let fallbackMode = false;

// Auto-detect server URL for chat
function getChatServerUrl() {
    const currentHost = window.location.hostname;
    const currentProtocol = window.location.protocol;
    
    // If running on localhost, use localhost:4000
    if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
        return 'http://localhost:4000';
    }
    
    // For production, use the same domain but port 4000
    // You can also set a specific chat server domain here
    return `${currentProtocol}//${currentHost}:4000`;
}

// Initialize chat with error handling and fallback
function initializeChat() {
    try {
        const socket = io(getChatServerUrl(), {
            timeout: 3000,
            reconnection: false
        });

        socket.on('connect', () => {
            console.log('Connected to chat server');
            chatEnabled = true;
            fallbackMode = false;
            hideChatError();
        });

        socket.on('connect_error', (error) => {
            console.error('Chat server connection failed:', error);
            chatEnabled = false;
            fallbackMode = true;
            showChatError('Chat server unavailable. Using demo mode.');
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from chat server');
            chatEnabled = false;
            fallbackMode = true;
        });

        return socket;
    } catch (error) {
        console.error('Failed to initialize chat:', error);
        chatEnabled = false;
        fallbackMode = true;
        showChatError('Using demo chat mode.');
        return null;
    }
}

// Fallback chat system using localStorage
class FallbackChat {
    constructor() {
        this.messages = JSON.parse(localStorage.getItem('chat_messages') || '[]');
        this.maxMessages = 50;
    }

    addMessage(username, message) {
        const newMessage = {
            username: username,
            msg: message,
            timestamp: new Date().toISOString()
        };
        
        this.messages.push(newMessage);
        
        // Keep only recent messages
        if (this.messages.length > this.maxMessages) {
            this.messages = this.messages.slice(-this.maxMessages);
        }
        
        localStorage.setItem('chat_messages', JSON.stringify(this.messages));
        return newMessage;
    }

    getMessages() {
        return this.messages;
    }

    clearMessages() {
        this.messages = [];
        localStorage.removeItem('chat_messages');
    }
}

function showChatError(message) {
    // Remove existing error
    hideChatError();
    
    // Create error notification
    const errorDiv = document.createElement('div');
    errorDiv.id = 'chat-error';
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f39c12;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10001;
        font-family: inherit;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        max-width: 300px;
        word-wrap: break-word;
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    // Remove after 5 seconds
    setTimeout(() => {
        hideChatError();
    }, 5000);
}

function hideChatError() {
    const existingError = document.getElementById('chat-error');
    if (existingError) {
        existingError.remove();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const socket = initializeChat();
    const fallbackChat = new FallbackChat();
    
    // Create chat popup button
    const chatPopupBtn = document.createElement('button');
    chatPopupBtn.id = 'chat-popup-btn';
    chatPopupBtn.innerHTML = '<i class="fas fa-comments"></i> Chat';
    document.body.appendChild(chatPopupBtn);

    // Create chat box
    const chatBox = document.createElement('div');
    chatBox.id = 'chat-box';
    chatBox.style.display = 'none';
    chatBox.innerHTML = `
        <div id="chat-header">
            Live Chat 
            ${fallbackMode ? '<span style="color: #f39c12;">(Demo Mode)</span>' : ''}
            <span id="chat-close">&times;</span>
        </div>
        <div id="chat-messages"></div>
        <form id="chat-form">
            <input id="chat-input" type="text" placeholder="Type a message..." autocomplete="off" />
            <button type="submit">Send</button>
        </form>
    `;
    document.body.appendChild(chatBox);

    // Show chat on popup button click
    chatPopupBtn.addEventListener('click', () => {
        if (!username) {
            username = prompt('Enter your name:', '') || '';
            if (!username || username.trim() === '') {
                username = 'Guest' + Math.floor(Math.random() * 1000);
            }
        }
        
        chatBox.style.display = 'flex';
        chatPopupBtn.style.display = 'none';
        
        // Load existing messages
        loadChatMessages();
    });

    // Hide chat on close
    const chatClose = chatBox.querySelector('#chat-close');
    chatClose.addEventListener('click', () => {
        chatBox.style.display = 'none';
        chatPopupBtn.style.display = 'block';
    });

    const chatMessages = chatBox.querySelector('#chat-messages');
    const chatForm = chatBox.querySelector('#chat-form');
    const chatInput = chatBox.querySelector('#chat-input');

    function loadChatMessages() {
        chatMessages.innerHTML = '';
        const messages = fallbackMode ? fallbackChat.getMessages() : [];
        
        if (fallbackMode && messages.length === 0) {
            const welcomeMsg = document.createElement('div');
            welcomeMsg.className = 'chat-message';
            welcomeMsg.textContent = 'System: Welcome to demo chat! Messages are stored locally.';
            chatMessages.appendChild(welcomeMsg);
        }
        
        messages.forEach(msg => {
            const msgDiv = document.createElement('div');
            msgDiv.className = 'chat-message';
            msgDiv.textContent = `${msg.username}: ${msg.msg}`;
            chatMessages.appendChild(msgDiv);
        });
        
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const value = chatInput.value.trim();
        if (value !== '') {
            if (chatEnabled && socket) {
                socket.emit('chat message', { username, msg: value });
            } else if (fallbackMode) {
                // Use fallback chat
                const newMessage = fallbackChat.addMessage(username, value);
                const msgDiv = document.createElement('div');
                msgDiv.className = 'chat-message';
                msgDiv.textContent = `${newMessage.username}: ${newMessage.msg}`;
                chatMessages.appendChild(msgDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
            chatInput.value = '';
        }
    });

    if (socket) {
        socket.on('chat message', (data) => {
            console.log('Received chat message:', data); // Debug log
            
            const msgDiv = document.createElement('div');
            msgDiv.className = 'chat-message';
            
            if (typeof data === 'string') {
                msgDiv.textContent = data;
            } else if (typeof data === 'object' && data !== null) {
                let usernameText = (typeof data.username === 'string' && data.username.trim() !== '') ? data.username : 'User';
                let messageText = (typeof data.msg === 'string' && data.msg.trim() !== '') ? data.msg : '[no message]';
                msgDiv.textContent = `${usernameText}: ${messageText}`;
            } else {
                msgDiv.textContent = String(data);
            }
            
            // Add timestamp for better tracking
            const timestamp = new Date().toLocaleTimeString();
            msgDiv.setAttribute('data-timestamp', timestamp);
            
            chatMessages.appendChild(msgDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Debug: Log that message was added
            console.log('Message added to chat:', msgDiv.textContent);
        });
        
        // Add connection status logging
        socket.on('connect', () => {
            console.log('✅ Connected to chat server');
            const statusDiv = document.createElement('div');
            statusDiv.className = 'chat-message system-message';
            statusDiv.textContent = '✅ Connected to chat server';
            statusDiv.style.color = '#28a745';
            chatMessages.appendChild(statusDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        });
        
        socket.on('disconnect', () => {
            console.log('❌ Disconnected from chat server');
            const statusDiv = document.createElement('div');
            statusDiv.className = 'chat-message system-message';
            statusDiv.textContent = '❌ Disconnected from chat server';
            statusDiv.style.color = '#dc3545';
            chatMessages.appendChild(statusDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        });
    }
}); 