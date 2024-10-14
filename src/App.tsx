import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Encoder } from './components/encoder/Encoder';
import { ManifestPlayer } from './components/player/ManifestPlayer';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/encoder" element={<Encoder />} />
      </Routes>
      <Routes>
        <Route path="/manifest" element={<ManifestPlayer />} />
      </Routes>
    </Router>
  );
};

export default App;
