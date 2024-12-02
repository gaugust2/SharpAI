import React, { useState, useEffect } from 'react';

function SettingsPage() {
  const [tosAccepted, setTosAccepted] = useState(false);
  const [theme, setTheme] = useState('light');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    // Load saved preferences from local storage
    const tosStatus = localStorage.getItem('tosAccepted') === 'true';
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedNotifications = localStorage.getItem('notificationsEnabled') === 'true';

    setTosAccepted(tosStatus);
    setTheme(savedTheme);
    setNotificationsEnabled(savedNotifications);
  }, []);

  const handleThemeChange = (e) => {
    const newTheme = e.target.value;
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    alert(`Theme updated to ${newTheme}`);
  };

  const toggleNotifications = () => {
    const newStatus = !notificationsEnabled;
    setNotificationsEnabled(newStatus);
    localStorage.setItem('notificationsEnabled', newStatus);
    alert(`Notifications ${newStatus ? 'enabled' : 'disabled'}`);
  };

  const handleRevisitTos = () => {
    alert('Redirecting to Terms of Service.');
    window.location.href = '/terms'; // Navigate to ToS page
  };

  const resetSettings = () => {
    localStorage.setItem('theme', 'light');
    localStorage.setItem('notificationsEnabled', true);
    setTheme('light');
    setNotificationsEnabled(true);
    alert('Settings have been reset to default.');
  };

  return (
    <div style={{ ...styles.container, backgroundColor: theme === 'dark' ? '#1C2639' : '#f5f5f5', color: theme === 'dark' ? '#ffffff' : '#000000' }}>
      <h2 style={styles.header}>Settings</h2>
      <div style={styles.setting}>
        <span>Terms of Service: {tosAccepted ? 'Accepted' : 'Not Accepted'}</span>
        <button onClick={handleRevisitTos} style={styles.button}>
          View Terms
        </button>
      </div>
      <div style={styles.setting}>
        <span>Theme:</span>
        <select value={theme} onChange={handleThemeChange} style={styles.select}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      <div style={styles.setting}>
        <span>Notifications:</span>
        <button onClick={toggleNotifications} style={styles.button}>
          {notificationsEnabled ? 'Disable' : 'Enable'}
        </button>
      </div>
      <div style={styles.setting}>
        <button onClick={resetSettings} style={styles.resetButton}>
          Reset Settings
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    minHeight: '100vh',
    transition: 'background-color 0.3s, color 0.3s', // Smooth transition for theme changes
  },
  header: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  setting: {
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#0066ff',
    color: '#ffffff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  resetButton: {
    padding: '10px 15px',
    backgroundColor: '#ff0033',
    color: '#ffffff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  select: {
    padding: '5px',
    borderRadius: '5px',
  },
};

export default SettingsPage;
