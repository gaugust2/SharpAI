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
        <p>Welcome to <strong>SharpAI</strong>! By using this app, you agree to the following terms:</p>

        <h3>1. Acceptance of Terms</h3>
        <p>
          By using the App, you confirm that you are at least 19 years old (or the legal age for gambling in your jurisdiction), have read, understood, and agree to these Terms. You are responsible for complying with all applicable laws and regulations related to sports betting in your jurisdiction.
        </p>

        <h3>2. Description of Services</h3>
        <p>
          SharpAI provides an AI-powered platform designed to assist users in analyzing sports betting opportunities. The App offers bet slip analysis, historical data insights, predictive analytics, and chat-based support for betting-related queries. <strong>Note:</strong> SharpAI does not guarantee the accuracy of its predictions or analyses. Sports betting involves risk, and you should use the App at your own discretion.
        </p>

        <h3>3. User Responsibilities</h3>
        <p>
          As a user of SharpAI, you agree to provide accurate and complete information during registration, use the App only for lawful purposes, and not engage in fraudulent or illegal activities. You must not share your account credentials with others or attempt to reverse-engineer, hack, or exploit the App.
        </p>

        <h3>4. Intellectual Property</h3>
        <p>
          All content, features, and functionality of the App, including software, algorithms, text, graphics, and logos, are the exclusive property of SharpAI and its licensors. You may not reproduce, distribute, or create derivative works without prior written consent from SharpAI.
        </p>

        <h3>5. Privacy Policy</h3>
        <p>
          Your use of the App is also governed by our <strong>Privacy Policy</strong>, which explains how we collect, use, and protect your personal data. By using the App, you consent to the practices described in the Privacy Policy.
        </p>

        <h3>6. Prohibited Activities</h3>
        <p>
          You must not use the App to promote or engage in illegal gambling activities, harass, defame, or harm others, attempt to gain unauthorized access to the App or its systems, or use automated tools (e.g., bots, scrapers) to interact with the App.
        </p>

        <h3>7. Disclaimer of Warranties</h3>
        <p>
          The App is provided "as is" and "as available" without any warranties, express or implied. SharpAI does not guarantee the accuracy, reliability, or completeness of the App's predictions or analyses, that the App will be error-free or uninterrupted, or that the App will meet your specific needs or expectations.
        </p>

        <h3>8. Limitation of Liability</h3>
        <p>
          To the fullest extent permitted by law, SharpAI and its affiliates shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the App or any losses or damages resulting from sports betting decisions made based on the App's analyses.
        </p>

        <h3>9. Indemnification</h3>
        <p>
          You agree to indemnify and hold harmless SharpAI, its affiliates, and their respective officers, directors, employees, and agents from any claims, liabilities, damages, or expenses arising from your use of the App, your violation of these Terms, or your violation of any applicable laws or regulations.
        </p>

        <h3>10. Termination</h3>
        <p>
          SharpAI reserves the right to suspend or terminate your access to the App at any time, with or without notice, and to modify or discontinue the App at any time.
        </p>

        <h3>11. Governing Law</h3>
        <p>
          These Terms are governed by and construed in accordance with the laws of [Insert Jurisdiction]. Any disputes arising from these Terms shall be resolved exclusively in the courts of [Insert Jurisdiction].
        </p>

        <h3>12. Changes to Terms</h3>
        <p>
          SharpAI may update these Terms from time to time. We will notify you of any changes by posting the updated Terms on the App. Your continued use of the App after such changes constitutes your acceptance of the updated Terms.
        </p>

        <h3>13. Contact Us</h3>
        <p>
          If you have any questions or concerns about these Terms, please contact us at:
          <br />
          <strong>Email:</strong> SharpAIBusiness@gmail.com
          <br />
          <strong>Address:</strong> 1151 Richmond St, London, ON N6A 3K7
        </p>

        <p>
          By using SharpAI, you acknowledge that you have read, understood, and agree to these Terms and Conditions.
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