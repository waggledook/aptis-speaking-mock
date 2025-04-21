// src/RecordingContext.js
import React, { createContext, useContext, useState } from 'react';

const RecordingContext = createContext();

export function RecordingProvider({ children }) {
  const [recordings, setRecordings] = useState([]);

  const addRecording = (blob, label) => {
    // Create a download URL for the blob
    const url = URL.createObjectURL(blob);
    // Infer extension from blob MIME type (e.g. "audio/webm")
    const extMatch = blob.type.match(/audio\/([^;]+)/);
    const ext = extMatch ? extMatch[1] : 'webm';

    setRecordings(prev => [
      ...prev,
      {
        blob,
        url,
        label,
        filename: `${label.replace(/\s+/g, '_')}.${ext}`
      }
    ]);
  };

  return (
    <RecordingContext.Provider value={{ recordings, addRecording }}>
      {children}
    </RecordingContext.Provider>
  );
}

export function useRecordings() {
  return useContext(RecordingContext);
}