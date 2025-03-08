import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import chatLogo from "../assets/Frame 1216258384.svg";
import { jwtDecode } from "jwt-decode";

function ChatPage() {
  const [userName, setUserName] = useState("");
  const [league, setLeague] = useState("");
  const [selectedTeamCity, setSelectedTeamCity] = useState("");
  const [selectedTeamName, setSelectedTeamName] = useState("");
  const [opposingTeamCity, setOpposingTeamCity] = useState("");
  const [opposingTeamName, setOpposingTeamName] = useState("");
  const [date, setDate] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [responseMessage, setResponseMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  useEffect(() => {
    // Check for stored analysis when component mounts
    const storedAnalysis = localStorage.getItem("betAnalysis");
    if (storedAnalysis) {
      setResponseMessage(JSON.parse(storedAnalysis));
      // Clear the stored analysis after retrieving it
      localStorage.removeItem("betAnalysis");
    }

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !league ||
      !selectedTeamCity ||
      !selectedTeamName ||
      !opposingTeamCity ||
      !opposingTeamName ||
      !date
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const betDetails = {
      league: league.trim(),
      selectedTeam: {
        city: selectedTeamCity.trim(),
        name: selectedTeamName.trim(),
      },
      opposingTeam: {
        city: opposingTeamCity.trim(),
        name: opposingTeamName.trim(),
      },
      date: date.trim(),
    };

    setLoading(true); // Start loading

    try {
      const response = await fetch("http://localhost:3000/betslip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(betDetails),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          alert("Session expired. Please log in again.");
          window.location.href = "/login";
        } else {
          throw new Error(
            errorData.message || "Failed to submit the bet slip."
          );
        }
      }

      const data = await response.json();
      localStorage.setItem("currentConversationID", data.conversationID); // Save token to localStorage
      setResponseMessage(data.analysis);
      console.log(localStorage.getItem("currentConversationID"))
    } catch (error) {
      console.error("Error submitting bet slip:", error.message);
      alert(error.message);
    } finally {
      setLoading(false); // End loading
    }
  };

  const formatSectionName = (name) => {
    let formattedName = name
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2") // Add space before capital letters
      .replace(/([a-zA-Z])(\d)/g, "$1 $2") // Add space before digits
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter

    // Dynamically replace team names if present
    if (formattedName.includes("Selected Team")) {
      formattedName = formattedName.replace(
        "Selected Team",
        `${selectedTeamCity} ${selectedTeamName}`
      );
    } else if (formattedName.includes("Opposing Team")) {
      formattedName = formattedName.replace(
        "Opposing Team",
        `${opposingTeamCity} ${opposingTeamName}`
      );
    }

    return formattedName;
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
        <button
          onClick={() => navigate("/upload-betting-history")}
          className="btn btn-outline-primary mb-3"
          style={styles.uploadHistoryButton}
        >
          Upload Betting History
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
          {/* ... other recent chat items ... */}
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
            Enter your bet details below:
          </p>
        </div>
        {loading ? (
          <div style={styles.loadingContainer}>
            <i className="fas fa-spinner fa-spin" style={styles.spinner}></i>
            <p style={styles.loadingText}>Analyzing your bet...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={styles.formContainer}>
            <div style={styles.inputsWrapper}>
              {/* Left side - Input fields */}
              <div style={styles.inputSection}>
                <input
                  type="text"
                  placeholder="League (e.g., NBA)"
                  value={league}
                  onChange={(e) => setLeague(e.target.value)}
                  style={styles.inputBox}
                  required
                />
                <input
                  type="text"
                  placeholder="Selected Team City"
                  value={selectedTeamCity}
                  onChange={(e) => setSelectedTeamCity(e.target.value)}
                  style={styles.inputBox}
                  required
                />
                <input
                  type="text"
                  placeholder="Selected Team Name"
                  value={selectedTeamName}
                  onChange={(e) => setSelectedTeamName(e.target.value)}
                  style={styles.inputBox}
                  required
                />
                <input
                  type="text"
                  placeholder="Opposing Team City"
                  value={opposingTeamCity}
                  onChange={(e) => setOpposingTeamCity(e.target.value)}
                  style={styles.inputBox}
                  required
                />
                <input
                  type="text"
                  placeholder="Opposing Team Name"
                  value={opposingTeamName}
                  onChange={(e) => setOpposingTeamName(e.target.value)}
                  style={styles.inputBox}
                  required
                />
                <input
                  type="text"
                  placeholder="Date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={styles.inputBox}
                  required
                />
              </div>

              {/* Right side - File upload */}
              <div style={styles.fileSection}>
                <div style={styles.fileUploadContainer}>
                  <label htmlFor="file-upload" style={styles.fileUploadLabel}>
                    <div style={styles.uploadBox}>
                      <i
                        className="fas fa-cloud-upload-alt"
                        style={styles.uploadIcon}
                      ></i>
                      <span>Drop screenshots here or click to upload</span>
                      <span style={styles.fileInfo}>
                        {selectedFiles.length > 0
                          ? `${selectedFiles.length} file(s) selected`
                          : "Supports: JPG, PNG, PDF"}
                      </span>
                    </div>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept="image/*, .pdf"
                    onChange={handleFileChange}
                    style={styles.hiddenFileInput}
                  />
                </div>

                {/* File List */}
                {selectedFiles.length > 0 && (
                  <div style={styles.fileList}>
                    {selectedFiles.map((file, index) => (
                      <div key={index} style={styles.fileItem}>
                        <span>{file.name}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedFiles((files) =>
                              files.filter((_, i) => i !== index)
                            )
                          }
                          style={styles.removeFileButton}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={styles.submitButton}
            >
              Submit
            </button>
          </form>
        )}
      </div>

      {responseMessage && (
        <div className="mt-3">
          <h3>Analysis:</h3>
          <div className="response-text">
            {/* Render each piece of the response on a new line */}
            {Object.entries(responseMessage).map(([key, value]) => (
              <div key={key}>
                <strong>{formatSectionName(key)}:</strong>
                <p>{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
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
  loadingContainer: {
    display: "flex",
    alignItems: "center", // Align items vertically
    justifyContent: "center", // Align items horizontally
    gap: "10px", // Space between spinner and text
    height: "100%", // Optional: Adjust based on layout
  },
  spinner: {
    fontSize: "24px", // Adjust spinner size
    color: "#4caf50", // Match your theme
  },
  loadingText: {
    fontSize: "18px", // Adjust text size
    color: "#4caf50", // Match your theme
    fontWeight: "bold",
    margin: 0, // Remove extra spacing
  },
  formContainer: {
    width: "100%",
    maxWidth: "800px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  inputsWrapper: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: "20px",
    marginBottom: "20px",
  },
  inputSection: {
    flex: 1,
    maxWidth: "300px",
  },
  fileSection: {
    flex: 1,
    maxWidth: "300px",
  },
  inputBox: {
    fontSize: "14px",
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #2C3E50",
    marginBottom: "10px",
    width: "100%",
    backgroundColor: "#1C2639",
    color: "#ffffff",
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
  fileUploadContainer: {
    width: "100%",
    marginBottom: "10px",
  },
  fileUploadLabel: {
    width: "100%",
    cursor: "pointer",
  },
  uploadBox: {
    border: "2px dashed #2C3E50",
    borderRadius: "6px",
    padding: "15px",
    textAlign: "center",
    backgroundColor: "#1C2639",
    color: "#a0aec0",
    minHeight: "120px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  uploadIcon: {
    fontSize: "24px",
    marginBottom: "8px",
    color: "#0066ff",
  },
  fileInfo: {
    display: "block",
    fontSize: "12px",
    marginTop: "8px",
    color: "#8e9eb3",
  },
  hiddenFileInput: {
    display: "none",
  },
  fileList: {
    width: "300px",
    marginTop: "8px",
  },
  fileItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px",
    backgroundColor: "#1C2639",
    borderRadius: "4px",
    marginBottom: "4px",
    fontSize: "14px",
    color: "#ffffff",
  },
  removeFileButton: {
    background: "none",
    border: "none",
    color: "#ff4d4d",
    fontSize: "18px",
    cursor: "pointer",
    padding: "0 4px",
    "&:hover": {
      color: "#ff3333",
    },
  },
  submitButton: {
    backgroundColor: "#0066ff",
    color: "#ffffff",
    padding: "8px 30px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    marginTop: "20px",
    transition: "background-color 0.3s ease",
    width: "200px",
    "&:hover": {
      backgroundColor: "#0052cc",
    },
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
