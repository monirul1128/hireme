// Enhanced real-time chat client with popup and username support
let username = '';
const socket = io('http://localhost:4000'); // Update this URL if deployed elsewhere

document.addEventListener('DOMContentLoaded', () => {
  // Create chat popup button
  const chatPopupBtn = document.createElement('button');
  chatPopupBtn.id = 'chat-popup-btn';
  chatPopupBtn.innerHTML = '<i class="fas fa-comments"></i> Chat';
  document.body.appendChild(chatPopupBtn);

  // Create chat box (hidden by default)
  const chatBox = document.createElement('div');
  chatBox.id = 'chat-box';
  chatBox.style.display = 'none';
  chatBox.innerHTML = `
    <div id="chat-header">Live Chat <span id="chat-close">&times;</span></div>
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

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = chatInput.value.trim();
    if (value !== '') {
      socket.emit('chat message', { username, msg: value });
      chatInput.value = '';
    }
  });

  socket.on('chat message', (data) => {
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
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });
}); 