import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2

function SettingsPage() {
  const navigate = useNavigate();
  const [tosAccepted, setTosAccepted] = useState(false);
  const [theme, setTheme] = useState("light");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    // Load saved preferences from local storage
    const tosStatus = localStorage.getItem("tosAccepted") === "true";
    const savedTheme = localStorage.getItem("theme") || "light";
    const savedNotifications =
      localStorage.getItem("notificationsEnabled") === "true";

    setTosAccepted(tosStatus);
    setTheme(savedTheme);
    setNotificationsEnabled(savedNotifications);
  }, []);

  const handleThemeChange = (e) => {
    const newTheme = e.target.value;
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    Swal.fire({
      icon: "success",
      title: "Theme updated!",
      text: `Theme updated to ${newTheme}`,
    });
  };

  const toggleNotifications = () => {
    const newStatus = !notificationsEnabled;
    setNotificationsEnabled(newStatus);
    localStorage.setItem("notificationsEnabled", newStatus);
    Swal.fire({
      icon: "success",
      title: "Notifications updated!",
      text: `Notifications ${newStatus ? "enabled" : "disabled"}`,
    });
  };

  const handleRevisitTos = () => {
    navigate("/terms"); // Navigate to the Terms of Service page
  };

  const resetSettings = () => {
    localStorage.setItem("theme", "dark");
    localStorage.setItem("notificationsEnabled", true);
    setTheme("dark");
    setNotificationsEnabled(true);
    Swal.fire({
      icon: "success",
      title: "Settings reset!",
      text: "Settings have been reset to default.",
    });
  };

  return (
    <div
      style={{
        ...styles.container,
        backgroundColor: theme === "dark" ? "#1C2639" : "#f5f5f5",
        color: theme === "dark" ? "#ffffff" : "#000000",
      }}
    >
      {/* Sidebar */}
      <div className="d-flex flex-column p-3" style={styles.sidebar}>
        <h1 className="fs-4 fw-bold mb-4" style={styles.title}>
          SharpAI
        </h1>
        <button
          onClick={() => navigate("/chat")}
          className="btn btn-primary mb-3"
          style={styles.newChatButton}
        >
          Back to Chat
        </button>
      </div>

      {/* Settings Content */}
      <div style={styles.settingsContent}>
        <h2 style={styles.header}>Settings</h2>
        <div style={styles.setting}>
          <span>
            Terms of Service: {tosAccepted ? "Accepted" : "Not Accepted"}
          </span>
          <button onClick={handleRevisitTos} style={styles.button}>
            View Terms
          </button>
        </div>
        <div style={styles.setting}>
          <span>Theme:</span>
          <select
            value={theme}
            onChange={handleThemeChange}
            style={styles.select}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <div style={styles.setting}>
          <span>Notifications:</span>
          <button onClick={toggleNotifications} style={styles.button}>
            {notificationsEnabled ? "Disable" : "Enable"}
          </button>
        </div>
        <div style={styles.setting}>
          <button onClick={resetSettings} style={styles.resetButton}>
            Reset Settings
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
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
  settingsContent: {
    flex: 1,
    padding: "20px",
  },
  header: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  setting: {
    marginBottom: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    padding: "10px 15px",
    backgroundColor: "#0066ff",
    color: "#ffffff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  resetButton: {
    padding: "10px 15px",
    backgroundColor: "#ff0033",
    color: "#ffffff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  select: {
    padding: "5px",
    borderRadius: "5px",
  },
};

export default SettingsPage;
