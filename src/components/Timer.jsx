// src/components/Timer.jsx
import React, { useState, useEffect } from 'react';

export default function Timer({ duration, onExpire }) {
  const [sec, setSec] = useState(duration);

  useEffect(() => {
    if (sec === 0) {
      onExpire();
      return;
    }
    const id = setTimeout(() => setSec(sec - 1), 1000);
    return () => clearTimeout(id);
  }, [sec, onExpire]);

  return (
    <div style={{ fontSize: '2rem', margin: '1rem 0' }}>
      {sec}s
    </div>
  );
}
