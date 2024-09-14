import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:8020/api/auth/login', { username, password })
      .then((response) => {
        const { token } = response.data;
        localStorage.setItem('authToken', token); 
        navigate('/'); 
      })
      .catch((error) => {
        setError('Invalid username or password');
        console.error('Login error:', error);
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
    buttonHover: {
      backgroundColor: '#ffd700',
    },
    error: {
      color: '#d9534f', 
      marginTop: '15px',
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      marginBottom: '25px',
      color: '#0056a3', 
    },
    registerLink: {
      marginTop: '20px',
      display: 'block',
      color: '#0056a3',
      textDecoration: 'none',
      fontSize: '16px',
      fontWeight: 'bold',
    },
    registerLinkHover: {
      textDecoration: 'underline',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <h2 style={styles.title}>Sri Lanka Railway Login</h2>
        <form onSubmit={handleLogin}>
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
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
        {error && <p style={styles.error}>{error}</p>}
        <a href="/register" style={styles.registerLink}>
          Register Now
        </a>
      </div>
    </div>
  );
}

export default Login;
