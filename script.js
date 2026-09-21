document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  const progress = document.getElementById('progress');
  const toTop = document.getElementById('toTop');
  const menu = document.getElementById('menu');
  const burger = document.getElementById('burger');
  const glow = document.getElementById('glow');
  const year = document.getElementById('year');

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  year.textContent = new Date().getFullYear();

  const onScroll = () => {
    const st = window.scrollY;
    header.classList.toggle('scrolled', st > 40);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (h > 0 ? (st / h) * 100 : 0) + '%';
    toTop.classList.toggle('show', st > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (finePointer.matches) {
    let raf = null;
    window.addEventListener('mousemove', (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        glow.style.opacity = 1;
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
        raf = null;
      });
    });
    document.addEventListener('mouseleave', () => { glow.style.opacity = 0; });
  }

  const roles = [
    'Applied AI Engineer @ Google',
    'LLM & ML Enthusiast',
    'Full-Stack Web Developer',
    'Competitive Programmer',
    "Bug-free? Let's find out",
  ];
  const typedEl = document.getElementById('typed');
  let roleIdx = 0, charIdx = 0, deleting = false;

  const type = () => {
    const word = roles[roleIdx];
    charIdx += deleting ? -1 : 1;
    typedEl.textContent = word.slice(0, charIdx);
    let delay = deleting ? 38 : 72;
    if (!deleting && charIdx === word.length) { delay = 1600; deleting = true; }
    else if (deleting && charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; delay = 350; }
    setTimeout(type, delay);
  };
  type();

  const revealables = document.querySelectorAll('[data-reveal]');
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        revealIO.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });
  revealables.forEach((el) => revealIO.observe(el));

  const fullCounters = document.querySelectorAll('[data-count]');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      counterIO.unobserve(el);
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const dur = 1500;
      const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min((t - t0) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * ease) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  fullCounters.forEach((el) => counterIO.observe(el));

  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.skill-panel');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      panels.forEach((p) => p.classList.remove('active'));
      const panel = document.querySelector(`[data-panel="${tab.dataset.tab}"]`);
      panel.classList.add('active');
      panel.querySelectorAll('.bar i').forEach((bar) => {
        bar.style.width = '0';
        requestAnimationFrame(() => requestAnimationFrame(() => {
          bar.style.width = bar.style.getPropertyValue('--w');
        }));
      });
    });
  });
  document.querySelectorAll('.skill-panel.active .bar i').forEach((bar) => {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      bar.style.width = bar.style.getPropertyValue('--w');
    }));
  });

  const projects = document.querySelectorAll('.project');
  projects.forEach((card) => {
    if (!finePointer.matches) return;
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const rx = ((y / r.height) - 0.5) * -8;
      const ry = ((x / r.width) - 0.5) * 8;
      card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      card.style.setProperty('--mx', ((x / r.width) * 100) + '%');
      card.style.setProperty('--my', ((y / r.height) * 100) + '%');
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateX(0) rotateY(0)';
    });
  });

  burger.addEventListener('click', () => {
    menu.classList.toggle('open');
    burger.classList.toggle('open');
  });
  menu.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      burger.classList.remove('open');
    });
  });

  const sections = document.querySelectorAll('section[id]');
  const navLinks = menu.querySelectorAll('a');
  const navIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        navLinks.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => navIO.observe(s));

  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const sparkles = document.getElementById('sparkles');
  for (let i = 0; i < 26; i++) {
    const s = document.createElement('span');
    const size = 2 + Math.random() * 4;
    s.style.cssText = `left:${Math.random() * 100}%;width:${size}px;height:${size}px;` +
      `animation-duration:${9 + Math.random() * 14}s;animation-delay:${-Math.random() * 18}s;opacity:${0.3 + Math.random() * 0.5};`;
    sparkles.appendChild(s);
  }

  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const [mail, msg] = form.elements;
      const subject = encodeURIComponent('Hello from your portfolio 👋');
      const body = encodeURIComponent((mail.value ? `From: ${mail.value}\n\n` : '') + msg.value);
      window.location.href = `mailto:giriteja94495@gmail.com?subject=${subject}&body=${body}`;
    });
  }
});