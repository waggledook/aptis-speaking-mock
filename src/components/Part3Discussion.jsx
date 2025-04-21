// src/components/Part3Discussion.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate }                   from 'react-router-dom';
import Timer                             from './Timer';
import Recorder                          from './Recorder';
import prompts                           from '../data/prompts';
import { useRecordings }                 from '../RecordingContext';
import { playAudio, resumeAudio, stopAllAudio } from '../utils/audioWeb';

export default function Part3Discussion() {
  const navigate = useNavigate();
  const { addRecording } = useRecordings();
  const { topic, forPoints, againstPoints, followUpText } = prompts.part3;

  // start locked until user taps “Begin Part 3”
  const [phase,   setPhase]   = useState('locked');
  const [seconds, setSeconds] = useState(0);

  // unlock & kick off the first instructions
  const startPart3 = () => {
    resumeAudio();       // unlock AudioContext
    setPhase('instr1');  // begin the instruction sequence
  };

  // ───────────────
  // 1) Main state‑machine + countdown
  // ───────────────
  useEffect(() => {
    let timerId;

    if (phase === 'instr1') {
      playAudio('p3_i1', () =>
        playAudio('beep', () => setPhase('instr2'))
      );
    }

    if (phase === 'instr2') {
      playAudio('p3_i2', () => {
        setPhase('prep');
        setSeconds(60);
      });
    }

    if (phase === 'prep') {
      if (seconds > 0) {
        timerId = setTimeout(() => setSeconds(s => s - 1), 1000);
      } else {
        setPhase('startSpeak');
      }
    }

    if (phase === 'startSpeak') {
      playAudio('p3_s', () =>
        playAudio('beep', () => {
          setPhase('speak');
          setSeconds(90);
        })
      );
    }

    if (phase === 'speak') {
      if (seconds > 0) {
        timerId = setTimeout(() => setSeconds(s => s - 1), 1000);
      } else {
        setPhase('followupInstr');
      }
    }

    if (phase === 'followupInstr') {
      playAudio('p3_fu', () =>
        playAudio('beep', () => {
          setPhase('followupSpeak');
          setSeconds(45);
        })
      );
    }

    if (phase === 'followupSpeak') {
      if (seconds > 0) {
        timerId = setTimeout(() => setSeconds(s => s - 1), 1000);
      } else {
        setPhase('doneFollowup');
      }
    }

    if (phase === 'doneFollowup') {
      timerId = setTimeout(() => navigate('/speaking/end'), 500);
    }

    return () => clearTimeout(timerId);
  }, [phase, seconds, navigate]);

  // ───────────────
  // 2) Cleanup on unmount
  // ───────────────
  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  // ───────────────
  // 3) Locked UI
  // ───────────────
  if (phase === 'locked') {
    return (
      <div style={{ textAlign: 'center', margin: '4rem 1rem' }}>
        <h2>Part Three</h2>
        <button
          className="btn btn-primary"
          style={{ marginTop: '2rem' }}
          onClick={() => {
            resumeAudio();    // unlock Web Audio
            setPhase('instr1'); // start the part 3 sequence
          }}
        >
          Begin Part 3
        </button>
      </div>
    );
  }

  // ───────────────
  // 4) Main UI
  // ───────────────
  return (
    <div style={{ padding: '2rem' }}>
      <div className="two-column">
        {/* LEFT PANEL */}
        <div className="panel" style={{ flex: 1, textAlign: 'left', maxWidth: 600 }}>
          {['instr1','instr2','prep'].includes(phase) && (
            <>
              <h2>Part Three</h2>
              <p style={{ whiteSpace: 'pre-wrap' }}>
                {prompts.part3.instructionsText}
              </p>
              <h3>Topic:</h3>
              <p><strong>{topic}</strong></p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
                <div>
                  <h4>FOR</h4>
                  <ul>{forPoints.map((p,i) => <li key={i}>{p}</li>)}</ul>
                </div>
                <div>
                  <h4>AGAINST</h4>
                  <ul>{againstPoints.map((p,i) => <li key={i}>{p}</li>)}</ul>
                </div>
              </div>
              {phase === 'prep' && <p style={{ marginTop: '1rem' }}>(You may take notes.)</p>}
            </>
          )}

          {phase === 'speak' && (
            <>
              <h3>Speak now</h3>
              <p><strong>{topic}</strong></p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
                <ul>{forPoints.map((p,i) => <li key={i}>{p}</li>)}</ul>
                <ul>{againstPoints.map((p,i) => <li key={i}>{p}</li>)}</ul>
              </div>
            </>
          )}

          {['followupInstr','followupSpeak'].includes(phase) && (
            <p style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>
              {followUpText}
            </p>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="sidebar">
          {phase === 'prep' && <Timer duration={seconds} onExpire={() => {}} />}

          {phase === 'speak' && (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <span className="recording-dot" /> Recording…
              </div>
              <Timer duration={seconds} onExpire={() => {}} />
              {seconds <= 80 && (
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

          {phase === 'followupSpeak' && (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <span className="recording-dot" /> Recording follow‑up…
              </div>
              <Timer duration={seconds} onExpire={() => {}} />
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

          {/* recorders */}
          <Recorder
            recording={phase === 'speak'}
            onRecordingComplete={blob => addRecording(blob, 'Part3_Main')}
          />
          <Recorder
            recording={phase === 'followupSpeak'}
            onRecordingComplete={blob => addRecording(blob, 'Part3_FollowUp')}
          />

          {/* Skip Part 3 */}
          {phase !== 'doneFollowup' && (
            <div style={{ marginTop: '2rem', fontSize: '0.9rem' }}>
              <p>Don’t want to practise Part 3?</p>
              <button
                className="btn btn-secondary"
                style={{ marginTop: '1rem', fontSize: '0.9rem' }}
                onClick={() => {
                  stopAllAudio();            // ← STOP any in‑flight audio
                  navigate('/speaking/end');
                }}
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
