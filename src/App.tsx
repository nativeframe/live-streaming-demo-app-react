import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Encoder from './components/Encoder';
import { ManifestPlayer } from './components/ManifestPlayer';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Encoder />} />
        <Route path="/encoder" element={<Encoder />} />
        <Route path="/player" element={<ManifestPlayer />} />
      </Routes>
    </Router>
  );
};

export default App;
