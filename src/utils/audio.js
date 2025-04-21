// src/utils/audio.js

/**
 * Play an HTMLAudioElement exactly once, then call onEnded.
 * Resets any in-flight playback so it never overlaps.
 */
export function playWithCallback(audioEl, onEnded) {
    // 1) stop & rewind
    audioEl.pause();
    audioEl.currentTime = 0;
  
    // 2) ensure only one ended listener
    audioEl.removeEventListener('ended', onEnded);
    audioEl.addEventListener('ended', onEnded, { once: true });
  
    // 3) play and swallow any AbortError
    const playPromise = audioEl.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(err => {
        if (err.name !== 'AbortError') {
          console.error('Audio play failed:', err);
        }
        // ignore AbortError caused by our immediate pause()
      });
    }
  }
  