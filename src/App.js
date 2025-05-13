// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 1) import your loader
import { loadAudio } from './utils/audioWeb';

import OpeningScreen from './components/OpeningScreen';
import InstructionsScreen from './components/InstructionsScreen';
import Part1Intro from "./components/Part1Intro";
import Part1Question from './components/Part1Question';
import Part2Question     from './components/Part2Question';
import Part3Intro     from './components/Part3Intro';
import Part4Presentation from './components/Part4Presentation';
// import Part3Discussion from './components/Part3Discussion'; // no longer needed
import EndScreen from './components/EndScreen';
import MicTest from './components/MicTest';

function App() {
  // 2) preload all the audio buffers on mount
  useEffect(() => {
    Promise.all([
      // shared beep
      loadAudio('beep',   '/audio/beep.mp3'),
  
      // General Part 1 intro & questions
      loadAudio('p1_i',   '/audio/part1-instructions.mp3'),
      loadAudio('p1_q1',  '/audio/part1-question1.mp3'),
      loadAudio('p1_q2',  '/audio/part1-question2.mp3'),
      loadAudio('p1_q3',  '/audio/part1-question3.mp3'),
  
      // General Part 2 intro & questions
      loadAudio('p2_i',   '/audio/part2-instructions.mp3'),
      loadAudio('p2_q1',  '/audio/part2-question1.mp3'),
      loadAudio('p2_q2',  '/audio/part2-question2.mp3'),
      loadAudio('p2_q3',  '/audio/part2-question3.mp3'),
  
      // General Part 3 (reusing Advanced Part 1 audio)
      loadAudio('p3_i', '/audio/part3-instructions.mp3'),
      loadAudio('p3_q1',  '/audio/part3-question1.mp3'),
      loadAudio('p3_q2',  '/audio/part3-question2.mp3'),
      loadAudio('p3_q3',  '/audio/part3-question3.mp3'),
  
      // General Part 4 (reusing Advanced Part 2 audio)
      loadAudio('p4_i',   '/audio/part4-instructions.mp3'),
      loadAudio('p4_qs',  '/audio/part4-questions.mp3'),
      loadAudio('p4_s',   '/audio/part4-start.mp3'),
    ]).catch(err => console.error('Audio preload failed:', err));
  }, []);

  return (
    <div className="app-container">
      <BrowserRouter>
        <Routes>
          {/* Mic‑check before you start Part 1 */}
          <Route path="/speaking/mictest" element={<MicTest />} />

          {/* Opening screen at “/” */}
          <Route path="/" element={<OpeningScreen />} />

          {/* Instructions at “/speaking/instructions” */}
          <Route
            path="/speaking/instructions"
            element={<InstructionsScreen />}
          />

          {/* Part 1 intro screen */}
          <Route
            path="/speaking/part1-intro"
            element={<Part1Intro />}
          />

          {/* Part 1 */}
          <Route
            path="/speaking/part1/:qIndex"
            element={<Part1Question />}
          />

          {/* Part 2 */}
          <Route path="/speaking/part2" element={<Part2Question />} />

          {/* Part 4 */}
          <Route path="/speaking/part4" element={<Part4Presentation />} />

          {/* Part 3 intro & questions */}
          <Route path="/speaking/part3-intro" element={<Part3Intro />} />
          <Route path="/speaking/part3/:qIndex" element={<Part1Question />} />

          {/* End screen */}
          <Route path="/speaking/end" element={<EndScreen />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;