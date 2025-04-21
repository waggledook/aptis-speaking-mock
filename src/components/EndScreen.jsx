// src/components/EndScreen.jsx
import React from 'react';
import { useRecordings } from '../RecordingContext';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default function EndScreen() {
  const { recordings } = useRecordings();

  function downloadAll() {
    const zip = new JSZip();
    recordings.forEach(({ blob, filename }) => {
      zip.file(filename, blob);
    });
    zip.generateAsync({ type: 'blob' }).then(content => {
      saveAs(content, 'aptis-speaking-responses.zip');
    });
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>That's the end of the test!</h2>
      <p>You can download each of your responses below:</p>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {recordings.map((r, i) => (
          <li key={i} style={{ marginBottom: '0.5rem' }}>
            {r.label}{' '}
            <a
              className="btn btn-secondary"
              href={r.url}
              download={r.filename}
            >
              Download
            </a>
          </li>
        ))}
      </ul>

      {recordings.length > 1 && (
        <button
          className="btn btn-primary"
          style={{ marginTop: '1rem' }}
          onClick={downloadAll}
        >
          Download All as ZIP
        </button>
      )}
    </div>
  );
}
