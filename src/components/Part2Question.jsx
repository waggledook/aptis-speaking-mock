// src/components/Part2Question.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Timer from './Timer';
import Recorder from './Recorder';
import { useRecordings } from '../RecordingContext';
import { playAudio, resumeAudio, stopAllAudio } from '../utils/audioWeb';
import { generalPart2 } from '../data/prompts';

export default function Part2Question() {
  const navigate = useNavigate();
  const { addRecording } = useRecordings();
  const { image, instructionText, questions } = generalPart2;
  const total = questions.length;

  // phases: 'locked' -> 'intro' -> 'waiting' -> 'recording' -> 'done'
  const [phase, setPhase] = useState('locked');
  const [qIndex, setQIndex] = useState(0);
  const [seconds, setSeconds] = useState(45);

  // start intro on click
  useEffect(() => {
    if (phase === 'intro') {
      playAudio('p2_i')
        .then(() => playAudio('beep'))
        .then(() => setPhase('waiting'));
    }
  }, [phase]);

  // play question audio then beep
  useEffect(() => {
    if (phase !== 'waiting') return;
    const key = `p2_q${qIndex + 1}`;
    playAudio(key)
      .then(() => playAudio('beep'))
      .then(() => setPhase('recording'));
  }, [phase, qIndex]);

  // countdown
  useEffect(() => {
    if (phase !== 'recording') return;
    if (seconds <= 0) {
      setPhase('done');
      return;
    }
    const id = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, seconds]);

  // advance
  useEffect(() => {
    if (phase !== 'done') return;
    const id = setTimeout(() => {
      if (qIndex + 1 < total) {
        setQIndex(i => i + 1);
        setSeconds(45);
        setPhase('waiting');
      } else {
        navigate('/speaking/part3-intro')
      }
    }, 500);
    return () => clearTimeout(id);
  }, [phase, qIndex, total, navigate]);

  // cleanup
  useEffect(() => () => stopAllAudio(), []);

  // locked
  if (phase === 'locked') {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Part Two</h2>
        <button
          className="btn btn-primary"
          style={{ marginTop: '2rem' }}
          onClick={() => {
            resumeAudio();
            setPhase('intro');
          }}
        >
          Begin Part Two
        </button>
      </div>
    );
  }

  // intro
  if (phase === 'intro') {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Speaking</h2>
        <h3>Prompt</h3>
        <p style={{ whiteSpace: 'pre-wrap' }}>{instructionText}</p>
      </div>
    );
  }

  // question
  return (
    <div style={{ padding: '2rem' }}>
      <div className="two-column">

        {/* Left panel */}
        <div className="panel" style={{ flex: 1 }}>
          <h3>
            Speaking
            <br />
            Part Two – Question {qIndex + 1} of {total}
          </h3>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
            <img
              src={image}
              alt=""
              style={{ maxWidth: '100%', maxHeight: 300, objectFit: 'contain' }}
            />
          </div>
          <p style={{ marginTop: '1rem' }}>{questions[qIndex]}</p>
        </div>

        {/* Right sidebar */}
        <div className="sidebar">
          {phase === 'recording' && (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <span className="recording-dot" /> Recording…
              </div>
              <Timer duration={seconds} onExpire={() => setSeconds(0)} />
              {seconds <= 35 && (
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
            recording={phase === 'recording'}
            onRecordingComplete={blob => addRecording(blob, `Part2_Q${qIndex + 1}`)}
          />

          {phase !== 'done' && (
            <div style={{ marginTop: '2rem', fontSize: '0.9rem' }}>
              <p>Don’t want to practise Part 2?</p>
              <button
                className="btn btn-secondary"
                style={{ marginTop: '1rem', fontSize: '0.9rem' }}
                onClick={() => navigate('/speaking/part3-intro')}
              >
                Skip to Part 3
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
