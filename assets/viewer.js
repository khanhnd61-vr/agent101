// Agent 101: shows one slide at a time, scales it to the window, and starts each slide's
// animations from the beginning whenever that slide comes on screen.
(() => {
  const W = 1920, H = 1080;
  const stage = document.querySelector('.stage');
  const slides = [...document.querySelectorAll('.deck > section')];
  const total = slides.length;
  const $ = (id) => document.getElementById(id);
  const prevBtn = $('prev'), nextBtn = $('next'), count = $('count'), part = $('part'), full = $('full'), replayBtn = $('replay');
  const siteTitle = document.title;
  let cur = -1;

  // ---- Per-slide setup: accessible name ----
  slides.forEach((s, i) => {
    const h = s.querySelector('h1, h2');
    s.dataset.title = h ? h.textContent.trim().replace(/\s+/g, ' ') : '';
    s.setAttribute('role', 'group');
    s.setAttribute('aria-roledescription', 'slide');
    s.setAttribute('aria-label', `Slide ${i + 1} of ${total}: ${s.dataset.title}`);
  });

  function fit() {
    const s = Math.min(innerWidth / W, innerHeight / H);
    stage.style.transform = `translate(${(innerWidth - W * s) / 2}px, ${(innerHeight - H * s) / 2}px) scale(${s})`;
  }

  // The moving dots are SMIL animations: rewind them so every visit starts at the path's start
  const rewind = (s) => s.querySelectorAll('svg').forEach((v) => { try { v.setCurrentTime(0); } catch (e) { /* not animated */ } });

  function show(i) {
    i = Math.max(0, Math.min(total - 1, i));
    if (i === cur) return;
    if (cur >= 0) slides[cur].classList.remove('active');
    cur = i;
    const s = slides[i];
    s.classList.add('active'); // rendering the slide starts its entrance animations
    rewind(s);
    count.textContent = `${i + 1} / ${total}`;
    prevBtn.disabled = i === 0;
    nextBtn.disabled = i === total - 1;
    let p = 0;
    [...part.options].forEach((o, k) => { if (+o.value <= i + 1) p = k; });
    part.selectedIndex = p;
    document.title = i ? `${i + 1} · ${s.dataset.title} · ${siteTitle}` : siteTitle;
    const hash = `#slide-${i + 1}`;
    if (location.hash !== hash) history.replaceState(null, '', hash);
  }

  // Play the current slide's animations again
  function replay() {
    const s = slides[cur];
    s.classList.remove('active');
    void s.offsetWidth; // let the browser drop the slide before it is shown again
    s.classList.add('active');
    rewind(s);
  }

  const fromHash = () => { const m = /^#slide-(\d+)$/.exec(location.hash); return m ? +m[1] - 1 : 0; };

  // ---- Controls ----
  prevBtn.addEventListener('click', () => show(cur - 1));
  nextBtn.addEventListener('click', () => show(cur + 1));
  replayBtn.addEventListener('click', replay);
  part.addEventListener('change', () => { show(+part.value - 1); part.blur(); });
  if (document.documentElement.requestFullscreen) {
    full.addEventListener('click', () => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()));
  } else full.hidden = true;

  addEventListener('keydown', (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.target.closest && e.target.closest('select, button, a') && (e.key === ' ' || e.key === 'Enter' || e.target.tagName === 'SELECT')) return;
    const k = e.key;
    if (k === 'ArrowRight' || k === 'ArrowDown' || k === 'PageDown' || k === ' ' || k === 'Enter') show(cur + 1);
    else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp' || k === 'Backspace') show(cur - 1);
    else if (k === 'Home') show(0);
    else if (k === 'End') show(total - 1);
    else if (k === 'r' || k === 'R') replay();
    else if (k === 'f' || k === 'F') full.click();
    else return;
    e.preventDefault();
  });

  let tx = 0, ty = 0;
  addEventListener('touchstart', (e) => { tx = e.changedTouches[0].clientX; ty = e.changedTouches[0].clientY; }, { passive: true });
  addEventListener('touchend', (e) => {
    if (e.target.closest && e.target.closest('.bar')) return;
    const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > 48 && Math.abs(dx) > 1.5 * Math.abs(dy)) show(cur + (dx < 0 ? 1 : -1));
  }, { passive: true });

  // The toolbar fades out when the pointer rests
  let idle;
  const wake = () => { document.body.classList.remove('idle'); clearTimeout(idle); idle = setTimeout(() => document.body.classList.add('idle'), 2800); };
  ['mousemove', 'mousedown', 'touchstart', 'keydown'].forEach((ev) => addEventListener(ev, wake, { passive: true }));

  addEventListener('resize', fit);
  addEventListener('hashchange', () => show(fromHash()));
  fit();
  show(fromHash());
  wake();
})();
