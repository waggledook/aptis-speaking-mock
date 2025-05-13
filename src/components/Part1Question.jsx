// src/components/Part1Question.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useMatch } from 'react-router-dom';
import Timer from './Timer';
import Recorder from './Recorder';
import { useRecordings } from '../RecordingContext';
import { playAudio } from '../utils/audioWeb';
import { generalPart1, generalPart3 } from '../data/prompts';

export default function Part1Question() {
  const navigate = useNavigate();
  const { addRecording } = useRecordings();
  const { qIndex: qIndexParam } = useParams();

  // Determine if this is General Part 1 or Part 3
  const isPart1 = Boolean(useMatch('/speaking/part1/:qIndex'));
  const data = isPart1 ? generalPart1 : generalPart3;
  const { questions, images = [] } = data;

  const total = questions.length;
  const index = Number(qIndexParam);

  // Set initial timer: 30s for Part 1, 45s for Part 3
  const defaultSeconds = isPart1 ? 30 : 45;
  const [phase, setPhase] = useState('waiting');
  const [seconds, setSeconds] = useState(defaultSeconds);

  // Play the prompt audio, then beep, then start recording
  useEffect(() => {
    if (phase !== 'waiting') return;
    const timeout = setTimeout(() => {
      // choose p1_q for Part 1, p3_q for Part 3
      const key = isPart1
      ? `p1_q${index + 1}`
      : `p3_q${index + 1}`;
      playAudio(key)
        .then(() => playAudio('beep'))
        .then(() => setPhase('recording'));
    }, 500);
    return () => clearTimeout(timeout);
  }, [index, phase, isPart1]);

  // Countdown when recording
  useEffect(() => {
    if (phase !== 'recording') return;
    if (seconds <= 0) {
      setPhase('done');
      return;
    }
    const id = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, seconds]);

  // Advance after each question or move to next part
  useEffect(() => {
    if (phase !== 'done') return;
    const timeout = setTimeout(() => {
      if (index + 1 < total) {
        const nextRoute = isPart1
          ? `/speaking/part1/${index + 1}`
          : `/speaking/part3/${index + 1}`;
        setPhase('waiting');
        setSeconds(defaultSeconds);
        navigate(nextRoute);
      } else {
        navigate(isPart1 ? '/speaking/part2' : '/speaking/part4');
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [phase, index, total, navigate, isPart1, defaultSeconds]);

  return (
    <div style={{ padding: '2rem' }}>
      <div className="two-column">
        <div className="panel" style={{ flex: 1 }}>
          <h3>
            Speaking
            <br />
            Part {isPart1 ? 1 : 3} – Question {index + 1} of {total}
          </h3>
          {images.length === 2 && (
            <div className="part1-images" style={{ display: 'flex', gap: '1rem' }}>
              <img src={images[0]} alt="" style={{ width: '45%' }} />
              <img src={images[1]} alt="" style={{ width: '45%' }} />
            </div>
          )}
          <p style={{ marginTop: '1rem' }}>{questions[index]}</p>
        </div>

        <div className="sidebar">
          {phase === 'recording' && (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <span className="recording-dot" /> Recording…
              </div>
              <Timer duration={seconds} onExpire={() => setSeconds(0)} />
              {seconds <= defaultSeconds - 5 && (
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
            onRecordingComplete={blob => {
              addRecording(blob, `Part${isPart1 ? '1' : '3'}_Q${index + 1}`);
            }}
          />

          {phase !== 'done' && (
            <div style={{ marginTop: '2rem', fontSize: '0.9rem' }}>
              <p>Don’t want to practise Part {isPart1 ? '1' : '3'}?</p>
              <button
                className="btn btn-secondary"
                style={{ marginTop: '1rem', fontSize: '0.9rem' }}
                onClick={() => navigate(isPart1 ? '/speaking/part2' : '/speaking/part4')}
              >
                Skip to Part {isPart1 ? '2' : '4'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

