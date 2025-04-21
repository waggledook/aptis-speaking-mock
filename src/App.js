// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 1) import your loader
import { loadAudio } from './utils/audioWeb';

import OpeningScreen from './components/OpeningScreen';
import InstructionsScreen from './components/InstructionsScreen';
import Part1Question from './components/Part1Question';
import Part2Presentation from './components/Part2Presentation';
import Part3Discussion from './components/Part3Discussion';
import EndScreen from './components/EndScreen';
import MicTest from './components/MicTest';


function App() {
  // 2) preload all the audio buffers on mount
  useEffect(() => {
    Promise.all([
      loadAudio('beep',   '/audio/beep.mp3'),
      loadAudio('p1_q1', '/audio/part1-question1.mp3'),
      loadAudio('p1_q2', '/audio/part1-question2.mp3'),
      loadAudio('p1_q3', '/audio/part1-question3.mp3'),
      loadAudio('p2_i',  '/audio/part2-instructions.mp3'),
      loadAudio('p2_qs', '/audio/part2-questions.mp3'),
      loadAudio('p2_s',  '/audio/part2-start.mp3'),
      loadAudio('p3_i1', '/audio/part3-instructions.mp3'),
      loadAudio('p3_i2', '/audio/part3-moreinstructions.mp3'),
      loadAudio('p3_s',  '/audio/part3-start.mp3'),
      loadAudio('p3_fu', '/audio/part3-followup.mp3'),
    ]).catch(err => console.error('Audio preload failed:', err));
  }, []);

  return (
    <div className="app-container">
      <BrowserRouter>
        <Routes>
          {/* Mic‑check before you start Part 1 */}
          <Route path="/speaking/mictest" element={<MicTest />} />

          {/* Opening screen at “/” */}
          <Route path="/" element={<OpeningScreen />} />

          {/* Instructions at “/speaking/instructions” */}
          <Route
            path="/speaking/instructions"
            element={<InstructionsScreen />}
          />

          {/* Part 1 questions */}
          <Route
            path="/speaking/part1/:qIndex"
            element={<Part1Question />}
          />

          {/* Part 2 */}
          <Route
            path="/speaking/part2"
            element={<Part2Presentation />}
          />

          {/* Part 3 */}
          <Route
            path="/speaking/part3"
            element={<Part3Discussion />}
          />

          {/* End screen */}
          <Route path="/speaking/end" element={<EndScreen />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
