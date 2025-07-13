// DOM elements
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const chatMessages = document.getElementById('chatMessages');
const newChatBtn = document.getElementById('newChatBtn');
const chatHistory = document.getElementById('chatHistory');

let currentChatId = null;
let isTyping = false;

// Event listeners
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});
newChatBtn.addEventListener('click', startNewChat);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadChatHistory();
});

async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message || isTyping) return;

    // Add user message to chat
    addMessageToChat('user', message);
    messageInput.value = '';

    // Show typing indicator
    showTypingIndicator();

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }

        // Remove typing indicator and add bot response
        hideTypingIndicator();
        addMessageToChat('bot', data.response);
        
        // Update current chat ID
        currentChatId = data.chat_id;
        
        // Reload chat history to show new chat
        loadChatHistory();
        
    } catch (error) {
        console.error('Error:', error);
        hideTypingIndicator();
        addMessageToChat('bot', 'Sorry, I encountered an error. Please try again.');
    }
}

function addMessageToChat(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = role === 'user' ? '👤' : '🤖';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = content;
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);
    
    // Remove welcome message if it exists
    const welcomeMessage = chatMessages.querySelector('.welcome-message');
    if (welcomeMessage) {
        welcomeMessage.remove();
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    isTyping = true;
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot typing-indicator';
    typingDiv.id = 'typing-indicator';
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = '🤖';
    
    const typingContent = document.createElement('div');
    typingContent.className = 'message-content';
    typingContent.innerHTML = `
        <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
        </div>
        AI is typing...
    `;
    
    typingDiv.appendChild(avatar);
    typingDiv.appendChild(typingContent);
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    isTyping = false;
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

async function startNewChat() {
    try {
        await fetch('/new_chat', { method: 'POST' });
        currentChatId = null;
        chatMessages.innerHTML = `
            <div class="welcome-message">
                <h2>Welcome to AI Chatbot! 👋</h2>
                <p>Start a conversation by typing a message below.</p>
            </div>
        `;
        loadChatHistory();
    } catch (error) {
        console.error('Error starting new chat:', error);
    }
}

async function loadChatHistory() {
    try {
        const response = await fetch('/get_chat_history_summary');
        const history = await response.json();
        
        chatHistory.innerHTML = '';
        
        if (history.length === 0) {
            chatHistory.innerHTML = '<p style="color: #718096; text-align: center; padding: 20px;">No chat history yet</p>';
            return;
        }
        
        history.forEach(chat => {
            const chatItem = document.createElement('div');
            chatItem.className = 'chat-item';
            if (chat.chat_id === currentChatId) {
                chatItem.classList.add('active');
            }
            
            chatItem.innerHTML = `
                <div class="title">${chat.title}</div>
                <div class="meta">${chat.message_count} messages</div>
            `;
            
            chatItem.addEventListener('click', () => loadChatSession(chat.chat_id));
            
            // Add delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '🗑️';
            deleteBtn.style.cssText = `
                background: none;
                border: none;
                cursor: pointer;
                color: #e53e3e;
                font-size: 0.8rem;
                margin-left: auto;
                padding: 2px;
            `;
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteChatSession(chat.chat_id);
            });
            
            chatItem.appendChild(deleteBtn);
            chatHistory.appendChild(chatItem);
        });
        
    } catch (error) {
        console.error('Error loading chat history:', error);
    }
}

async function loadChatSession(chatId) {
    try {
        const response = await fetch(`/get_chat_session/${chatId}`);
        const messages = await response.json();
        
        if (response.ok) {
            currentChatId = chatId;
            chatMessages.innerHTML = '';
            
            if (messages.length === 0) {
                chatMessages.innerHTML = `
                    <div class="welcome-message">
                        <h2>Welcome to AI Chatbot! 👋</h2>
                        <p>Start a conversation by typing a message below.</p>
                    </div>
                `;
            } else {
                messages.forEach(msg => {
                    addMessageToChat(msg.role, msg.content);
                });
            }
            
            // Update active state in chat history
            document.querySelectorAll('.chat-item').forEach(item => {
                item.classList.remove('active');
            });
            event.target.closest('.chat-item').classList.add('active');
        }
        
    } catch (error) {
        console.error('Error loading chat session:', error);
    }
}

async function deleteChatSession(chatId) {
    if (!confirm('Are you sure you want to delete this chat?')) return;
    
    try {
        const response = await fetch(`/delete_chat_session/${chatId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            if (currentChatId === chatId) {
                currentChatId = null;
                chatMessages.innerHTML = `
                    <div class="welcome-message">
                        <h2>Welcome to AI Chatbot! 👋</h2>
                        <p>Start a conversation by typing a message below.</p>
                    </div>
                `;
            }
            loadChatHistory();
        }
        
    } catch (error) {
        console.error('Error deleting chat session:', error);
    }
}