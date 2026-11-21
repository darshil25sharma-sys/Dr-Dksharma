const nav = document.getElementById('nav');
const menu = document.getElementById('menu');
const bar = document.getElementById('progress');
const links = [...menu.querySelectorAll('a')];

// Header style + scroll progress bar
addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', scrollY > 30);
  const h = document.documentElement;
  bar.style.width = (scrollY / (h.scrollHeight - h.clientHeight)) * 100 + '%';
}, { passive: true });

// Mobile menu
document.getElementById('burger').onclick = () => menu.classList.toggle('open');
links.forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));

// Scroll reveal
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Count-up numbers
const co = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target, end = +el.dataset.count, t0 = performance.now();
  const tick = t => {
    const p = Math.min((t - t0) / 2100, 1);
    el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  co.unobserve(el);
}), { threshold: .6 });
document.querySelectorAll('[data-count]').forEach(el => co.observe(el));

// Split the hero name into masked letters (premium rise-in)
document.querySelectorAll('.split').forEach(h => {
  const words = h.textContent.trim().split(/\s+/);
  let i = 0;
  h.innerHTML = words.map(w =>
    '<span class="w">' + [...w].map(ch => '<span class="ch" style="--i:' + (i++) + '">' + ch + '</span>').join('') + '</span>'
  ).join('');
});

// Profile photo: follows the hero slot, then shrinks and docks beside the name
const av = document.getElementById('avatar');
const slot = document.getElementById('portrait');
const DOCK = 42, lerp = (a, b, t) => a + (b - a) * t, ease = t => 1 - Math.pow(1 - t, 3);
let sx = 0, sy = 0, ss = 0;
function measure() {
  if (!slot) return;
  const r = slot.getBoundingClientRect();
  sx = r.left + scrollX; sy = r.top + scrollY; ss = r.width;
}
function place() {
  const left = innerWidth * 0.06, top = 14;
  let e = 1, x = left, y = top, size = DOCK;
  if (slot) {
    e = ease(Math.min(Math.max(scrollY / (sy + ss * 0.4), 0), 1));
    x = lerp(sx, left, e); y = lerp(sy - scrollY, top, e); size = lerp(ss, DOCK, e);
  }
  av.style.cssText = 'left:' + x + 'px;top:' + y + 'px;width:' + size + 'px;height:' + size + 'px;' +
    '--r:' + lerp(16, 0, e) + 'px;--ro:' + (1 - e);
  document.body.classList.toggle('docked', e > .98);
}
measure(); place();
addEventListener('scroll', place, { passive: true });
addEventListener('resize', () => { measure(); place(); });
addEventListener('load', () => { measure(); place(); });