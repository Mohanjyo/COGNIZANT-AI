# 🤖 Cognizant AI Chatbot

A modern, web-based AI chatbot powered by Google's Gemini AI. This Flask application provides an intuitive chat interface with conversation history management and a responsive design.

## ✨ Features

- **AI-Powered Conversations**: Powered by Google's Gemini 1.5 Flash model
- **Chat History**: Persistent conversation storage with JSON file backend
- **Multiple Chat Sessions**: Create and manage multiple chat conversations
- **Responsive UI**: Modern, mobile-friendly interface
- **Real-time Chat**: Instant responses with streaming-like experience
- **Session Management**: Automatic browser session handling

## 🚀 Project Setup Instructions

### Prerequisites

- Python 3.7 or higher
- pip (Python package installer)
- A Google AI Studio API key

### Installation Steps

1. **Clone or download the project**
   ```bash
   # If using git
   git clone <your-repository-url>
   cd cognizant-ai-project
   ```

2. **Create a virtual environment (recommended)**
   ```bash
   # On Windows
   python -m venv venv
   venv\Scripts\activate

   # On macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create environment file**
   ```bash
   # Create a .env file in the project root
   touch .env
   ```

## 🔑 How to Obtain and Configure Google AI API Key

### Step 1: Get Your API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key" or "Get API Key"
4. Copy the generated API key

### Step 2: Configure the API Key

1. **Open the `.env` file** in your project root directory
2. **Add your API key** in the following format:
   ```
   GOOGLE_API_KEY=your_actual_api_key_here
   FLASK_SECRET_KEY=your_secret_key_for_flask_sessions
   ```

   **Example:**
   ```
   GOOGLE_API_KEY=AIzaSyC_YourActualAPIKeyHere123456789
   FLASK_SECRET_KEY=my-super-secret-flask-key-123
   ```

3. **Save the file** and ensure it's in the same directory as `app.py`

### Step 3: Verify Configuration

- Make sure the `.env` file is in the project root directory
- Ensure there are no spaces around the `=` sign
- Don't add quotes around the API key value
- Keep your `.env` file secure and never commit it to version control

## 🎯 Usage Guide

### Starting the Application

1. **Activate your virtual environment** (if using one)
   ```bash
   # Windows
   venv\Scripts\activate

   # macOS/Linux
   source venv/bin/activate
   ```

2. **Run the Flask application**
   ```bash
   python app.py
   ```

3. **Access the chatbot**
   - The application will automatically open in your default browser
   - If it doesn't open automatically, visit: `http://127.0.0.1:5000`

### Using the Chatbot

#### Basic Chatting
1. **Type your message** in the text area at the bottom of the chat interface
2. **Press Enter** or click the "Send" button to send your message
3. **Wait for the AI response** - it will appear in the chat window

#### Managing Chat Sessions
- **New Chat**: Click the "New Chat" button to start a fresh conversation
- **Chat History**: View your previous conversations in the sidebar
- **Switch Between Chats**: Click on any chat in the history to continue that conversation
- **Delete Chats**: Use the delete option in chat history to remove unwanted conversations

#### Features
- **Persistent Storage**: Your conversations are automatically saved and will persist between sessions
- **Responsive Design**: The interface works on desktop, tablet, and mobile devices
- **Real-time Interaction**: Get instant responses from the AI

### Troubleshooting

#### Common Issues

1. **"GOOGLE_API_KEY not set" Error**
   - Ensure your `.env` file exists in the project root
   - Verify the API key is correctly formatted
   - Restart the application after adding the API key

2. **"Error connecting to Gemini API"**
   - Check your internet connection
   - Verify your API key is valid and has sufficient quota
   - Ensure you're using the correct API key format

3. **Port Already in Use**
   - The application uses port 5000 by default
   - If the port is busy, you can change it by setting the `PORT` environment variable
   - Example: `set PORT=8000` (Windows) or `export PORT=8000` (macOS/Linux)

4. **Dependencies Not Found**
   - Ensure you've activated your virtual environment
   - Run `pip install -r requirements.txt` again
   - Check that all packages are installed: `pip list`

## 📁 Project Structure

```
cognizant-ai-project/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── .env                  # Environment variables (create this)
├── chat_history.json     # Chat storage (auto-generated)
├── static/
│   ├── style.css         # CSS styles
│   └── script.js         # Frontend JavaScript
└── templates/
    └── index.html        # Main HTML template
```

## 🔧 Configuration Options

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GOOGLE_API_KEY` | Your Google AI API key | Required |
| `FLASK_SECRET_KEY` | Secret key for Flask sessions | Auto-generated |
| `PORT` | Port number for the server | 5000 |

### Customization

- **Model**: Change the AI model in `app.py` (line 22)
- **Styling**: Modify `static/style.css` for custom appearance
- **Functionality**: Edit `static/script.js` for frontend behavior changes

## 🛡️ Security Notes

- **Never commit your `.env` file** to version control
- **Keep your API key secure** and don't share it publicly
- **Use environment variables** for sensitive configuration
- **Regularly rotate your API keys** for better security

## 📝 License

This project is for educational and personal use. Please ensure compliance with Google AI's terms of service when using their API.

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests to improve this chatbot application.

---

**Happy Chatting! 🚀**

