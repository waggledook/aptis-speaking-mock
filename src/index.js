// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { RecordingProvider } from './RecordingContext';  // ← add this

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RecordingProvider>          {/* ← wrap here */}
      <App />
    </RecordingProvider>
  </React.StrictMode>
);

reportWebVitals();
