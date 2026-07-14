import { useCallback, useEffect, useRef, useState } from "react";

const IDLE_MS = 25_000; // pause after 25s of no interaction (walked away)
const TICK_MS = 200;

/**
 * A reading-session stopwatch that only counts *engaged* time: it auto-pauses
 * when the tab is hidden, the window loses focus, or the reader goes idle, and
 * resumes on interaction. This keeps WPM honest (research/01: engaged volume).
 */
export function useReadingTimer() {
  const [running, setRunning] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);

  const accum = useRef(0); // committed ms
  const startedAt = useRef<number | null>(null); // ms timestamp of current run
  const lastActivity = useRef<number>(Date.now());
  const wantRun = useRef(false); // user intends to be reading

  const commit = useCallback(() => {
    if (startedAt.current != null) {
      accum.current += Date.now() - startedAt.current;
      startedAt.current = null;
    }
  }, []);

  const resume = useCallback(() => {
    if (!wantRun.current) return;
    if (startedAt.current == null) {
      startedAt.current = Date.now();
      setRunning(true);
    }
  }, []);

  const pause = useCallback(() => {
    commit();
    setRunning(false);
  }, [commit]);

  const start = useCallback(() => {
    wantRun.current = true;
    lastActivity.current = Date.now();
    resume();
  }, [resume]);

  const stop = useCallback(() => {
    wantRun.current = false;
    commit();
    setRunning(false);
    return accum.current;
  }, [commit]);

  const reset = useCallback(() => {
    wantRun.current = false;
    startedAt.current = null;
    accum.current = 0;
    setElapsedMs(0);
    setRunning(false);
  }, []);

  // ticker + idle detection
  useEffect(() => {
    const iv = setInterval(() => {
      if (startedAt.current != null) {
        setElapsedMs(accum.current + (Date.now() - startedAt.current));
        if (Date.now() - lastActivity.current > IDLE_MS) pause();
      } else {
        setElapsedMs(accum.current);
      }
    }, TICK_MS);
    return () => clearInterval(iv);
  }, [pause]);

  // visibility / focus
  useEffect(() => {
    const onHide = () => (document.hidden ? pause() : resume());
    const onBlur = () => pause();
    const onFocus = () => resume();
    const onActivity = () => {
      lastActivity.current = Date.now();
      resume();
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    window.addEventListener("pointermove", onActivity, { passive: true });
    window.addEventListener("pointerdown", onActivity, { passive: true });
    window.addEventListener("keydown", onActivity);
    window.addEventListener("scroll", onActivity, { passive: true });
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("pointermove", onActivity);
      window.removeEventListener("pointerdown", onActivity);
      window.removeEventListener("keydown", onActivity);
      window.removeEventListener("scroll", onActivity);
    };
  }, [pause, resume]);

  return { running, elapsedMs, start, pause, resume, stop, reset };
}
