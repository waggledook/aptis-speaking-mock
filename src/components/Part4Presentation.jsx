// src/components/Part4Presentation.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate }                from 'react-router-dom';
import Timer                          from './Timer';
import Recorder                       from './Recorder';
import { useRecordings }              from '../RecordingContext';
import { playAudio, resumeAudio, stopAllAudio } from '../utils/audioWeb';
import { generalPart4 }               from '../data/prompts';

export default function Part4Presentation() {
  const navigate        = useNavigate();
  const { addRecording } = useRecordings();
  const { image, instructionText, questions } = generalPart4;
  const total = questions.length;

  // phases: locked → intro → prep → speak → done
  const [phase, setPhase]   = useState('locked');
  const [seconds, setSeconds] = useState(0);

  // 1) User hits “Begin Part Four”
  const handleBegin = () => {
    resumeAudio();       // unlock the AudioContext
    setPhase('intro');   // move into the audio chain
  };

  // 2) Play instructions → beep → questions → enter prep
  useEffect(() => {
    if (phase !== 'intro') return;
    playAudio('p4_i')
      .then(() => playAudio('beep'))
      .then(() => playAudio('p4_qs'))
      .then(() => {
        setPhase('prep');
        setSeconds(60);
      });
  }, [phase]);

  // 3) Prep countdown (1 minute) → at 0, start “speak”
  useEffect(() => {
    if (phase !== 'prep') return;

    if (seconds <= 0) {
      playAudio('p4_s')            // start tone
        .then(() => playAudio('beep'))
        .then(() => {
          setPhase('speak');
          setSeconds(120);
        });
      return;
    }

    const id = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, seconds]);

  // 4) Speak countdown (2 minutes) → at 0, finish
  useEffect(() => {
    if (phase !== 'speak') return;

    if (seconds <= 0) {
      setPhase('done');
      setTimeout(() => navigate('/speaking/end'), 500);
      return;
    }

    const id = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, seconds, navigate]);

  // 5) Cleanup any playing audio on unmount
  useEffect(() => () => stopAllAudio(), []);

  // — Render —

  // Locked splash screen
  if (phase === 'locked') {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Part Four</h2>
        <button className="btn btn-primary" onClick={handleBegin}>
          Begin Part Four
        </button>
      </div>
    );
  }

  // Main two-column layout
  return (
    <div style={{ padding: '2rem' }}>
      <div className="two-column">

        {/* LEFT PANEL (static throughout) */}
        <div className="panel" style={{ flex: 1, maxWidth: 600, textAlign: 'left' }}>
          <h3>
            Speaking<br/>
            Part 4
          </h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{instructionText}</p>

          <div style={{ margin: '1rem 0', textAlign: 'center' }}>
            <img
              src={image}
              alt=""
              style={{ maxWidth: '100%', maxHeight: 300, objectFit: 'contain' }}
            />
          </div>

          <ol>
            {questions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ol>

          {phase === 'prep' && (
            <p style={{ fontWeight: 'bold' }}>
              You now have one minute to think about your answers. You can make notes if you wish.
            </p>
          )}
        </div>

        {/* RIGHT SIDEBAR (changes prep → speak) */}
        <div className="sidebar">
          {phase === 'prep' && (
            <>
              <p>(You may take notes.)</p>
              <Timer duration={seconds} onExpire={() => setSeconds(0)} />
            </>
          )}

          {phase === 'speak' && (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <span className="recording-dot" /> Recording…
              </div>
              <Timer duration={seconds} onExpire={() => setSeconds(0)} />
              {seconds <= 115 && (
                <button
                  className="btn btn-primary"
                  style={{ marginTop: '1rem' }}
                  onClick={() => setSeconds(0)}
                >
                  Finish Recording
                </button>
              )}
            </>
          )}

          <Recorder
            recording={phase === 'speak'}
            onRecordingComplete={blob => addRecording(blob, 'Part4')}
          />

          {phase !== 'done' && (
            <div style={{ marginTop: '2rem', fontSize: '0.9rem' }}>
              <p>Don’t want to practise Part 4?</p>
              <button
                className="btn btn-secondary"
                onClick={() => navigate('/speaking/end')}
              >
                Skip to End
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}