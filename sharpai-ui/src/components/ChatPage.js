import React, { useEffect, useState } from 'react';
import chatLogo from '../assets/Frame 1216258384.svg';
import { jwtDecode } from 'jwt-decode';


function ChatPage() {
    const [userName, setUserName] = useState('');

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token);
        setUserName(decoded.firstName); 
      }
    }, []);
  
  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h1 style={styles.title}>SharpAI</h1>
        <button style={styles.newChatButton}>+ New Chat</button>
        <div style={styles.recentChats}>
          <h2 style={styles.recentTitle}>Recent</h2>
          <div style={styles.chatItem}>
            <div style={styles.chatIcon}>📄</div>
            <span style={styles.chatText}>Toronto Raptors to Win</span>
          </div>
          <div style={styles.chatItem}>
            <div style={styles.chatIcon}>📄</div>
            <span style={styles.chatText}>Lorem ipsum dolor sit amet</span>
          </div>
          <div style={styles.chatItem}>
            <div style={styles.chatIcon}>📄</div>
            <span style={styles.chatText}>Lorem ipsum dolor sit amet</span>
          </div>
        </div>
      </div>

      {/* Main Chat Window */}
      <div style={styles.chatWindow}>
        <div style={styles.welcomeContainer}>
          <img src={chatLogo} alt="Chat Logo" style={styles.chatLogo} />
          <h2 style={styles.welcomeMessage}>Hello, {userName ? userName : 'Guest'}✨</h2>
          <p style={styles.subMessage}>What do you want to bet on today?</p>
        </div>
        <div style={styles.inputContainer}>
          <div style={styles.inputBar}>
            <button style={styles.attachmentButton}>📎</button>
            <input
              type="text"
              placeholder="Type your message..."
              style={styles.input}
            />
            <button style={styles.sendButton}>➤</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#0C111B',
    color: '#ffffff',
  },
  sidebar: {
    width: '300px',
    backgroundColor: '#071730',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  newChatButton: {
    backgroundColor: '#0066ff',
    color: '#ffffff',
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '30px',
  },
  recentChats: {
    marginTop: '20px',
  },
  recentTitle: {
    fontSize: '16px',
    marginBottom: '10px',
    color: '#bbbbbb',
  },
  chatItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 0',
    cursor: 'pointer',
  },
  chatIcon: {
    marginRight: '10px',
    fontSize: '18px',
  },
  chatText: {
    fontSize: '14px',
    color: '#ffffff',
  },
  chatWindow: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#0C111B',
  },
  welcomeContainer: {
    textAlign: 'center',
    marginBottom: 'auto',
  },
  chatLogo: {
    fontSize: '48px',
    marginBottom: '20px',
  },
  welcomeMessage: {
    fontSize: '32px',
    marginBottom: '10px',
  },
  subMessage: {
    fontSize: '24px',
    color: '#bbbbbb',
  },
  inputContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginTop: 'auto',
  },
  inputBar: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    maxWidth: '600px',
    backgroundColor: '#1C2639',
    borderRadius: '30px',
    padding: '10px 20px',
  },
  attachmentButton: {
    fontSize: '18px',
    color: '#bbbbbb',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    marginRight: '10px',
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    border: 'none',
    color: '#ffffff',
    fontSize: '16px',
    outline: 'none',
    padding: '5px',
  },
  sendButton: {
    fontSize: '18px',
    color: '#ffffff',
    backgroundColor: '#0066ff',
    borderRadius: '50%',
    border: 'none',
    padding: '10px',
    cursor: 'pointer',
  },
  chatLogo: {
    width: '200px', 
    height: '200px', 
    marginBottom: '20px',
  },
};

export default ChatPage;
