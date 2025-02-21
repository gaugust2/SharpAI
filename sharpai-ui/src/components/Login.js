import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        localStorage.setItem("token", data.token); // Save token to localStorage
        navigate("/chat");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100 bg-dark text-light p-3"
      style={styles.container}
    >
      <form
        onSubmit={handleSubmit}
        className="w-100 p-4 bg-secondary rounded shadow"
        style={styles.form}
      >
        <h2 className="text-center mb-4" style={styles.header}>
          Login to SharpAI
        </h2>

        <div className="mb-3">
          <label htmlFor="email" className="form-label" style={styles.label}>
            Email*
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            style={styles.input}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label" style={styles.label}>
            Password*
          </label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            style={styles.input}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          style={styles.button}
        >
          Login
        </button>

        <div className="mt-3 text-center" style={styles.footer}>
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-primary fw-bold"
            style={styles.signUpLink}
          >
            Sign Up
          </span>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#0C111B",
    color: "#ffffff",
  },
  form: {
    maxWidth: "400px",
    backgroundColor: "#071730",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
  },
  header: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  label: {
    color: "#bbbbbb",
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#1C2639",
    color: "#fff",
    border: "1px solid #1C2639",
  },
  button: {
    backgroundColor: "#0066ff",
    fontWeight: "bold",
  },
  footer: {
    color: "#bbbbbb",
  },
  signUpLink: {
    cursor: "pointer",
    color: "#4da6ff",
  },
};

export default Login;
