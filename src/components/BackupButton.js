// src/components/BackupButton.js
import React, { useState } from 'react';
import axios from 'axios';

const BackupButton = () => {
  const [backupStatus, setBackupStatus] = useState('');

  const handleBackup = async () => {
    try {
      const response = await axios.post('http://localhost:8020/api/backup/trigger-backup');
      setBackupStatus(response.data);
    } catch (error) {
      setBackupStatus('Error running backup');
    }
  };

  const styles = {
    button: {
      padding: '10px 20px',
      backgroundColor: '#0056a3',
      color: '#ffffff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    message: {
      marginTop: '10px',
      color: backupStatus.includes('Error') ? 'red' : 'green',
    },
  };

  return (
    <div>
      <button style={styles.button} onClick={handleBackup}>Run Manual Backup</button>
      {backupStatus && <p style={styles.message}>{backupStatus}</p>}
    </div>
  );
};

export default BackupButton;
