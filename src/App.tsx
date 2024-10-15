import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EncoderContext from './components/encoder/EncoderContext';
import { ManifestPlayer } from './components/player/ManifestPlayer';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/encoder" element={<EncoderContext />} />
      </Routes>
      <Routes>
        <Route path="/manifest" element={<ManifestPlayer />} />
      </Routes>
    </Router>
  );
};

export default App;
