import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function BettingPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    league: 'NBA',
    selectedTeamCity: '',
    selectedTeamName: '',
    opposingTeamCity: '',
    opposingTeamName: '',
    date: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Updated recent items structure
  const recentItems = [
    {
      league: 'NBA',
      match: 'Toronto Raptors vs Boston Celtics',
      bet: 'Toronto Raptors to Win',
      date: '2024-12-01',
    },
    {
      league: 'NFL',
      match: 'New England Patriots vs Miami Dolphins',
      bet: 'Miami Dolphins to Win',
      date: '2024-12-03',
    },
    {
      league: 'MLB',
      match: 'New York Yankees vs Boston Red Sox',
      bet: 'New York Yankees to Win',
      date: '2024-12-05',
    },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dateRegex = /^\d{4}\/\d{2}\/\d{2}$|^\d{2}\/\d{2}\/\d{4}$|^\d{2}-\d{2}-\d{4}$|^\w+\s\d{1,2}\s\d{4}$/;
    if (!dateRegex.test(formData.date)) {
      setMessage({ type: 'error', text: 'Invalid date format. Use formats like 2024/10/22 or October 22 2024.' });
      return;
    }

    const payload = {
      league: formData.league,
      selectedTeam: {
        city: formData.selectedTeamCity,
        name: formData.selectedTeamName,
      },
      opposingTeam: {
        city: formData.opposingTeamCity,
        name: formData.opposingTeamName,
      },
      date: formData.date,
    };

    try {
      setLoading(true);
      setMessage(null);

      const response = await fetch('http://localhost:3000/betslip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      setMessage({ type: 'success', text: `Bet submitted successfully: ${JSON.stringify(result)}` });
    } catch (error) {
      setMessage({ type: 'error', text: `Error: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h1 style={styles.title}>SharpAI</h1>
        <button style={styles.newChatButton} onClick={() => navigate('/chat')}>
          + New Chat
        </button>
        <button style={styles.newChatButton} onClick={() => navigate('/betting')}>
          Betting Slip
        </button>
        <button style={styles.newChatButton} onClick={() => navigate('/settings')}>
          Settings
        </button>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
        <div style={styles.recentChats}>
          <h2 style={styles.recentTitle}>Recent Bets</h2>
          {recentItems.map((item, index) => (
            <div key={index} style={styles.chatItem}>
              <h3 style={styles.recentItemLeague}>{item.league}</h3>
              <p style={styles.recentItemMatch}>{item.match}</p>
              <p style={styles.recentItemBet}>{item.bet}</p>
              <p style={styles.recentItemDate}>Date: {item.date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <h2 style={styles.header}>Betting Slip</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.fieldContainer}>
            <label style={styles.label}>League:</label>
            <select
              name="league"
              value={formData.league}
              onChange={handleChange}
              style={styles.input}
              disabled={loading}
            >
              <option value="NBA">NBA</option>
              <option value="NFL">NFL</option>
              <option value="MLB">MLB</option>
            </select>
          </div>
          <div style={styles.fieldContainer}>
            <label style={styles.label}>Selected Team City:</label>
            <input
              type="text"
              name="selectedTeamCity"
              value={formData.selectedTeamCity}
              onChange={handleChange}
              required
              style={styles.input}
              disabled={loading}
            />
          </div>
          <div style={styles.fieldContainer}>
            <label style={styles.label}>Selected Team Name:</label>
            <input
              type="text"
              name="selectedTeamName"
              value={formData.selectedTeamName}
              onChange={handleChange}
              required
              style={styles.input}
              disabled={loading}
            />
          </div>
          <div style={styles.fieldContainer}>
            <label style={styles.label}>Opposing Team City:</label>
            <input
              type="text"
              name="opposingTeamCity"
              value={formData.opposingTeamCity}
              onChange={handleChange}
              required
              style={styles.input}
              disabled={loading}
            />
          </div>
          <div style={styles.fieldContainer}>
            <label style={styles.label}>Opposing Team Name:</label>
            <input
              type="text"
              name="opposingTeamName"
              value={formData.opposingTeamName}
              onChange={handleChange}
              required
              style={styles.input}
              disabled={loading}
            />
          </div>
          <div style={styles.fieldContainer}>
            <label style={styles.label}>Date:</label>
            <input
              type="text"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              style={styles.input}
              disabled={loading}
            />
          </div>
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Bet'}
          </button>
        </form>
        {message && (
          <p style={message.type === 'error' ? styles.errorMessage : styles.successMessage}>{message.text}</p>
        )}
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
    marginBottom: '20px',
  },
  logoutButton: {
    backgroundColor: '#ffffff',
    color: '#0066ff',
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    marginTop: 'auto',
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
    marginBottom: '15px',
    padding: '10px',
    backgroundColor: '#1C2639',
    borderRadius: '5px',
  },
  recentItemLeague: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: '5px',
  },
  recentItemMatch: {
    fontSize: '14px',
    color: '#bbbbbb',
  },
  recentItemBet: {
    fontSize: '14px',
    color: '#bbbbbb',
  },
  recentItemDate: {
    fontSize: '12px',
    color: '#888888',
  },
  mainContent: {
    flex: 1,
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  header: {
    fontSize: '32px',
    marginBottom: '20px',
  },
  fieldContainer: {
    marginBottom: '15px',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '400px',
  },
  label: {
    fontSize: '14px',
    marginBottom: '5px',
    color: '#bbbbbb',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #1C2639',
    backgroundColor: '#1C2639',
    color: '#ffffff',
  },
  button: {
    marginTop: '20px',
    backgroundColor: '#0066ff',
    color: '#ffffff',
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  successMessage: {
    marginTop: '20px',
    fontSize: '16px',
    color: 'green',
  },
  errorMessage: {
    marginTop: '20px',
    fontSize: '16px',
    color: 'red',
  },
};

export default BettingPage;
