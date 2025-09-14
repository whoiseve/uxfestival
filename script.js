// Real-time countdown to UX_004: Nov 21, 2025 (local time)
// If you want to lock to Vancouver time regardless of viewer locale,
// set const useVancouverTZ = true and see the notes below.

(function () {
  // --- CONFIG ---
  // Treat target as midnight local time on Nov 21, 2025
  // (For strict America/Vancouver regardless of viewer locale, see note below.)
  const targetLocal = new Date(2025, 10, 21, 12, 0, 0, 0); // month is zero-based (10 = November)
  const el = {
    dd: document.getElementById('dd'),
    hh: document.getElementById('hh'),
    mm: document.getElementById('mm'),
    ss: document.getElementById('ss'),
    ms: document.getElementById('ms'),
  };

  // Utility: left-pad numbers
  const pad = (num, size) => {
    let s = String(num);
    while (s.length < size) s = '0' + s;
    return s;
  };

  function render() {
    const now = new Date();
    let diff = targetLocal.getTime() - now.getTime();

    if (diff <= 0) {
      // Event reached or passed: zero everything out
      el.dd.textContent = '000';
      el.hh.textContent = '00';
      el.mm.textContent = '00';
      el.ss.textContent = '00';
      el.ms.textContent = '000';
      return; // stop updating once passed if you prefer
    }

    // Calculate parts
    const MS_IN_SEC = 1000;
    const MS_IN_MIN = 60 * MS_IN_SEC;
    const MS_IN_HR  = 60 * MS_IN_MIN;
    const MS_IN_DAY = 24 * MS_IN_HR;

    const days = Math.floor(diff / MS_IN_DAY);          diff -= days * MS_IN_DAY;
    const hours = Math.floor(diff / MS_IN_HR);          diff -= hours * MS_IN_HR;
    const mins = Math.floor(diff / MS_IN_MIN);          diff -= mins * MS_IN_MIN;
    const secs = Math.floor(diff / MS_IN_SEC);
    const ms   = diff - secs * MS_IN_SEC;

    el.dd.textContent = pad(days, 3);   // supports 000–999 days
    el.hh.textContent = pad(hours, 2);
    el.mm.textContent = pad(mins, 2);
    el.ss.textContent = pad(secs, 2);
    el.ms.textContent = pad(ms, 3);
  }

  // Update ~every 33ms (30 FPS) for a smooth millisecond readout without hammering the main thread.
  // You can change to 10ms if you want snappier ms, or requestAnimationFrame for ~60Hz updates.
  render();
  const interval = setInterval(render, 33);

  // Optional: stop interval at event time to save cycles
  const stopWhenArrived = setInterval(() => {
    if (new Date() >= targetLocal) {
      clearInterval(interval);
      clearInterval(stopWhenArrived);
      render();
    }
  }, 1000);

  /*
   * NOTE: For a timezone-locked target (America/Vancouver) no matter where the viewer is:
   *
   *   const tz = 'America/Vancouver';
   *   const targetZoned = new Date(
   *     new Date('2025-11-21T00:00:00').toLocaleString('en-US', { timeZone: tz })
   *   );
   *
   * Replace targetLocal with targetZoned in the code above.
   * This approximates a "Vancouver midnight" moment across timezones.
   */
})();
