import os
import json
import webbrowser  # ✅ Optional: open browser automatically
from flask import Flask, render_template, request, jsonify, session
import google.generativeai as genai
from dotenv import load_dotenv

print("🚀 Python script started executing...")  # ✅ Visible print

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('FLASK_SECRET_KEY', 'a_very_secret_key_for_dev_if_not_in_env')

# Configure Gemini API
gemini_api_key = os.getenv("GOOGLE_API_KEY")
if not gemini_api_key:
    raise ValueError("GOOGLE_API_KEY not set in .env file")
genai.configure(api_key=gemini_api_key)

# Load Gemini model
model = genai.GenerativeModel('gemini-1.5-flash')

# File to store chat history
CHAT_HISTORY_FILE = 'chat_history.json'

# Load chat history from file
def load_chat_history():
    if os.path.exists(CHAT_HISTORY_FILE):
        with open(CHAT_HISTORY_FILE, 'r') as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                return {}
    return {}

# Save chat history to file
def save_chat_history(history):
    with open(CHAT_HISTORY_FILE, 'w') as f:
        json.dump(history, f, indent=4)

# In-memory chat sessions
all_chat_sessions = load_chat_history()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/new_chat', methods=['POST'])
def new_chat():
    session.pop('current_chat_id', None)
    return jsonify({'message': 'New chat started'})

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json(silent=True) or {}
    user_message = data.get('message')
    chat_id = session.get('current_chat_id')

    if not user_message:
        return jsonify({'error': 'No message provided'}), 400

    if chat_id is None or chat_id not in all_chat_sessions:
        chat_id = os.urandom(16).hex()
        all_chat_sessions[chat_id] = []
        session['current_chat_id'] = chat_id

    current_convo = all_chat_sessions[chat_id]
    current_convo.append({"role": "user", "parts": [user_message]})

    try:
        chat_session = model.start_chat(history=current_convo)
        response = chat_session.send_message(user_message)
        bot_response = response.text
    except Exception as e:
        print(f"❌ Gemini error: {e}")
        current_convo.pop()
        bot_response = "⚠️ Error connecting to Gemini API."

    current_convo.append({"role": "assistant", "parts": [bot_response]})
    save_chat_history(all_chat_sessions)

    return jsonify({'response': bot_response, 'chat_id': chat_id})

@app.route('/get_chat_history_summary', methods=['GET'])
def get_chat_history_summary():
    summary = []
    for chat_id, messages in all_chat_sessions.items():
        if messages:
            title = next((m['parts'][0] for m in messages if m['role'] == 'user'), "New Chat")
            summary.append({
                'chat_id': chat_id,
                'title': title[:40] + '...' if len(title) > 40 else title,
                'message_count': len(messages)
            })
    summary.reverse()
    return jsonify(summary)

@app.route('/get_chat_session/<chat_id>', methods=['GET'])
def get_chat_session(chat_id):
    if chat_id in all_chat_sessions:
        session['current_chat_id'] = chat_id
        return jsonify([
            {'role': 'user' if msg['role'] == 'user' else 'bot', 'content': msg['parts'][0]}
            for msg in all_chat_sessions[chat_id]
        ])
    return jsonify({'error': 'Chat session not found'}), 404

@app.route('/delete_chat_session/<chat_id>', methods=['DELETE'])
def delete_chat_session(chat_id):
    if chat_id in all_chat_sessions:
        del all_chat_sessions[chat_id]
        save_chat_history(all_chat_sessions)
        if session.get('current_chat_id') == chat_id:
            session.pop('current_chat_id', None)
        return jsonify({'message': f'Chat {chat_id} deleted'})
    return jsonify({'error': 'Chat not found'}), 404

# Run the app
if __name__ == '__main__':
    os.makedirs('static', exist_ok=True)
    os.makedirs('templates', exist_ok=True)

    print("✅ Flask server is starting...")  # ✅ Visible confirmation

    port = int(os.environ.get('PORT', 5000))
    url = f"http://127.0.0.1:{port}"

    # ✅ Optional: Auto-open browser
    try:
        webbrowser.open_new_tab(url)
    except:
        pass

    print(f"🌐 Visit your chatbot at: {url}")
    app.run(host='0.0.0.0', port=port, debug=True)
