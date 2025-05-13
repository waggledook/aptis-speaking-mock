// src/components/InstructionsScreen.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { resumeAudio } from '../utils/audioWeb';

export default function InstructionsScreen() {
  const navigate = useNavigate();

  const handleBegin = () => {
    // 1) Unlock Web Audio playback (must be inside a user gesture)
    resumeAudio();
    // 2) Now navigate to Part 1
    navigate('/speaking/mictest');
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Aptis General Speaking Test Instructions</h1>
<h2>Speaking</h2>
<p>You will answer some questions about yourself and then do three short speaking tasks.</p>
<p>Listen to the instructions and speak clearly into your microphone when you hear the signal.</p>
<p>Each part of the test will appear automatically.</p>
<p>The test will take about 12 minutes.</p>
<p>When you click on the 'Next' button, the test will begin.</p>

      <button
        className="btn btn-primary"
        style={{ marginTop: '2rem' }}
        onClick={handleBegin}
      >
        Begin Part 1
      </button>
    </div>
  );
}
