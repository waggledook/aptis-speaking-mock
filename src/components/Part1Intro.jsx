// src/components/Part1Intro.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { playAudio } from '../utils/audioWeb';
import { generalPart1 } from '../data/prompts';

export default function Part1Intro() {
  const navigate = useNavigate();

  useEffect(() => {
    // Must be in a user gesture first — resumeAudio was already
    // called on the InstructionsScreen’s button click.
    // Play the Part 1 instructions, then the beep, then advance:
    playAudio('p1_i')
      .then(() => playAudio('beep'))
      .then(() => {
        // Jump straight to question 0
        navigate('/speaking/part1/0');
      });
  }, [navigate]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Speaking</h1>
      <h2>Prompt</h2>
      <p>
        <strong>Part One</strong> – {generalPart1.instructionText}
      </p>
      {/* no button here */}
    </div>
  );
}