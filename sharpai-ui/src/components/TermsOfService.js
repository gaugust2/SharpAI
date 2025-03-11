import React from "react";
import { useNavigate } from "react-router-dom";

function TermsOfService() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("token"); // Check if the user is logged in

  const handleAccept = () => {
    // Save acceptance status and navigate to the signup page
    localStorage.setItem("tosAccepted", true); // Save acceptance status
    navigate("/signup"); // Redirect to the signup page
  };

  const handleDecline = () => {
    alert("You must accept the Terms of Service to continue.");
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Terms of Service</h2>
      <div style={styles.tosContent}>
        <p>Welcome to SharpAI! By using this app, you agree to the following terms...</p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
          scelerisque leo at nisi tincidunt, nec tincidunt nisi tincidunt. Nulla
          facilisi. Sed euismod, nisl nec aliquam tincidunt, nunc nisl aliquam
          nisl, nec aliquam nisl nisl nec nisl. Sed euismod, nisl nec aliquam
          tincidunt, nunc nisl aliquam nisl, nec aliquam nisl nisl nec nisl.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
          scelerisque leo at nisi tincidunt, nec tincidunt nisi tincidunt. Nulla
          facilisi. Sed euismod, nisl nec aliquam tincidunt, nunc nisl aliquam
          nisl, nec aliquam nisl nisl nec nisl. Sed euismod, nisl nec aliquam
          tincidunt, nunc nisl aliquam nisl, nec aliquam nisl nisl nec nisl.
        </p>
      </div>
      <div style={styles.buttonContainer}>
        {/* Show "Accept" and "Decline" buttons only if the user is not logged in */}
        {!isLoggedIn && (
          <>
            <button onClick={handleAccept} style={styles.acceptButton}>
              Accept
            </button>
            <button onClick={handleDecline} style={styles.declineButton}>
              Decline
            </button>
          </>
        )}
        {/* Always show the "Go Back" button */}
        <button onClick={handleGoBack} style={styles.goBackButton}>
          Go Back
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#0C111B",
    color: "#ffffff",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  header: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  tosContent: {
    maxHeight: "400px",
    overflowY: "scroll",
    marginBottom: "20px",
    padding: "10px",
    backgroundColor: "#1C2639",
    borderRadius: "5px",
    width: "80%",
  },
  buttonContainer: {
    display: "flex",
    gap: "10px",
  },
  acceptButton: {
    padding: "10px 20px",
    backgroundColor: "#0066ff",
    color: "#ffffff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  declineButton: {
    padding: "10px 20px",
    backgroundColor: "#ff0033",
    color: "#ffffff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  goBackButton: {
    padding: "10px 20px",
    backgroundColor: "#555",
    color: "#ffffff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default TermsOfService;