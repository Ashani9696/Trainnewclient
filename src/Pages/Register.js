import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");

    axios
      .post("http://localhost:8020/api/auth/register", {
        username,
        password,
        role: "user",
      })
      .then((response) => {
        setSuccessMessage("Registration successful. Redirecting...");
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      })
      .catch((error) => {
        if (error.response?.status === 409) { // Assuming 409 status code for conflict
          setErrorMessage("Username already taken. Please choose another one.");
        } else {
          setErrorMessage(
            error.response?.data?.message || "An error occurred during registration"
          );
        }
      });
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f1f4f8',
      fontFamily: 'Arial, sans-serif',
    },
    formWrapper: {
      backgroundColor: '#ffffff',
      padding: '40px',
      borderRadius: '12px',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
      maxWidth: '400px',
      width: '100%',
      textAlign: 'center',
    },
    input: {
      width: '85%',
      padding: '15px',
      margin: '15px 0',
      border: '2px solid #0056a3',
      borderRadius: '8px',
      fontSize: '16px',
      outline: 'none',
    },
    button: {
      backgroundColor: '#f9c513',
      color: '#003366',
      padding: '14px 25px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '18px',
      fontWeight: 'bold',
      cursor: 'pointer',
      marginTop: '15px',
      width: '85%',
    },
    error: {
      color: '#d9534f',
      marginTop: '15px',
    },
    success: {
      color: '#28a745',
      marginTop: '15px',
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      marginBottom: '25px',
      color: '#0056a3',
    },
    linkButton: {
      backgroundColor: '#0056a3',
      color: '#fff',
      padding: '12px 20px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      cursor: 'pointer',
      marginTop: '15px',
      textDecoration: 'none',
      display: 'inline-block',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <h2 style={styles.title}>Register</h2>
        {errorMessage && <div style={styles.error}>{errorMessage}</div>}
        {successMessage && <div style={styles.success}>{successMessage}</div>}
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            style={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            style={styles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" style={styles.button}>Register</button>
        </form>
        <p>Already registered?</p>
        <button style={styles.linkButton} onClick={() => navigate('/login')}>
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default Register;
