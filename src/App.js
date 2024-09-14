import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TrainList from './Pages/TrainList';
import TrainMap from './Pages/TrainDetail';
import TrainDetail from './Pages/TrainDetail';
import Register from './Pages/Register';
import Login from './Pages/Login';
import History from './Pages/History';
import TrainHistory from '../src/Pages/TrainHistory';

function App() {
  return (
    <Router>
      <div className="App">
        
        <Routes>

          <Route path="/" element={<TrainList />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/train/:id" element={<TrainDetail />} />
          <Route path="/map/:id" element={<TrainMap />} />
          <Route path="/history" element={<History />} />
          <Route path="/trainHistory/:engineId" element={<TrainHistory />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
