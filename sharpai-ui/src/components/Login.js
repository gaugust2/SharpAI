import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        toast.success(data.message); // Success notification
        localStorage.setItem("token", data.token);
        setTimeout(() => navigate("/chat"), 1500); // Redirect after 1.5s
      } else {
        toast.error(data.message); // Error notification
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form} className="w-100">
        <h2 style={styles.header} className="text-center fw-bold mb-3">
          Welcome Back 👋
        </h2>

        <div style={styles.fieldContainer} className="mb-3">
          <label style={styles.label} className="form-label">
            Email*
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            style={styles.input}
          />
        </div>

        <div style={styles.fieldContainer} className="mb-3">
          <label style={styles.label} className="form-label">
            Password*
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            style={styles.input}
          />
        </div>

        <button type="submit" style={styles.button} className="btn btn-primary">
          Loginverihrohvi
        </button>

        <div style={styles.footer} className="mt-3 text-center">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            style={styles.signUpLink}
            className="cursor-pointer"
          >
            Sign Up
          </span>
        </div>
      </form>

      {/* Add ToastContainer */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#0C111B",
    color: "#ffffff",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  form: {
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "#071730",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
    boxSizing: "border-box",
  },
  header: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
  },
  fieldContainer: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    marginBottom: "8px",
    fontWeight: "bold",
    color: "#bbbbbb",
    textAlign: "left",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #1C2639",
    backgroundColor: "#1C2639",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#0066ff",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
  },
  footer: {
    marginTop: "20px",
    textAlign: "center",
    fontSize: "14px",
    color: "#bbbbbb",
  },
  signUpLink: {
    color: "#4da6ff",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Login;
