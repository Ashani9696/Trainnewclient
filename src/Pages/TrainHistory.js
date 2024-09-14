// src/Pages/TrainHistory.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';

const TrainHistory = () => {
  const { engineId } = useParams();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:8020/api/location-history/${engineId}`);
        setHistory(response.data);
      } catch (error) {
        console.error('Error fetching location history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [engineId]);

  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f1f4f8',
      minHeight: '100vh',
      padding: '20px',
    },
    historyTable: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '20px',
    },
    th: {
      backgroundColor: '#0056a3',
      color: '#ffffff',
      padding: '10px',
    },
    td: {
      padding: '10px',
      border: '1px solid #dddddd',
    },
  };

  return (
    <div style={styles.container}>
      <Header />
      <h1>Location History for Train {engineId}</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={styles.historyTable}>
          <thead>
            <tr>
              <th style={styles.th}>Timestamp</th>
              <th style={styles.th}>Location</th>
              <th style={styles.th}>Latitude</th>
              <th style={styles.th}>Longitude</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry, index) => (
              <tr key={index}>
                <td style={styles.td}>{new Date(entry.timestamp).toLocaleString()}</td>
                <td style={styles.td}>{entry.location}</td>
                <td style={styles.td}>{entry.latitude}</td>
                <td style={styles.td}>{entry.longitude}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TrainHistory;
