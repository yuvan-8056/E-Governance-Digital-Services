/* ═══════════════════════════════════════════════════════════
   CyberGov – Risk Landscape Report JavaScript
   Junior Cyber Security Analyst Internship, Week 1
═══════════════════════════════════════════════════════════ */

'use strict';

/* ── SIDEBAR NAVIGATION ────────────────────────────────── */
const sidebar   = document.getElementById('sidebar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelectorAll('.nav-link');
const sections  = document.querySelectorAll('.section');

hamburger.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
  if (window.innerWidth < 900 &&
      !sidebar.contains(e.target) &&
      !hamburger.contains(e.target)) {
    sidebar.classList.remove('open');
  }
});

// Active nav link on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active',
          link.dataset.section === entry.target.id);
      });
    }
  });
}, { threshold: 0.3, rootMargin: '-10% 0px -60% 0px' });

sections.forEach(s => observer.observe(s));

// Smooth scroll on nav click
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.getElementById(link.dataset.section);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (window.innerWidth < 900) sidebar.classList.remove('open');
    }
  });
});

/* ── THREAT CATEGORY ACCORDION ─────────────────────────── */
function toggleCategory(header) {
  const body = header.nextElementSibling;
  const isOpen = !body.classList.contains('collapsed');
  body.classList.toggle('collapsed', isOpen);
  header.classList.toggle('collapsed', isOpen);
}

// Open first 3 by default, collapse others
document.querySelectorAll('.tc-body').forEach((body, i) => {
  if (i >= 3) {
    body.classList.add('collapsed');
    body.previousElementSibling.classList.add('collapsed');
  }
});

/* ── VULNERABILITY TABS ─────────────────────────────────── */
function switchVTab(btn, id) {
  document.querySelectorAll('.vtab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.vtab-content').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(id).classList.add('active');
}

/* ── COUNTER ANIMATION ─────────────────────────────────── */
function animateCounters() {
  document.querySelectorAll('.cstat-num[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

// Trigger counters when cover section is visible
const coverSection = document.getElementById('cover');
const coverObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    animateCounters();
    coverObserver.disconnect();
  }
}, { threshold: 0.3 });
coverObserver.observe(coverSection);

/* ── SCORECARD BAR ANIMATION ───────────────────────────── */
const conclusionSection = document.getElementById('conclusion');
let barsAnimated = false;

const conclusionObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !barsAnimated) {
    barsAnimated = true;
    document.querySelectorAll('.sc-fill').forEach(bar => {
      const targetWidth = bar.style.width;
      bar.style.width = '0%';
      setTimeout(() => { bar.style.width = targetWidth; }, 100);
    });
    conclusionObserver.disconnect();
  }
}, { threshold: 0.3 });
conclusionObserver.observe(conclusionSection);

/* ── CARD HOVER TILT EFFECT ────────────────────────────── */
document.querySelectorAll('.threat-card, .vuln-card, .toc-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg) translateY(-2px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── RISK TABLE ROW HIGHLIGHTING ───────────────────────── */
document.querySelectorAll('.risk-table tbody tr').forEach(row => {
  row.addEventListener('click', () => {
    row.style.background = row.style.background ? '' : 'rgba(96,165,250,.08)';
  });
});

/* ── SCROLL PROGRESS INDICATOR ─────────────────────────── */
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed; top: 0; left: 0; height: 3px; z-index: 9999;
  background: linear-gradient(90deg, #60a5fa, #a78bfa, #22d3ee);
  width: 0%; transition: width 0.1s linear;
  box-shadow: 0 0 10px rgba(96,165,250,0.5);
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = `${pct}%`;
}, { passive: true });

/* ── FADE-IN ANIMATION ─────────────────────────────────── */
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.vuln-card, .threat-card, .toc-card, .tl-item, .mc-item, .ref-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  fadeObserver.observe(el);
});

// Add visible class handler
const style = document.createElement('style');
style.textContent = `.visible { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(style);

/* ── KEYBOARD NAVIGATION ───────────────────────────────── */
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    const currentActive = document.querySelector('.nav-link.active');
    const links = [...navLinks];
    const idx = links.indexOf(currentActive);
    if (e.key === 'ArrowDown' && idx < links.length - 1) links[idx + 1].click();
    if (e.key === 'ArrowUp' && idx > 0) links[idx - 1].click();
  }
});

/* ── PRINT BUTTON (Optional) ───────────────────────────── */
// Add a floating print button
const printBtn = document.createElement('button');
printBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg> Print Report`;
printBtn.style.cssText = `
  position: fixed; bottom: 2rem; right: 2rem; z-index: 999;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  color: white; border: none; border-radius: 50px;
  padding: .65rem 1.4rem; font-size: .82rem; font-weight: 600;
  cursor: pointer; display: flex; align-items: center; gap: .5rem;
  box-shadow: 0 4px 20px rgba(37,99,235,.4);
  font-family: 'Inter', sans-serif;
  transition: transform 0.2s, box-shadow 0.2s;
`;
printBtn.addEventListener('mouseover', () => {
  printBtn.style.transform = 'translateY(-2px)';
  printBtn.style.boxShadow = '0 6px 25px rgba(37,99,235,.5)';
});
printBtn.addEventListener('mouseleave', () => {
  printBtn.style.transform = '';
  printBtn.style.boxShadow = '0 4px 20px rgba(37,99,235,.4)';
});
printBtn.addEventListener('click', () => window.print());
document.body.appendChild(printBtn);

console.log(
  '%cCyberGov Risk Report v1.0\n%cJunior Cyber Security Analyst Internship — Week 1\nTamil Nadu E-Governance Agency, Chennai',
  'color:#60a5fa;font-size:16px;font-weight:bold;',
  'color:#94a3b8;font-size:12px;'
);
