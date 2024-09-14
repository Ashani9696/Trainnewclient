import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import MyMap from './map';
import Modal from 'react-modal';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

Modal.setAppElement('#root'); // Required for accessibility

const TrainDetail = () => {
  const [train, setTrain] = useState(null);
  const [path, setPath] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null); // Default to null
  const [trainPosition, setTrainPosition] = useState(null); // Default to null
  const [newEngineId, setNewEngineID] = useState("");
  const [userRole, setUserRole] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const { id } = useParams();

  const handleChange = () => {
    axios
      .post(`http://localhost:8020/api/trains/switch-engine/${id}`, {
        newEngineId: newEngineId,
      })
      .then((response) => {
        setNewEngineID("");
        setModalMessage("Engine switched successfully!");
        setModalIsOpen(true);
        fetchTrainDetails(); // Update train details without refreshing the page
      })
      .catch((error) => {
        console.error("Error switching engine:", error);
        setModalMessage("Error switching engine.");
        setModalIsOpen(true);
      });
  };

  const fetchTrainDetails = async () => {
    try {
      const trainResponse = await axios.get(`http://localhost:8020/api/trains/get/${id}`);
      setTrain(trainResponse.data);
      setPath(trainResponse.data.path);
      setCurrentLocation(trainResponse.data.currentLocation);
      setTrainPosition(trainResponse.data.currentLocation); // Update trainPosition

      const token = localStorage.getItem('authToken');
      if (token) {
        const userResponse = await axios.get('http://localhost:8020/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserRole(userResponse.data.role);
      }
    } catch (error) {
      console.error('Error fetching details:', error);
    }
  };

  useEffect(() => {
    fetchTrainDetails();

    const interval = setInterval(() => {
      axios
        .get(`http://localhost:8020/api/trains/get/${id}`)
        .then((response) => {
          setCurrentLocation(response.data.currentLocation);
          setTrainPosition(response.data.currentLocation); // Update trainPosition
        })
        .catch((error) => console.error('Error fetching train details:', error));
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [id]);

  if (!train || currentLocation === null) return <div>Loading...</div>; // Ensure loading state if data is missing

  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f1f4f8',
      minHeight: '100vh',
    },
    header: {
      padding: '10px 20px',
      backgroundColor: '#003366',
      color: '#fff',
      textAlign: 'center',
    },
    content: {
      padding: '20px',
      maxWidth: '1200px',
      margin: 'auto',
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#0056a3',
    },
    sectionTitle: {
      fontSize: '22px',
      color: '#003366',
      marginTop: '20px',
      borderBottom: '2px solid #0056a3',
      paddingBottom: '10px',
    },
    listItem: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      padding: '15px',
      margin: '10px 0',
      textAlign: 'left',
    },
    input: {
      padding: '10px',
      margin: '10px 0',
      border: '1px solid #ccc',
      borderRadius: '5px',
      fontSize: '16px',
      width: 'calc(100% - 22px)',
    },
    button: {
      backgroundColor: '#f9c513',
      color: '#003366',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      fontSize: '16px',
      cursor: 'pointer',
      marginTop: '10px',
      transition: 'background-color 0.3s, transform 0.2s',
    },
    buttonHover: {
      backgroundColor: '#ffd700',
      transform: 'scale(1.05)',
    },
    mapContainer: {
      width: '100%',
      height: '400px',
      marginTop: '20px',
    },
    modal: {
      overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
      },
      content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)',
        width: '400px',
        textAlign: 'center',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        backgroundColor: '#fff',
        border: 'none',
      },
    },
  };

  return (
    <div style={styles.container}>
      <Header />
      <div style={styles.content}>
        <h2 style={styles.title}>Train Details - {train.route}</h2>
        <h3 style={styles.sectionTitle}>Engine History</h3>
        <ul>
          {train.engineHistory.map((engine, index) => (
            <li key={index} style={styles.listItem}>
              <strong>Engine ID:</strong> {engine.engineId} <br />
              <strong>Detached At:</strong> {engine.detachedAt ? new Date(engine.detachedAt).toLocaleString() : "Still Active"} <br />
              {engine.current && <strong>Current Engine - {train.route}</strong>}
            </li>
          ))}
        </ul>
        {userRole === 'admin' && (
          <>
            <h3 style={styles.sectionTitle}>Change the Engine</h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                placeholder="New Engine ID"
                value={newEngineId}
                onChange={(e) => setNewEngineID(e.target.value)}
                style={styles.input}
              />
              <button
                type="button"
                onClick={handleChange}
                style={styles.button}
              >
                Change Engine
              </button>
            </form>
          </>
        )}
        <div style={styles.mapContainer}>
          <MyMap
            key={id}
            path={path}
            currentLocation={currentLocation}
            trainPosition={trainPosition} 
          />
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={styles.modal}
      >
        <div style={{ marginBottom: '15px' }}>
          {modalMessage.includes('success') ? (
            <FaCheckCircle style={{ color: '#28a745', fontSize: '40px' }} />
          ) : (
            <FaTimesCircle style={{ color: '#dc3545', fontSize: '40px' }} />
          )}
        </div>
        <h2>{modalMessage}</h2>
        <button onClick={() => setModalIsOpen(false)} style={styles.button}>
          Close
        </button>
      </Modal>
    </div>
  );
};

export default TrainDetail;
