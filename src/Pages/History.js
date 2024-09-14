import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';

const History = () => {
  const [locationHistory, setLocationHistory] = useState([]);
  const [isBackupRunning, setIsBackupRunning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10); // Number of records per page
  const [hasMore, setHasMore] = useState(true);

  const fetchLocationHistory = async (page) => {
    try {
      const response = await axios.get(`http://localhost:8020/api/location-history?page=${page}&size=${pageSize}`);
      const { data, totalPages } = response.data;

      if (Array.isArray(data)) {
        const uniqueTrains = new Map();

        data.forEach(train => {
          if (!uniqueTrains.has(train.engineId)) {
            uniqueTrains.set(train.engineId, train);
          }
        });

        const uniqueTrainList = Array.from(uniqueTrains.values());

        setLocationHistory(prevHistory => {
          const existingTrains = new Map(prevHistory.map(train => [train.engineId, train]));
          uniqueTrainList.forEach(train => existingTrains.set(train.engineId, train));
          return Array.from(existingTrains.values());
        });

        setHasMore(page < totalPages);
      } else {
        console.error('Data format error:', response.data);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching location history:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocationHistory(page);
  }, [page]);

  const runBackup = async () => {
    setIsBackupRunning(true);
    try {
      await axios.post('http://localhost:8020/api/backup/trigger-backup');
      alert('Backup completed successfully');
    } catch (error) {
      console.error('Error running backup:', error);
      alert('Error during backup');
    } finally {
      setIsBackupRunning(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f1f4f8',
      minHeight: '100vh',
      padding: '20px',
      boxSizing: 'border-box',
    },
    historyList: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '20px',
    },
    trainItem: {
      backgroundColor: '#ffffff',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      padding: '15px',
      margin: '10px',
      textAlign: 'center',
      width: '300px',
      height: '400px', // Fixed height for cards
      overflowY: 'auto',
      boxSizing: 'border-box',
    },
    header: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '10px',
    },
    travelHistory: {
      listStyleType: 'none',
      paddingLeft: '0',
      margin: '0',
    },
    travelHistoryItem: {
      marginBottom: '8px',
      fontSize: '14px',
    },
    backupButton: {
      backgroundColor: isBackupRunning ? '#ccc' : '#0056a3',
      color: '#fff',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '5px',
      cursor: isBackupRunning ? 'not-allowed' : 'pointer',
      marginTop: '20px',
      fontSize: '16px',
    },
    loadMoreButton: {
      backgroundColor: '#0056a3',
      color: '#fff',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '5px',
      cursor: 'pointer',
      marginTop: '20px',
      fontSize: '16px',
    },
    responsive: {
      '@media (max-width: 600px)': {
        trainItem: {
          width: '100%',
          height: 'auto',
        },
        backupButton: {
          fontSize: '14px',
        },
        loadMoreButton: {
          fontSize: '14px',
        },
      },
    },
  };

  return (
    <div style={styles.container}>
      <Header />
      <h2>Train Location History</h2>
      <div style={styles.historyList}>
        {loading ? (
          <div>Loading...</div>
        ) : (
          locationHistory.map((train) => (
            <div key={train.engineId} style={styles.trainItem}>
              <div style={styles.header}>{train.engineId}</div>
              <ul style={styles.travelHistory}>
                {train.travelHistory.map((historyItem, index) => (
                  <li key={index} style={styles.travelHistoryItem}>
                    <strong>Date:</strong> {new Date(historyItem.timestamp).toLocaleString()} <br />
                    <strong>Location:</strong> {historyItem.location} <br />
                    <strong>Lat:</strong> {historyItem.latitude}, <strong>Lng:</strong> {historyItem.longitude}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
      {hasMore && !loading && (
        <button style={styles.loadMoreButton} onClick={loadMore}>
          Load More
        </button>
      )}
      <button
        style={styles.backupButton}
        onClick={runBackup}
        disabled={isBackupRunning}
      >
        {isBackupRunning ? 'Running Backup...' : 'Run Backup Manually'}
      </button>
    </div>
  );
};

export default History;
