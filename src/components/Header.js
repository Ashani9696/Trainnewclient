import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await axios.get('http://localhost:8020/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUsername(response.data.username);
          setRole(response.data.role);
        } catch (error) {
          console.error('Error fetching user:', error);
          localStorage.removeItem('authToken');
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    };
    fetchUser();
  }, [navigate]);

  const styles = {
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 30px',
      backgroundColor: '#003366',
      color: '#ffffff',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    logo: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#f9c513',
    },
    nav: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
    },
    navLink: {
      color: '#ffffff',
      textDecoration: 'none',
      fontSize: '18px',
      padding: '10px 15px',
      borderRadius: '5px',
      transition: 'background-color 0.3s ease, color 0.3s ease',
    },
    navLinkHover: {
      backgroundColor: '#0056a3',
      color: '#ffffff',
    },
    button: {
      backgroundColor: '#f9c513',
      color: '#003366',
      border: 'none',
      borderRadius: '8px',
      padding: '10px 20px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
      transition: 'background-color 0.3s ease',
    },
    buttonHover: {
      backgroundColor: '#ffd700',
    },
    usernameRole: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#ffffff',
      marginLeft: '20px',
      padding: '10px 15px',
      borderRadius: '5px',
      backgroundColor: '#0056a3',
      display: 'flex',
      alignItems: 'center',
    },
  };

  return (
    <header style={styles.header}>
      <div style={styles.logo}>Sri Lanka Railway</div>
      <nav style={styles.nav}>
        <Link
          to="/"
          style={styles.navLink}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.navLinkHover.backgroundColor}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = ''}
        >
          Home
        </Link>
        <Link
          to="/history"
          style={styles.navLink}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.navLinkHover.backgroundColor}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = ''}
        >
         Location History
        </Link>
        {username && (
          <div style={styles.usernameRole}>
            {username}
          </div>
        )}
        <button 
          onClick={handleLogout} 
          style={styles.button}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor} 
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
        >
          Logout
        </button>
      </nav>
    </header>
  );
};

export default Header;
