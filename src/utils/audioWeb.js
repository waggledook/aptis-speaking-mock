// src/utils/audioWeb.js
// — a tiny “manager” for loading & playing short clips via Web Audio —

// 1) Create the AudioContext and storage for buffers & sources
const AudioCtx = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioCtx();
const buffers  = {};
const sources = [];  // ← we’ll push every live source node here

/** Decode & store under `name` */
export async function loadAudio(name, url) {
  const res         = await fetch(url);
  const arrayBuffer = await res.arrayBuffer();
  buffers[name]     = await audioCtx.decodeAudioData(arrayBuffer);
}

/** In user‑gesture: unlock the AudioContext */
export function resumeAudio() {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

/** Play a named buffer, then onEnded; track that source so we can stop it */
export function playAudio(name, onEnded = () => {}) {
  const buffer = buffers[name];
  if (!buffer) {
    console.warn(`AudioWeb: buffer "${name}" not loaded`);
    onEnded();
    return;
  }
  const src = audioCtx.createBufferSource();
  src.buffer = buffer;
  src.connect(audioCtx.destination);

  // when this source node finishes, remove it from our list and fire callback
  src.onended = () => {
    const idx = sources.indexOf(src);
    if (idx > -1) sources.splice(idx, 1);
    onEnded();
  };

  sources.push(src);
  src.start(0);
}

/** Stop & remove all currently playing sources */
export function stopAllAudio() {
  // stop() is safe to call even if already ended
  sources.forEach(src => {
    try { src.stop(); }
    catch (_) {}
  });
  sources.length = 0;
}
