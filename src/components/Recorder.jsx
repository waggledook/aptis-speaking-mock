// src/components/Recorder.jsx
import { useEffect, useRef } from 'react';

export default function Recorder({ recording, onRecordingComplete }) {
  const recorderRef = useRef(null);
  const chunksRef   = useRef([]);

  useEffect(() => {
    // START recording if `recording` becomes true and no recorder exists
    if (recording && recorderRef.current === null) {
      console.log('[Recorder] 🟢 STARTING recorder');
      chunksRef.current = [];

      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const mr = new MediaRecorder(stream);
          recorderRef.current = mr;

          mr.ondataavailable = e => {
            console.log('[Recorder] data chunk, size=', e.data.size);
            if (e.data.size > 0) chunksRef.current.push(e.data);
          };

          mr.onstop = () => {
            console.log('[Recorder] 🔴 STOPPED recorder');
            const blob = new Blob(chunksRef.current, { type: mr.mimeType });
            onRecordingComplete(blob);
            recorderRef.current = null;  // clear so we can start again next time
          };

          mr.start();
        })
        .catch(err => console.error('[Recorder] mic error', err));
    }

    // STOP recording if `recording` becomes false and a recorder exists
    if (!recording && recorderRef.current) {
      console.log('[Recorder] 🔴 STOPPING recorder');
      recorderRef.current.stop();
      // onstop will clear recorderRef.current
    }
  }, [recording, onRecordingComplete]);

  // Effect #2: cleanup on un-mount — ensure any active recorder is stopped
  useEffect(() => {
    return () => {
      if (recorderRef.current && recorderRef.current.state !== 'inactive') {
        console.log('[Recorder] cleanup: force-stopping recorder on unmount');
        recorderRef.current.stop();
      }
    };
  }, []);

  return null;
}
