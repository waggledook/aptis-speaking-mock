// src/components/Part3Intro.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate }                from 'react-router-dom';
import { playAudio, resumeAudio }     from '../utils/audioWeb';

export default function Part3Intro() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('locked'); // 'locked' -> 'intro'

  // once the user clicks “Begin Part Three” we enter the intro phase
  useEffect(() => {
    if (phase !== 'intro') return;

    // now play the audio chain, then go to the first question
    resumeAudio();
    playAudio('p3_i')
      .then(() => playAudio('beep'))
      .then(() => navigate('/speaking/part3/0'));
  }, [phase, navigate]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Speaking</h2>
      <h3>Prompt</h3>

      {phase === 'locked' ? (
        // Locked: only the button
        <button
          className="btn btn-primary"
          style={{ marginTop: '2rem' }}
          onClick={() => setPhase('intro')}
        >
          Begin Part Three
        </button>
      ) : (
        // Intro: show your exact instructions text
        <>
          <p
            style={{
              maxWidth: 600,
              margin: '1rem auto',
              whiteSpace: 'pre-wrap',
              textAlign: 'left'
            }}
          >
            Part Three - In this part, I'm going to ask you to compare two
            pictures, and I will then ask you two questions about them. You
            will have 45 seconds for each response.
          </p>
          <p>Begin speaking when you hear this sound.</p>
        </>
      )}
    </div>
  );
}
