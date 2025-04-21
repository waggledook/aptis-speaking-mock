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
    navigate('/speaking/part1/1');
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Speaking Instructions</h2>
      <p>
        Part 1: You’ll see two pictures and answer three questions.<br/>
        You have <strong>45 seconds</strong> per question.<br/>
        Speak clearly when you hear the beep.
      </p>

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
