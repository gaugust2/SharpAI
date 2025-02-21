import { useState } from "react";
import { useNavigate } from "react-router-dom";
import chatLogo from "../assets/Frame 1216258384.svg";

const BettingHistoryUpload = () => {
  const [league, setLeague] = useState("");
  const [selectedTeamCity, setSelectedTeamCity] = useState("");
  const [selectedTeamName, setSelectedTeamName] = useState("");
  const [opposingTeamCity, setOpposingTeamCity] = useState("");
  const [opposingTeamName, setOpposingTeamName] = useState("");
  const [date, setDate] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Create FormData to handle both text inputs and files
    const formData = new FormData();
    formData.append("league", league);
    formData.append("selectedTeamCity", selectedTeamCity);
    formData.append("selectedTeamName", selectedTeamName);
    formData.append("opposingTeamCity", opposingTeamCity);
    formData.append("opposingTeamName", opposingTeamName);
    formData.append("date", date);

    // Append each file to formData
    selectedFiles.forEach((file, index) => {
      formData.append(`file${index}`, file);
    });

    // Handle form submission logic here
    console.log("Form Data:", formData);
  };

  return (
    <div className="d-flex min-vh-100" style={styles.container}>
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
              Upload History
            </span>
          </div>
        </div>
      </div>

      {/* Main Window */}
      <div style={styles.chatWindow}>
        <div style={styles.welcomeContainer}>
          <img src={chatLogo} alt="Chat Logo" style={styles.chatLogo} />
          <h2 style={styles.welcomeMessage}>Upload Betting History</h2>
          <p style={styles.subMessage}>Enter your bet details below:</p>
        </div>

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
      </div>
    </div>
  );
};

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
    padding: "20px",
    backgroundColor: "#0C111B",
    height: "100vh",
  },
  welcomeContainer: {
    textAlign: "center",
    marginBottom: "10px",
  },
  chatLogo: {
    width: "80px",
    height: "80px",
    marginBottom: "10px",
  },
  welcomeMessage: {
    fontSize: "24px",
    marginBottom: "5px",
  },
  subMessage: {
    fontSize: "16px",
    color: "#bbbbbb",
    marginBottom: "15px",
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
};

export default BettingHistoryUpload;
