gsap.registerPlugin(ScrollTrigger);

// ── CURSOR ──
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
let mx = 0, my = 0, fx = 0, fy = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
});
(function loop() {
  fx += (mx - fx) * 0.1; fy += (my - fy) * 0.1;
  follower.style.left = fx + 'px'; follower.style.top = fy + 'px';
  requestAnimationFrame(loop);
})();
document.querySelectorAll('a, button, .service-card, .work-item').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.classList.add('hovered'); follower.classList.add('hovered'); });
  el.addEventListener('mouseleave', () => { cursor.classList.remove('hovered'); follower.classList.remove('hovered'); });
});

// ── BACK TO TOP ──
window.addEventListener('scroll', () => {
  document.getElementById('backTop').classList.toggle('visible', window.scrollY > 400);
});
document.getElementById('backTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ── MOBILE NAV ──
const closeNav = () => document.body.classList.remove('nav-open');
document.querySelector('.nav-toggle').addEventListener('click', () => document.body.classList.toggle('nav-open'));
document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', closeNav));
document.getElementById('navOverlay').addEventListener('click', closeNav);

// ── YEAR ──
document.getElementById('year').textContent = new Date().getFullYear();

// ── HERO ENTRANCE ──
gsap.fromTo('.mask span',
  { y: 110, opacity: 0 },
  { y: 0, opacity: 1, duration: 1.4, stagger: 0.15, ease: 'power4.out', delay: 0.2 }
);
gsap.fromTo('.bio-line',
  { y: 20, opacity: 0 },
  { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power2.out', delay: 0.7 }
);

// ── SERVICE CARDS — spotlight mouse tracking ──
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
  card.addEventListener('mouseleave', e => {
    const r = card.getBoundingClientRect();
    gsap.to(card, {
      '--mx': `${r.width / 2}px`,
      '--my': `${r.height / 2}px`,
      duration: 0.6, ease: 'power3.out'
    });
  });
  // init center
  const r = card.getBoundingClientRect();
  card.style.setProperty('--mx', `${r.width / 2}px`);
  card.style.setProperty('--my', `${r.height / 2}px`);
});

// ── SERVICES SCROLL IN ──
gsap.fromTo('.service-card',
  { y: 80, opacity: 0 },
  {
    y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: '#services', start: 'top 80%' }
  }
);

// ── WORK LIST ──
gsap.fromTo('.work-item',
  { y: 40, opacity: 0 },
  {
    y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out',
    scrollTrigger: { trigger: '.work-list', start: 'top 80%' }
  }
);

// ── ABOUT ──
gsap.fromTo('.about-left',
  { x: -50, opacity: 0 },
  { x: 0, opacity: 1, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '#about', start: 'top 75%' } }
);
gsap.fromTo('.about-right',
  { x: 50, opacity: 0 },
  { x: 0, opacity: 1, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '#about', start: 'top 75%' } }
);

// ── SKILL BARS ──
document.querySelectorAll('.skill-fill').forEach(bar => {
  ScrollTrigger.create({
    trigger: bar, start: 'top 90%',
    onEnter: () => { bar.style.width = bar.dataset.width + '%'; }
  });
});

// ── COUNTERS ──
document.querySelectorAll('.stat-num').forEach(el => {
  const target = parseInt(el.dataset.target);
  ScrollTrigger.create({
    trigger: el, start: 'top 90%',
    onEnter: () => {
      let n = 0;
      const step = Math.ceil(target / 40);
      const t = setInterval(() => {
        n = Math.min(n + step, target);
        el.textContent = n;
        if (n >= target) clearInterval(t);
      }, 40);
    }
  });
});

// ── TABS ──
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
    if (btn.dataset.tab === 'skills') {
      document.querySelectorAll('.skill-fill').forEach(b => { b.style.width = b.dataset.width + '%'; });
    }
  });
});

// ── CONTACT ──
gsap.fromTo('#contact .section-header, .contact-email, .contact-links',
  { y: 40, opacity: 0 },
  { y: 0, opacity: 1, duration: 0.9, stagger: 0.15, ease: 'power3.out',
    scrollTrigger: { trigger: '#contact', start: 'top 80%' } }
);

// ── PROJECT MODAL ──
const backdrop = document.getElementById('modalBackdrop');
const closeModal = () => backdrop.classList.remove('open');

document.querySelectorAll('.work-item').forEach(item => {
  item.addEventListener('click', e => {
    if (e.target.closest('a')) return;
    const d = item.dataset;
    document.getElementById('modalTitle').textContent = d.title;
    document.getElementById('modalCat').textContent   = d.cat;
    document.getElementById('modalDesc').textContent  = d.desc;
    document.getElementById('modalImg').src           = d.img;
    document.getElementById('modalImg').alt           = d.title;
    const stack = document.getElementById('modalStack');
    stack.innerHTML = d.stack.split(',').map(t => `<span>${t.trim()}</span>`).join('');
    const link = document.getElementById('modalLink');
    if (d.link) { link.href = d.link; link.classList.remove('hidden'); }
    else { link.classList.add('hidden'); }
    backdrop.classList.add('open');
  });
});

document.getElementById('modalClose').addEventListener('click', closeModal);
backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
