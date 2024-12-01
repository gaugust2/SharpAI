import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [bettingBudget, setBettingBudget] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    if (!termsAccepted) {
      alert('You must accept the terms and conditions.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          email,
          password,
          bettingBudget: parseInt(bettingBudget, 10),
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert(data.message);
        localStorage.setItem('token', data.token); // save token locally
        navigate('/chat'); // go to chat 
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.header}>Get Started with SharpAI 👋</h2>
        <div style={styles.fieldContainer}>
          <label style={styles.label}>First Name*</label>
          <input
            type="text"
            placeholder="Enter first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.fieldContainer}>
          <label style={styles.label}>Betting Budget*</label>
          <input
            type="number"
            placeholder="Enter betting budget"
            value={bettingBudget}
            onChange={(e) => setBettingBudget(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.fieldContainer}>
          <label style={styles.label}>Email*</label>
          <input
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.fieldContainer}>
          <label style={styles.label}>Password*</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <small style={styles.passwordHint}>
            Contain a minimum of 8 characters
          </small>
        </div>
        <div style={styles.fieldContainer}>
          <label style={styles.label}>Confirm Password*</label>
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.checkboxContainer}>
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            style={styles.checkbox}
          />
          <span style={styles.checkboxText}>
            I accept SharpAI{' '}
            <a href="/" style={styles.link}>
              Terms & Conditions
            </a>
          </span>
        </div>
        <button type="submit" style={styles.button}>
          Sign up
        </button>
        <div style={styles.footer}>
          Already have an account?{' '}
          <span
            onClick={() => navigate('/')}
            style={styles.loginLink}
          >
            Login
          </span>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#0C111B',
    color: '#ffffff',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  form: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: '#071730',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    boxSizing: 'border-box', 
  },
  header: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
  },
  fieldContainer: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#bbbbbb',
    textAlign: 'left',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #1C2639',
    backgroundColor: '#1C2639',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  passwordHint: {
    fontSize: '12px',
    color: '#888',
    marginTop: '8px',
    textAlign: 'left',
    display: 'block',
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
  },
  checkbox: {
    marginRight: '10px',
    width: '16px',
    height: '16px',
  },
  checkboxText: {
    fontSize: '14px',
    color: '#bbbbbb',
  },
  link: {
    color: '#4da6ff',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  button: {
    width: '100%',
    padding: '12px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#0066ff',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
  },
  footer: {
    marginTop: '20px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#bbbbbb',
  },
  loginLink: {
    color: '#4da6ff',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default SignUp;
