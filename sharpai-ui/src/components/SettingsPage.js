import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2

function SettingsPage() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    const savedNotifications =
      localStorage.getItem("notificationsEnabled") === "true";
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

  const handleDeleteAccount = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, your account cannot be recovered!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Make the DELETE request to delete the user
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}:3000/deleteUser`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          // Check if the response is successful
          if (response.ok) {
            const data = await response.json();
            Swal.fire("Deleted!", data.message, "success");
            localStorage.clear(); // Clear localStorage data
            navigate("/"); // Redirect to the login page after deletion
          } else {
            throw new Error("Failed to delete account");
          }
        } catch (error) {
          Swal.fire("Error", error.message, "error");
        }
      }
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
          <span>Terms of Service: Accepted</span>
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
        {/* Delete Account Button */}
        <div style={styles.setting}>
          <button onClick={handleDeleteAccount} style={styles.deleteButton}>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "row",
    height: "100vh",
  },
  sidebar: {
    width: "250px",
    backgroundColor: "#1C2639",
    color: "#ffffff",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#ffffff",
  },
  newChatButton: {
    backgroundColor: "#007BFF",
    color: "#ffffff",
  },
  settingsContent: {
    padding: "20px",
    flex: 1,
  },
  header: {
    fontSize: "22px",
    marginBottom: "20px",
  },
  setting: {
    marginBottom: "20px",
  },
  button: {
    backgroundColor: "#007BFF",
    color: "#ffffff",
    padding: "8px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  select: {
    padding: "8px 15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  resetButton: {
    backgroundColor: "#ffc107",
    color: "#fff",
    padding: "8px 15px",
    border: "none",
    cursor: "pointer",
  },
  deleteButton: {
    backgroundColor: "#ff0000", // Bright red
    color: "#fff",
    padding: "8px 15px", // Same padding as the reset button
    border: "none",
    borderRadius: "5px", // Optional: rounded corners
    cursor: "pointer",
    fontWeight: "bold", // Make the text bold
    textAlign: "center", // Ensure text is centered
  },
};

export default SettingsPage;
