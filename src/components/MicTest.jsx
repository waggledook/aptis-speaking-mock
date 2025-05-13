// src/components/MicTest.jsx
import React, { useState, useRef } from 'react';
import { useNavigate }            from 'react-router-dom';
import Recorder                   from './Recorder';

export default function MicTest() {
  const navigate = useNavigate();
  const [testing, setTesting] = useState(false);
  const [blobUrl, setBlobUrl] = useState(null);
  const timeoutRef = useRef(null);

  const startTest = () => {
    setBlobUrl(null);
    setTesting(true);
    timeoutRef.current = setTimeout(() => {
      setTesting(false);
    }, 3000);
  };

  const handleComplete = blob => {
    clearTimeout(timeoutRef.current);
    setTesting(false);
    setBlobUrl(URL.createObjectURL(blob));
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Microphone Test</h2>
      <p>
        Click “Start Mic Test” and say something for 3 seconds. Then you’ll
        see a little player so you can confirm it actually recorded.
      </p>
      <button onClick={startTest} disabled={testing}>
        {testing ? '…Recording…' : 'Start Mic Test'}
      </button>

      {/* Invisible recorder */}
      <Recorder
        recording={testing}
        onRecordingComplete={handleComplete}
      />

      {/* Playback + Continue */}
      {blobUrl && (
        <>
          <div style={{ marginTop: '1rem' }}>
            <p>Here’s your test clip—does it sound right?</p>
            <audio src={blobUrl} controls />
          </div>
          <button
            className="btn btn-primary"
            style={{ marginTop: '1rem' }}
            onClick={() => navigate('/speaking/part1-intro')}
          >
            Continue to Part 1
          </button>
        </>
      )}
    </div>
  );
}