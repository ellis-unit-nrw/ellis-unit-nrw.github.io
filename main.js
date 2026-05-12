/* ══════════════════════════════════════════════
   ELLIS Unit NRW — main.js
   ══════════════════════════════════════════════ */

const $ = id => document.getElementById(id);

async function loadJSON(path) {
  const r = await fetch(path);
  if (!r.ok) throw new Error(`Failed: ${path}`);
  return r.json();
}

function initials(name) {
  return name.split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

/* ── Social icons ── */
const ICONS = {
  email:    `<svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  github:   `<svg viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>`,
  twitter:  `<svg viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`,
  website:  `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
};

/* ══════════════════════════════════
   UNIT  (hero left + footer)
   ══════════════════════════════════ */
async function loadUnit() {
  const u = await loadJSON('config/unit.json');

  $('hero-unit-name').textContent = u.name || '';
  $('hero-tagline').textContent   = u.tagline || '';

  // About text
  if (u.about) {
    const div = $('about-text');
    let html = '';
    if (u.about.lead) html += `<p class="lead">${u.about.lead}</p>`;
    (u.about.paragraphs || []).forEach(p => { html += `<p>${p}</p>`; });
    div.innerHTML = html;
  }

  // Research area tags
  const ra = $('research-areas');
if (ra) {
  (u.research_areas || []).forEach(a => {
    const s = document.createElement('span');
    s.className = 'area-tag'; s.textContent = a;
    ra.appendChild(s);
  });
}

  // Social links
  const sl = $('hero-social');
  const s  = u.social || {};
  const mkIcon = (type, href, title) =>
    `<a href="${href}" target="_blank" rel="noopener" class="social-icon" title="${title}" style="fill:none;stroke:currentColor;stroke-width:2">${ICONS[type] || ICONS.website}</a>`;
  if (s.email)    sl.innerHTML += mkIcon('email',    `mailto:${s.email}`, 'Email');
  if (s.website)  sl.innerHTML += mkIcon('website',  s.website,           'Website');
  if (s.twitter)  sl.innerHTML += mkIcon('twitter',  s.twitter,           'Twitter');
  if (s.github)   sl.innerHTML += mkIcon('github',   s.github,            'GitHub');
  if (s.linkedin) sl.innerHTML += mkIcon('linkedin', s.linkedin,          'LinkedIn');

  // Footer
  if ($('footer-name')) $('footer-name').textContent = u.name || '';
  if ($('footer-note') && u.footer?.note) $('footer-note').textContent = u.footer.note;

  // Contact button — email assembled entirely in JS, never in HTML (anti-scraping)
  const btn = $('contact-btn');
  if (btn) {
    const { email_user, email_domain, email_tld } = u.contact || {};
    if (email_user && email_domain && email_tld) {
      btn.addEventListener('click', () => {
        window.location.href = 'mailto:' + email_user + '\u0040' + email_domain + '.' + email_tld;
      });
    }
  }
}

/* ══════════════════════════════════
   NEWS  (hero right panel)
   ══════════════════════════════════ */
async function loadNews() {
  const data = await loadJSON('config/news.json');
  const news = data.news || [];
  const INIT = 5;

  const list = $('hero-news-list');
  const btn  = $('hero-news-more');

  news.forEach((item, i) => {
    const li = document.createElement('li');
    li.className = 'hero-news-item' + (i >= INIT ? ' hidden' : '');

    let body = '';
    if (item.link) {
      body = `${item.text_before || ''}<a href="${item.link}" target="_blank" rel="noopener">${item.link_text || 'Read more'}</a>${item.text_after || ''}`;
    } else {
      body = item.text || '';
    }
    li.innerHTML = `<span class="news-date">${item.date}</span><span>${body}</span>`;
    list.appendChild(li);
  });

  if (news.length > INIT) {
    btn.style.display = 'block';
    btn.addEventListener('click', () => {
      list.querySelectorAll('.hidden').forEach(el => el.classList.remove('hidden'));
      btn.style.display = 'none';
    });
  }
}

/* ══════════════════════════════════
   PARTNERS — hero chips + full section
   ══════════════════════════════════ */
async function loadPartners() {
  const data  = await loadJSON('config/partners.json');
  const unis  = data.partner_universities || [];
  const assoc = data.associated_institutes || [];

  /* ── Hero university chips (optional — removed from hero) ── */
  const heroLogos = $('hero-unis-logos');
  if (heroLogos) {
    unis.forEach(u => {
      const a = document.createElement('a');
      a.href = u.url || '#'; a.target = '_blank'; a.rel = 'noopener';
      a.className = 'hero-uni-chip';
      a.title = u.name;
      a.innerHTML = u.logo
        ? `<img src="${u.logo}" alt="${u.name}">`
        : `<span class="hero-uni-chip-text">${u.short || u.name.split(' ').map(w => w[0]).join('').slice(0, 5)}</span>`;
      heroLogos.appendChild(a);
    });
    if (!unis.length) $('hero-unis').style.display = 'none';
  }

  /* ── Full partner grid ── */
  const grid = $('partner-grid');
  unis.forEach(u => {
    const a = document.createElement('a');
    a.href = u.url || '#'; a.target = '_blank'; a.rel = 'noopener';
    a.className = 'partner-card fade-up';
    const logo = u.logo
      ? `<img src="${u.logo}" alt="${u.name}" class="partner-logo" loading="lazy">`
      : `<div class="partner-logo-placeholder">${u.short || u.name.split(' ').map(w => w[0]).join('').slice(0, 4)}</div>`;
    a.innerHTML = `${logo}<span class="partner-name">${u.name}</span>`;
    grid.appendChild(a);
  });

  /* ── Associated institutes tile grid ── */
  if (!assoc.length) return;
  $('assoc-block').style.display = 'block';
  const assocGrid = $('assoc-grid');
  assoc.forEach(inst => {
    const a = document.createElement('a');
    a.href = inst.url || '#'; a.target = '_blank'; a.rel = 'noopener';
    a.className = 'assoc-card fade-up';
    const logo = inst.logo
      ? `<img src="${inst.logo}" alt="${inst.name}" class="assoc-logo" loading="lazy">`
      : `<div class="assoc-logo-placeholder">${inst.short || inst.name.split(' ').map(w => w[0]).join('').slice(0, 4)}</div>`;
    a.innerHTML = `${logo}<span class="assoc-name">${inst.short || inst.name}</span>`;
    assocGrid.appendChild(a);
  });
}

/* ══════════════════════════════════
   PEOPLE
   ══════════════════════════════════ */
async function loadPeople() {
  const data      = await loadJSON('config/members.json');
  const directors = data.directors || [];
  const members   = data.members   || [];

  function makeCard(p, avatarClass, avatarSize) {
    const av = p.image
      ? `<img src="${p.image}" alt="${p.name}" loading="lazy">`
      : initials(p.name);
    const inner = `
      <div class="${avatarClass}">${av}</div>
      <span class="person-name">${p.name}</span>
      ${p.role        ? `<span class="person-role">${p.role}</span>` : ''}
      ${p.institution ? `<span class="person-inst">${p.institution}</span>` : ''}
    `;
    if (p.website) {
      const a = document.createElement('a');
      a.href = p.website; a.target = '_blank'; a.rel = 'noopener';
      a.className = 'person-card fade-up';
      a.innerHTML = inner;
      return a;
    } else {
      const div = document.createElement('div');
      div.className = 'person-card fade-up';
      div.innerHTML = inner;
      return div;
    }
  }

  // Directors
  const dRow = $('directors-row');
  directors.forEach(p => dRow.appendChild(makeCard(p, 'director-avatar', 108)));

  // Members
  const mGrid = $('members-grid');
  if (!members.length) {
    $('members-block').style.display = 'none';
    return;
  }
  members.forEach(p => mGrid.appendChild(makeCard(p, 'member-avatar', 84)));
}

/* ══════════════════════════════════
   ACTIVITIES
   ══════════════════════════════════ */
async function loadActivities() {
  const data = await loadJSON('config/activities.json');
  const acts = data.activities || [];
  const grid = $('activities-grid');

  if (!acts.length) {
    grid.innerHTML = '<p style="color:var(--gray-500);font-size:14px;font-style:italic">No upcoming activities. Check back soon.</p>';
    return;
  }
  acts.forEach(a => {
    const card = document.createElement('div');
    card.className = 'activity-card fade-up';
    card.innerHTML = `
      <div class="activity-top">
        <span class="activity-type">${a.type || 'Event'}</span>
        <span class="activity-date">${a.date || ''}</span>
      </div>
      <div class="activity-title">${a.title}</div>
      ${a.speaker     ? `<div class="activity-speaker">Speaker: ${a.speaker}</div>` : ''}
      ${a.description ? `<div class="activity-desc">${a.description}</div>` : ''}
      ${a.link        ? `<a href="${a.link}" target="_blank" rel="noopener" class="activity-link">Details →</a>` : ''}
    `;
    grid.appendChild(card);
  });
}

/* ══════════════════════════════════
   OPEN POSITIONS
   ══════════════════════════════════ */
async function loadPositions() {
  const list = $('positions-list');
  if (!list) return; // section is commented out

  let positions = [];
  try {
    const data = await loadJSON('config/positions.json');
    positions  = data.positions || [];
  } catch (_) { /* file optional */ }

  if (!positions.length) {
    list.innerHTML = '<p class="positions-empty">No open positions at this time. Send a speculative enquiry via the Contact button.</p>';
    return;
  }
  positions.forEach(p => {
    const card = document.createElement('div');
    card.className = 'position-card fade-up';
    card.innerHTML = `
      <div class="position-title">${p.title}</div>
      <div class="position-meta">
        ${p.type     ? `<span class="pos-tag">${p.type}</span>` : ''}
        ${p.deadline ? `<span class="pos-deadline">Deadline: ${p.deadline}</span>` : ''}
      </div>
      ${p.description ? `<div class="position-desc">${p.description}</div>` : ''}
      ${p.link        ? `<a href="${p.link}" target="_blank" rel="noopener" class="position-apply">Apply / Learn more →</a>` : ''}
    `;
    list.appendChild(card);
  });
}

/* ══════════════════════════════════
   NAVBAR
   ══════════════════════════════════ */
function initNavbar() {
  const navbar   = $('navbar');
  const heroLogo = $('hero-logo-img');
  const heroH    = () => window.innerHeight * 0.45; // fade over first 45vh

  function onScroll() {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 50);

    // Fade hero logo: fully visible at y=0, invisible at y=heroH()
    if (heroLogo) {
      const progress = Math.min(1, y / heroH());
      heroLogo.style.opacity = String(1 - progress);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  $('nav-toggle').addEventListener('click', () => $('nav-menu').classList.toggle('open'));
  document.querySelectorAll('.nav-link').forEach(l =>
    l.addEventListener('click', () => $('nav-menu').classList.remove('open'))
  );
}

/* ══════════════════════════════════
   SCROLL ANIMATIONS
   ══════════════════════════════════ */

document.querySelector('.scroll-hint-text').addEventListener('click', () => {
  document.querySelector('#partners').scrollIntoView({
    behavior: 'smooth'
  });
});

const scrollHint = document.querySelector('.scroll-hint');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    scrollHint.classList.add('hidden');
  } else {
    scrollHint.classList.remove('hidden');
  }
});

function initAnimations() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.07 });

  document.querySelectorAll('.fade-up').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      el.classList.add('visible'); // already in view on load
    } else {
      obs.observe(el);
    }
  });
}

/* ══════════════════════════════════
   ACTIVE NAV LINK
   ══════════════════════════════════ */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id], footer[id]');
  const links    = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', () => {
    let cur = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 80) cur = s.id; });
    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${cur}`));
  }, { passive: true });
}

/* ══════════════════════════════════
   BOOT
   ══════════════════════════════════ */
async function init() {
  initNavbar();
  if ($('current-year')) $('current-year').textContent = new Date().getFullYear();

  const safe = (fn, label) => fn().catch(e => console.warn(label, e.message));

  await safe(loadUnit,       'unit.json');
  await safe(loadNews,       'news.json');
  await safe(loadPartners,   'partners.json');
  await safe(loadPeople,     'members.json');
  await safe(loadActivities, 'activities.json');
  await safe(loadPositions,  'positions.json');

  // Run animations after all content is injected
  requestAnimationFrame(initAnimations);
  initActiveNav();
}

document.addEventListener('DOMContentLoaded', init);
