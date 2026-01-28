// stopwatch using setInterval with accurate elapsed calculation
(function () {
  const display = document.getElementById('timeDisplay');
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const resetBtn = document.getElementById('resetBtn');

  let intervalId = null;       // holds setInterval id
  let startTime = 0;           // timestamp when started/resumed (ms)
  let accumulated = 0;         // accumulated elapsed time while paused (ms)
  const tickInterval = 200;    // update every 200ms (UI smoothness)

  // format milliseconds to HH:MM:SS
  function formatMS(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const hours = Math.floor(totalSeconds / 3600);
    const hh = String(hours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  }

  // update displayed time using accumulated + (now - startTime) if running
  function updateDisplay() {
    const now = Date.now();
    const elapsed = accumulated + (intervalId ? (now - startTime) : 0);
    display.textContent = formatMS(elapsed);
  }

  // start/resume the stopwatch
  function startTimer() {
    if (intervalId) return; // already running
    startTime = Date.now();
    // immediate update so UI updates on start
    updateDisplay();
    intervalId = setInterval(updateDisplay, tickInterval);
    // update controls
    startBtn.setAttribute('aria-pressed', 'true');
    startBtn.disabled = true;
    stopBtn.disabled = false;
    resetBtn.disabled = false;
  }

  // stop/pause the stopwatch
  function stopTimer() {
    if (!intervalId) return; // already stopped
    clearInterval(intervalId);
    intervalId = null;
    // accumulate elapsed time
    accumulated += Date.now() - startTime;
    startTime = 0;
    updateDisplay();
    startBtn.setAttribute('aria-pressed', 'false');
    startBtn.disabled = false;
    stopBtn.disabled = true;
    resetBtn.disabled = false;
  }

  // reset to 00:00:00 and clear state
  function resetTimer() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    accumulated = 0;
    startTime = 0;
    updateDisplay();
    startBtn.setAttribute('aria-pressed', 'false');
    startBtn.disabled = false;
    stopBtn.disabled = true;
    resetBtn.disabled = true;
  }

  // Attach event listeners
  startBtn.addEventListener('click', startTimer);
  stopBtn.addEventListener('click', stopTimer);
  resetBtn.addEventListener('click', resetTimer);

  // Keyboard shortcuts: Space toggles start/stop, R resets
  document.addEventListener('keydown', function (e) {
    // ignore when focus is on interactive elements like inputs (none here, but good practice)
    const tag = document.activeElement && document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement.isContentEditable) return;

    if (e.code === 'Space') {
      e.preventDefault();
      if (intervalId) stopTimer();
      else startTimer();
    } else if (e.key.toLowerCase() === 'r') {
      // allow quick reset
      resetTimer();
    }
  });

  // initialize UI
  resetTimer();

  // keep display accurate if browser tab was suspended: update on visibility change
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') {
      updateDisplay();
    }
  });
})();