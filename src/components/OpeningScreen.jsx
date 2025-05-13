// src/components/OpeningScreen.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function OpeningScreen() {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
      <h1>Aptis General Practice Test</h1>
      <p>Speaking • 4 questions</p>

      {/* START BUTTON */}
      <button
        className="btn btn-primary"
        style={{ marginTop: '2rem' }}
        onClick={() => navigate('/speaking/instructions')}
      >
        Start Assessment
      </button>
    </div>
  );
}