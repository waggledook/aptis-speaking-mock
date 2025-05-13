// src/utils/audioWeb.js
// — a tiny “manager” for loading & playing short clips via Web Audio —

// 1) Create the AudioContext and storage for buffers & sources
const AudioCtx = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioCtx();
const buffers = {};
const sources = [];

/** Decode & store under `name` */
export async function loadAudio(name, url) {
  const res = await fetch(url);
  const arrayBuffer = await res.arrayBuffer();
  buffers[name] = await audioCtx.decodeAudioData(arrayBuffer);
}

/** In user-gesture: unlock the AudioContext */
export function resumeAudio() {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

/**
 * Play a named buffer and return a Promise that resolves when playback ends.
 * This lets you chain playAudio('foo').then(() => ...)
 */
export function playAudio(name) {
  const buffer = buffers[name];
  if (!buffer) {
    console.warn(`AudioWeb: buffer "${name}" not loaded`);
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const src = audioCtx.createBufferSource();
    src.buffer = buffer;
    src.connect(audioCtx.destination);

    // When playback ends, remove from sources and resolve
    src.onended = () => {
      const idx = sources.indexOf(src);
      if (idx > -1) sources.splice(idx, 1);
      resolve();
    };

    sources.push(src);
    src.start(0);
  });
}

/** Stop & remove all currently playing sources */
export function stopAllAudio() {
  sources.forEach(src => {
    try { src.stop(); } catch (_) {}
  });
  sources.length = 0;
}