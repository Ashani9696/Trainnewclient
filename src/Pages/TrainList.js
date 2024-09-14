// src/pages/TrainList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const TrainList = () => {
  const [trains, setTrains] = useState([]);

  useEffect(() => {
    const fetchTrains = async () => {
      try {
        const response = await axios.get('http://localhost:8020/api/trains/get');
        setTrains(response.data);
      } catch (error) {
        console.error('Error fetching trains:', error);
      }
    };

    fetchTrains();
  }, []);

  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f1f4f8',
      minHeight: '100vh',
    },
    trainList: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      padding: '20px',
    },
    trainItem: {
      backgroundColor: '#ffffff',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      margin: '10px',
      textAlign: 'center',
      width: '250px',
    },
    img: {
      width: '200px',
      height: 'auto',
    },
    route: {
      fontSize: '18px',
      color: '#0056a3',
      textDecoration: 'none',
      display: 'block',
      marginTop: '10px',
    },
  };

  return (
    <div style={styles.container}>
      <Header />
      <div style={styles.trainList}>
        {trains.map((train) => (
          <div key={train._id} style={styles.trainItem}>
            <Link to={`/train/${train._id}`} style={styles.route}>
            <img src="/images/train.png" alt="Train Icon" style={styles.img} />
              <p>{train.route}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainList;
