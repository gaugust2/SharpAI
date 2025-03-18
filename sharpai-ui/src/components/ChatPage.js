import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import chatLogo from "../assets/Frame 1216258384.svg";
import { jwtDecode } from "jwt-decode";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

function ChatPage() {
  const [userName, setUserName] = useState("");
  const [league, setLeague] = useState("");
  const [teamData, setTeamData] = useState({});
  const [cities, setCities] = useState([]);
  const [selectedTeamCity, setSelectedTeamCity] = useState("");
  const [selectedTeamName, setSelectedTeamName] = useState("");
  const [opposingTeamCity, setOpposingTeamCity] = useState("");
  const [opposingTeamName, setOpposingTeamName] = useState("");
  const [date, setDate] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [responseMessage, setResponseMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    fetch("/teamNames.json")
      .then((response) => response.json())
      .then((data) => setTeamData(data))
      .catch((error) => console.error("Error loading team names:", error));
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  useEffect(() => {
    if (league && teamData[league]) {
      const uniqueCities = [
        ...new Set(teamData[league].map((team) => team.City)),
      ];
      setCities(uniqueCities);
      setSelectedTeamCity("");
      setSelectedTeamName("");
    }
  }, [league]);

  useEffect(() => {
    if (selectedTeamCity && teamData[league]) {
      const foundTeam = teamData[league].find(
        (team) => team.City === selectedTeamCity
      );
      if (foundTeam) setSelectedTeamName(foundTeam.Name);
    }
  }, [selectedTeamCity]);

  useEffect(() => {
    if (opposingTeamCity && teamData[league]) {
      const foundTeam = teamData[league].find(
        (team) => team.City === opposingTeamCity
      );
      if (foundTeam) setOpposingTeamName(foundTeam.Name);
    }
  }, [opposingTeamCity]);

  const fetchConversations = async () => {
    try {
      const response = await fetch("http://localhost:3000/conversationNames", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch conversations.");
      }

      const data = await response.json();
      setConversations(data.conversations.reverse());
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const handleDeleteConversation = async (conversationID) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `http://localhost:3000/deleteConversation/${conversationID}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete conversation.");
        }

        setConversations((prev) =>
          prev.filter((conv) => conv._id !== conversationID)
        );

        if (selectedConversation?._id === conversationID) {
          setSelectedConversation(null);
          setMessages([]);
          localStorage.removeItem("currentConversationID");
        }
        toast.success("Conversation deleted successfully!");
      } catch (error) {
        console.error("Error deleting conversation:", error);
        toast.error("Failed to delete conversation. Please try again.");
      }
    }
  };

  const handleDeleteAllConversations = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete all!",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          "http://localhost:3000/deleteConversations",
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete all conversations.");
        }

        setConversations([]);
        setSelectedConversation(null);
        setMessages([]);
        localStorage.removeItem("currentConversationID");
        toast.success("All conversations deleted successfully!");
      } catch (error) {
        console.error("Error deleting all conversations:", error);
        toast.error("Failed to delete all conversations. Please try again.");
      }
    }
  };

  useEffect(() => {
    fetchConversations();
    const storedAnalysis = localStorage.getItem("betAnalysis");
    if (storedAnalysis) {
      setResponseMessage(JSON.parse(storedAnalysis));
      localStorage.removeItem("betAnalysis");
    }

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserName(decoded.firstName);
      } catch (error) {
        console.error("Invalid token:", error);
        handleLogout();
      }
    } else {
      handleLogout();
    }
  }, []);

  const handleSelectConversation = async (conversationID) => {
    try {
      const response = await fetch("http://localhost:3000/conversation", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "conversation-id": conversationID,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch conversation details.");
      }

      const data = await response.json();
      setSelectedConversation({
        _id: conversationID,
        conversationName: data.conversation.conversationName,
        analysis: data.conversation.analysis || {},
      });
      setMessages(data.conversation.messages || []);
    } catch (error) {
      console.error("Error fetching conversation details:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedDate = date
      ? new Intl.DateTimeFormat("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        }).format(date)
      : "";

    const betData = {
      league,
      selectedTeam: { city: selectedTeamCity, name: selectedTeamName },
      opposingTeam: { city: opposingTeamCity, name: opposingTeamName },
      date: formattedDate,
    };

    const formData = new FormData();
    formData.append("formBetslip", JSON.stringify(betData));

    selectedFiles.forEach((file) => {
      formData.append("file", file);
    });

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/betslip", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          toast.error("Session expired. Please log in again.");
          window.location.href = "/login";
        } else {
          throw new Error(
            errorData.message || "Failed to submit the bet slip."
          );
        }
      }

      const data = await response.json();
      localStorage.setItem("currentConversationID", data.conversationID);
      setSelectedConversation({
        _id: data.conversationID,
        conversationName: data.conversationName,
        analysis: data.analysis || {},
      });
      setMessages([{ role: "assistant", content: data.analysis }]);
      await fetchConversations();
      toast.success("Bet slip submitted successfully!");
    } catch (error) {
      console.error("Error submitting bet slip:", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const conversationID = localStorage.getItem("currentConversationID");
    if (!conversationID) return;

    fetch(`http://localhost:3000/conversation`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "conversation-id": conversationID,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.conversation) {
          setMessages(data.conversation.messages);
        }
      })
      .catch((error) => console.error("Error fetching messages:", error));
  }, []);

  const sendMessage = async () => {
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    const userMessage = { role: "user", content: newMessage };
    const tempMessages = [...messages, userMessage];
    setMessages(tempMessages);
    setNewMessage("");

    try {
      const conversationID = localStorage.getItem("currentConversationID");
      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "conversation-id": conversationID,
        },
        body: JSON.stringify({ message: newMessage }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();
      if (data && data.response) {
        setMessages([
          ...tempMessages,
          { role: "assistant", content: data.response },
        ]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(messages);
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatSectionName = (name) => {
    let formattedName = name
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .replace(/([a-zA-Z])(\d)/g, "$1 $2")
      .replace(/^./, (str) => str.toUpperCase());

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
      {/* Sidebar Toggle Button (Always Available) */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="btn btn-outline-primary sidebar-toggle"
        style={styles.menuButton}
      >
        ☰ Menu
      </button>

      {/* Sidebar (Always Toggleable) */}
      <div
        className={`sidebar ${isSidebarOpen ? "show" : "hide"}`}
        style={styles.sidebar}
      >
        <div className="p-2">
          {/* Close Button */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="btn btn-close close-btn"
            style={styles.closeButton}
          >
            ✖
          </button>

          <h1 className="fs-4 fw-bold mb-4" style={styles.title}>
            SharpAI
          </h1>
          <div className="sidebar-buttons">
            <button
              onClick={() => {
                setSelectedConversation(null);
                setMessages([]);
              }}
              className="btn btn-primary sidebar-btn"
            >
              + New Chat
            </button>

            <button
              onClick={handleLogout}
              className="btn btn-outline-primary sidebar-btn mt-1"
            >
              Logout
            </button>

            <button
              onClick={() => navigate("/settings")}
              className="btn btn-outline-primary sidebar-btn mt-1"
            >
              Settings
            </button>
          </div>

          <div style={styles.recentChats}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h2 className="fs-6" style={styles.recentTitle}>
                Recent Conversations
              </h2>

              {conversations.length > 0 && (
                <button
                  onClick={handleDeleteAllConversations}
                  className="btn btn-sm btn-outline-danger"
                  style={styles.deleteAllButton}
                >
                  🗑️ Delete All
                </button>
              )}
            </div>

            {conversations.length === 0 ? (
              <p style={{ color: "#bbb", fontSize: "14px" }}>
                No previous conversations
              </p>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv._id}
                  className="d-flex justify-content-between align-items-center p-2"
                  style={{
                    ...styles.chatItem,
                    backgroundColor:
                      selectedConversation?._id === conv._id
                        ? "#1A73E8"
                        : "transparent",
                  }}
                  onClick={() => {
                    handleSelectConversation(conv._id);
                    setIsSidebarOpen(false); // Close sidebar after selecting
                  }}
                >
                  <div className="d-flex align-items-center flex-grow-1">
                    <div className="me-2" style={styles.chatIcon}>
                      📄
                    </div>
                    <span className="text-white" style={styles.chatText}>
                      {conv.conversationName}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent chat selection
                      handleDeleteConversation(conv._id);
                    }}
                    className="delete-btn"
                    style={styles.deleteButton}
                  >
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add ToastContainer for notifications */}
      <ToastContainer />

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
          {selectedConversation || loading ? null : (
            <>
              <h2 className="fs-3 mb-2" style={styles.welcomeMessage}>
                Hello, {userName ? userName : "Guest"}✨
              </h2>
              <p className="fs-5" style={styles.subMessage}>
                Enter your bet details below:
              </p>
            </>
          )}
        </div>

        {loading ? (
          <div style={styles.loadingContainer}>
            <i className="fas fa-spinner fa-spin" style={styles.spinner}></i>
            <p style={styles.loadingText}>Analyzing your bet...</p>
          </div>
        ) : selectedConversation && selectedConversation.analysis ? (
          <div className="mt-3" style={{ width: "100%" }}>
            <h3>{selectedConversation.conversationName}</h3>
            <h4>Analysis:</h4>
            <div className="response-text">
              {Object.entries(selectedConversation.analysis).map(
                ([key, value]) => (
                  <div key={key}>
                    <strong>{formatSectionName(key)}:</strong>
                    <p>{value}</p>
                  </div>
                )
              )}
            </div>

            <h4>Messages:</h4>
            <div
              className="chat-messages-container"
              style={{ width: "100%", maxHeight: "500px", overflowY: "auto" }}
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    textAlign: msg.role === "user" ? "right" : "left",
                    margin: "10px 0",
                  }}
                >
                  <span
                    style={{
                      backgroundColor: msg.role === "user" ? "#0066ff" : "#333",
                      color: "#fff",
                      padding: "10px",
                      borderRadius: "8px",
                      display: "inline-block",
                      maxWidth: "60%",
                    }}
                  >
                    {typeof msg.content === "object" ? (
                      <div>
                        {Object.entries(msg.content).map(([key, value]) => (
                          <div key={key}>
                            <strong>{key}:</strong>
                            <p>{value}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      msg.content
                    )}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} /> {/* Scroll to bottom */}
            </div>

            {/* Chat Input Field */}
            <div style={styles.chatInput}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                style={styles.input}
              />
              <button onClick={sendMessage} style={styles.sendButton}>
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={styles.formContainer}>
            <div style={styles.inputsWrapper}>
              <div style={styles.inputSection}>
                {/* Sport Dropdown */}
                <label className="form-label">Sport</label>
                <select
                  className="form-select"
                  value={league}
                  onChange={(e) => setLeague(e.target.value)}
                  style={styles.inputBox}
                >
                  <option value="">Select a sport</option>
                  <option value="NBA">NBA</option>
                  <option value="NFL">NFL</option>
                  <option value="MLB">MLB</option>
                  <option value="NHL">NHL</option>
                </select>

                {/* Selected Team Dropdowns */}
                {league && (
                  <>
                    <label className="form-label">Selected Team City</label>
                    <select
                      className="form-select"
                      value={selectedTeamCity}
                      onChange={(e) => setSelectedTeamCity(e.target.value)}
                      style={styles.inputBox}
                    >
                      <option value="">Select a city</option>
                      {cities.map((city, index) => (
                        <option key={index} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>

                    <label className="form-label">Selected Team Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedTeamName}
                      readOnly
                      style={styles.inputBox}
                    />
                  </>
                )}

                {/* Opposing Team Dropdowns */}
                {league && (
                  <>
                    <label className="form-label">Opposing Team City</label>
                    <select
                      className="form-select"
                      value={opposingTeamCity}
                      onChange={(e) => setOpposingTeamCity(e.target.value)}
                      style={styles.inputBox}
                    >
                      <option value="">Select a city</option>
                      {cities.map((city, index) => (
                        <option key={index} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>

                    <label className="form-label">Opposing Team Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={opposingTeamName}
                      readOnly
                      style={styles.inputBox}
                    />
                  </>
                )}

                {/* Date Picker */}
                <label className="form-label">Game Date</label>
                <DatePicker
                  selected={date}
                  onChange={(selectedDate) => setDate(selectedDate)}
                  dateFormat="MM/dd/yyyy"
                  className="form-control pl-4"
                  placeholderText="Select a date"
                  style={styles.inputBox}
                />
              </div>

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
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#0C111B",
    color: "#ffffff",
    display: "flex",
    minHeight: "100vh",
    flexDirection: "row",
  },
  menuButton: {
    position: "absolute",
    top: "15px",
    left: "15px",
    zIndex: 10,
    fontSize: "18px",
    padding: "10px",
    border: "none",
    backgroundColor: "#0066ff",
    color: "white",
    borderRadius: "5px",
    cursor: "pointer",
  },
  sidebar: {
    width: "300px",
    backgroundColor: "#071730",
    position: "fixed",
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 1000,
    transition: "transform 0.3s ease-in-out",
  },
  sidebarButtons: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  sidebarBtn: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    textAlign: "center",
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: "10px",
    fontSize: "18px",
    color: "#ffffff",
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  chatWindow: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#0C111B",
    width: "100%",
  },
  chatItem: {
    display: "flex",
    alignItems: "center",
    padding: "10px 0",
    cursor: "pointer",
    borderRadius: "8px",
    marginBottom: "5px",
    transition: "background-color 0.2s ease-in-out",
  },
  deleteButton: {
    background: "transparent",
    border: "none",
    color: "#ff4d4d",
    fontSize: "16px",
    cursor: "pointer",
    padding: "5px",
    marginLeft: "10px",
    transition: "color 0.2s ease-in-out",
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
  uploadHistoryButton: {
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
  settingsButton: {
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
  chatIcon: {
    marginRight: "10px",
    fontSize: "18px",
  },
  chatText: {
    fontSize: "14px",
    color: "#ffffff",
  },
  welcomeContainer: {
    textAlign: "center",
    marginBottom: "auto",
  },
  chatLogo: {
    width: "200px",
    height: "200px",
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
  loadingContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    height: "100%",
  },
  spinner: {
    fontSize: "24px",
    color: "#4caf50",
  },
  loadingText: {
    fontSize: "18px",
    color: "#4caf50",
    fontWeight: "bold",
    margin: 0,
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
  analysisContainer: {
    width: "100%",
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#1C2639",
    borderRadius: "10px",
  },
  chatContainer: {
    width: "100%",
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#1C2639",
    borderRadius: "10px",
  },
  chatMessages: {
    maxHeight: "300px",
    overflowY: "auto",
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  userMessage: {
    backgroundColor: "#0066ff",
    color: "#ffffff",
    padding: "10px",
    borderRadius: "10px",
    alignSelf: "flex-end",
    maxWidth: "70%",
  },
  assistantMessage: {
    backgroundColor: "#2C3E50",
    color: "#ffffff",
    padding: "10px",
    borderRadius: "10px",
    alignSelf: "flex-start",
    maxWidth: "70%",
  },
  chatInput: {
    display: "flex",
    gap: "10px",
  },
  input: {
    flex: 1,
    backgroundColor: "#1C2639",
    border: "1px solid #2C3E50",
    color: "#ffffff",
    fontSize: "16px",
    padding: "10px",
    borderRadius: "6px",
    outline: "none",
  },
  sendButton: {
    backgroundColor: "#0066ff",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    padding: "10px 20px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default ChatPage;
