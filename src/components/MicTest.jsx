// src/components/MicTest.jsx
import React, { useState, useRef } from 'react';
import Recorder from './Recorder';

export default function MicTest() {
  const [testing, setTesting] = useState(false);
  const [blobUrl, setBlobUrl] = useState(null);
  const timeoutRef = useRef(null);

  const startTest = () => {
    setBlobUrl(null);
    setTesting(true);

    // stop after 3 seconds
    timeoutRef.current = setTimeout(() => {
      setTesting(false);
    }, 3000);
  };

  const handleComplete = blob => {
    // give the user something to play back
    setBlobUrl(URL.createObjectURL(blob));
    clearTimeout(timeoutRef.current);
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

      {/* Playback */}
      {blobUrl && (
        <div style={{ marginTop: '1rem' }}>
          <p>Here’s your test clip—does it sound right?</p>
          <audio src={blobUrl} controls />
        </div>
      )}
    </div>
  );
}
