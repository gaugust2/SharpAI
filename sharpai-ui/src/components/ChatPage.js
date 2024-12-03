import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import chatLogo from "../assets/Frame 1216258384.svg";
import { jwtDecode } from "jwt-decode";

function ChatPage() {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserName(decoded.firstName); // Get user's name to show later
      } catch (error) {
        console.error("Invalid token:", error);
        handleLogout(); // Expired session, log out
      }
    } else {
      handleLogout(); // No token, log them out
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="d-flex min-vh-100" style={styles.container}>
      {/* Sidebar */}
      <div className="d-flex flex-column p-3" style={styles.sidebar}>
        <h1 className="fs-4 fw-bold mb-4" style={styles.title}>
          SharpAI
        </h1>
        <button className="btn btn-primary mb-3" style={styles.newChatButton}>
          + New Chat
        </button>
        <button
          onClick={handleLogout}
          className="btn btn-outline-primary mb-3"
          style={styles.logoutButton}
        >
          Logout
        </button>
        <div style={styles.recentChats}>
          <h2 className="fs-6 mb-2" style={styles.recentTitle}>
            Recent
          </h2>
          <div
            className="d-flex align-items-center p-2"
            style={styles.chatItem}
          >
            <div className="me-2" style={styles.chatIcon}>
              📄
            </div>
            <span className="text-white" style={styles.chatText}>
              Toronto Raptors to Win
            </span>
          </div>
          <div
            className="d-flex align-items-center p-2"
            style={styles.chatItem}
          >
            <div className="me-2" style={styles.chatIcon}>
              📄
            </div>
            <span className="text-white" style={styles.chatText}>
              Lorem ipsum dolor sit amet
            </span>
          </div>
          <div
            className="d-flex align-items-center p-2"
            style={styles.chatItem}
          >
            <div className="me-2" style={styles.chatIcon}>
              📄
            </div>
            <span className="text-white" style={styles.chatText}>
              Lorem ipsum dolor sit amet
            </span>
          </div>
        </div>
      </div>

      {/* Main Chat Window */}
      <div
        className="flex-grow-1 d-flex flex-column justify-content-between align-items-center p-4"
        style={styles.chatWindow}
      >
        <div className="text-center mb-auto" style={styles.welcomeContainer}>
          <img
            src={chatLogo}
            alt="Chat Logo"
            className="mb-4"
            style={styles.chatLogo}
          />
          <h2 className="fs-3 mb-2" style={styles.welcomeMessage}>
            Hello, {userName ? userName : "Guest"}✨
          </h2>
          <p className="fs-5" style={styles.subMessage}>
            What do you want to bet on today?
          </p>
        </div>
        <div
          className="w-100 d-flex justify-content-center mt-auto"
          style={styles.inputContainer}
        >
          <div
            className="d-flex align-items-center w-100 max-w-600 bg-dark rounded-3 p-3"
            style={styles.inputBar}
          >
            <button
              className="btn btn-link text-muted me-3"
              style={styles.attachmentButton}
            >
              📎
            </button>
            <input
              type="text"
              placeholder="Type your message..."
              className="form-control text-white bg-transparent border-0 fs-5"
              style={styles.input}
            />
            <button
              className="btn btn-primary rounded-circle ms-3"
              style={styles.sendButton}
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#0C111B",
    color: "#ffffff",
  },
  sidebar: {
    width: "300px",
    backgroundColor: "#071730",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  newChatButton: {
    backgroundColor: "#0066ff",
    color: "#ffffff",
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    marginBottom: "30px",
  },
  logoutButton: {
    backgroundColor: "#ffffff",
    color: "#0066ff",
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    marginBottom: "30px",
  },
  recentChats: {
    marginTop: "20px",
  },
  recentTitle: {
    fontSize: "16px",
    marginBottom: "10px",
    color: "#bbbbbb",
  },
  chatItem: {
    display: "flex",
    alignItems: "center",
    padding: "10px 0",
    cursor: "pointer",
  },
  chatIcon: {
    marginRight: "10px",
    fontSize: "18px",
  },
  chatText: {
    fontSize: "14px",
    color: "#ffffff",
  },
  chatWindow: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#0C111B",
  },
  welcomeContainer: {
    textAlign: "center",
    marginBottom: "auto",
  },
  chatLogo: {
    fontSize: "48px",
    marginBottom: "20px",
  },
  welcomeMessage: {
    fontSize: "32px",
    marginBottom: "10px",
  },
  subMessage: {
    fontSize: "24px",
    color: "#bbbbbb",
  },
  inputContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginTop: "auto",
  },
  inputBar: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    maxWidth: "600px",
    backgroundColor: "#1C2639",
    borderRadius: "30px",
    padding: "10px 20px",
  },
  attachmentButton: {
    fontSize: "18px",
    color: "#bbbbbb",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    marginRight: "10px",
  },
  input: {
    flex: 1,
    backgroundColor: "transparent",
    border: "none",
    color: "#ffffff",
    fontSize: "16px",
    outline: "none",
    padding: "5px",
  },
  sendButton: {
    fontSize: "18px",
    color: "#ffffff",
    backgroundColor: "#0066ff",
    borderRadius: "50%",
    border: "none",
    padding: "10px",
    cursor: "pointer",
  },
  chatLogo: {
    width: "200px",
    height: "200px",
    marginBottom: "20px",
  },
};

export default ChatPage;
