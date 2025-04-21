// src/components/Part2Presentation.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Timer from './Timer';
import Recorder from './Recorder';
import prompts from '../data/prompts';
import { useRecordings } from '../RecordingContext';
import { playAudio, resumeAudio, stopAllAudio } from '../utils/audioWeb';

export default function Part2Presentation() {
  const navigate       = useNavigate();
  const { addRecording } = useRecordings();
  const { questions }  = prompts.part2;

  // 'locked' until user hits Begin Part 2
  const [phase,   setPhase]   = useState('locked');
  const [seconds, setSeconds] = useState(0);

  // ---- 1) state‐machine & countdown ----
  useEffect(() => {
    let timerId;

    if (phase === 'instr') {
      playAudio('p2_i', () => {
        playAudio('beep', () => setPhase('qs'));
      });
    }

    if (phase === 'qs') {
      playAudio('p2_qs', () => {
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
      playAudio('p2_s', () => {
        playAudio('beep', () => {
          setPhase('speak');
          setSeconds(120);
        });
      });
    }

    if (phase === 'speak') {
      if (seconds > 0) {
        timerId = setTimeout(() => setSeconds(s => s - 1), 1000);
      } else {
        setPhase('done');
      }
    }

    if (phase === 'done') {
      timerId = setTimeout(() => navigate('/speaking/part3'), 500);
    }

    return () => clearTimeout(timerId);
  }, [phase, seconds, navigate]);

  // ---- 2) cleanup when component unmounts ----
  useEffect(() => {
    return () => {
      stopAllAudio();  
    };
  }, []);

  // ---- 3) locked splash screen ----
  if (phase === 'locked') {
    const begin = () => {
      resumeAudio();    // unlock Web Audio
      setPhase('instr'); // jump into the normal flow
    };

    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Part Two</h2>
        <button
          className="btn btn-primary"
          style={{ marginTop: '2rem' }}
          onClick={begin}
        >
          Begin Part 2
        </button>
      </div>
    );
  }

  // ---- 4) normal render ----
  return (
    <div style={{ padding: '2rem' }}>
      <div className="two-column">

        {/* LEFT PANEL */}
        <div className="panel" style={{ flex: 1, textAlign: 'left', maxWidth: 600 }}>
          {['instr','qs','prep'].includes(phase) && (
            <>
              <h2>Part Two</h2>
              <p>
              In this part I'm going to ask you three questions. You will have
                one minute to think about your answers before you start speaking.
                You will have two minutes to answer all three questions.<br/>
                Begin speaking when you hear the sound. <strong>beep</strong>
              </p>
              <ol>
                {questions.map((q,i) => <li key={i}>{q}</li>)}
              </ol>
            </>
          )}
          {phase === 'speak' && (
            <>
              <h2>Part Two Questions</h2>
              <ol>
                {questions.map((q,i) => <li key={i}>{q}</li>)}
              </ol>
            </>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="sidebar">
          {phase === 'prep' && (
            <>
              <p>(You may take notes.)</p>
              <Timer duration={seconds} onExpire={() => {}} />
            </>
          )}

          {phase === 'speak' && (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <span className="recording-dot" /> Recording…
              </div>
              <Timer duration={seconds} onExpire={() => {}} />
              {seconds <= 110 && (
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
            onRecordingComplete={blob => addRecording(blob, 'Part2')}
          />

          {/* Skip button */}
          {phase !== 'done' && (
            <div style={{ marginTop: '2rem', fontSize: '0.9rem' }}>
              <p>Don’t want to practise Part 2?</p>
              <button
                className="btn btn-secondary"
                style={{ marginTop: '1rem', fontSize: '0.9rem' }}
                onClick={() => {
                  stopAllAudio();     // ← now *this* actually calls your imported helper
                  navigate('/speaking/part3');
                }}
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
