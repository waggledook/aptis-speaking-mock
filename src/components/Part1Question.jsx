// src/components/Part1Question.jsx
import React, { useState, useEffect }  from 'react';
import { useNavigate }                from 'react-router-dom';
import Timer                          from './Timer';
import Recorder                       from './Recorder';
import prompts                        from '../data/prompts';
import { useRecordings }              from '../RecordingContext';
import { playAudio }                  from '../utils/audioWeb';

export default function Part1Question() {
  const navigate = useNavigate();
  const { addRecording } = useRecordings();
  const { images, questions } = prompts.part1;
  const total = questions.length;

  // State
  const [qIndex, setQIndex]   = useState(0);           // 0‑based
  const [phase, setPhase]     = useState('waiting');   // waiting → recording → done
  const [seconds, setSeconds] = useState(45);

  // 2) Kick off each question: play prompt → beep → start recording
  useEffect(() => {
    if (phase !== 'waiting') return;
    const timer = setTimeout(() => {
      const key = `p1_q${qIndex+1}`;
      playAudio(key, () => {
        playAudio('beep', () => setPhase('recording'));
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [qIndex, phase]);

  // 3) Countdown during recording
  useEffect(() => {
    if (phase !== 'recording') return;
    if (seconds <= 0) {
      setPhase('done');
      return;
    }
    const id = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, seconds]);

  // 4) Advance to next question or Part 2 once recording done
  useEffect(() => {
    if (phase !== 'done') return;
    const timer = setTimeout(() => {
      if (qIndex + 1 < total) {
        setQIndex(i => i + 1);
        setPhase('waiting');
        setSeconds(45);
      } else {
        navigate('/speaking/part2');
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [phase, qIndex, total, navigate]);

  return (
    <div style={{ padding: '2rem' }}>
      <div className="two-column">
        {/* Left panel */}
        <div className="panel" style={{ flex: 1 }}>
          <h3>Part 1 – Question {qIndex+1} of {total}</h3>
          <div className="part1-images" style={{ display: 'flex', gap: '1rem' }}>
            <img src={images[0]} alt="" style={{ width: '45%' }} />
            <img src={images[1]} alt="" style={{ width: '45%' }} />
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

          {/* Invisible recorder */}
          <Recorder
            recording={phase === 'recording'}
            onRecordingComplete={blob => {
              addRecording(blob, `Part1_Q${qIndex+1}`);
            }}
          />

          {/* Skip button (just navigates) */}
          {phase !== 'done' && (
            <div style={{ marginTop: '2rem', fontSize: '0.9rem' }}>
              <p>Don’t want to practise Part 1?</p>
              <button
                className="btn btn-secondary"
                style={{ marginTop: '1rem', fontSize: '0.9rem' }}
                onClick={() => navigate('/speaking/part2')}
              >
                Skip to Part 2
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
