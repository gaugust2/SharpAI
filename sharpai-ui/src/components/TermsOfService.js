import React from 'react';
import { useNavigate } from 'react-router-dom';

function TermsOfService() {
  const navigate = useNavigate();

  const handleAccept = () => {
    localStorage.setItem('tosAccepted', true); // Save acceptance status
    alert('You have accepted the Terms of Service.');
    navigate('/signup'); // Redirect back to SignUp
  };

  const handleDecline = () => {
    alert('You must accept the Terms of Service to continue.');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Terms of Service</h2>
      <div style={styles.tosContent}>
        <p>Welcome to SharpAI! By using this app, you agree to the following terms...</p>
        <p>[Add detailed terms here]</p>
      </div>
      <div style={styles.buttonContainer}>
        <button onClick={handleAccept} style={styles.acceptButton}>
          Accept
        </button>
        <button onClick={handleDecline} style={styles.declineButton}>
          Decline
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#0C111B',
    color: '#ffffff',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  header: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  tosContent: {
    maxHeight: '300px',
    overflowY: 'scroll',
    marginBottom: '20px',
    padding: '10px',
    backgroundColor: '#1C2639',
    borderRadius: '5px',
    width: '80%',
  },
  buttonContainer: {
    display: 'flex',
    gap: '10px',
  },
  acceptButton: {
    padding: '10px 20px',
    backgroundColor: '#0066ff',
    color: '#ffffff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  declineButton: {
    padding: '10px 20px',
    backgroundColor: '#ff0033',
    color: '#ffffff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default TermsOfService;
