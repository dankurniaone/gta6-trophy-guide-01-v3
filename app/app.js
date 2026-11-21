// Leonida Legend — GTA VI trophy guide and tracker.
// Loads the trophy data, renders the roadmap and the trophy cards, and keeps
// the player's earned set in localStorage (exportable and importable as JSON).

const DATA_URL = 'data/trophies.json';
const STORE_KEY = 'leonida-legend-earned-v1';

// The six stages of the road to the Platinum, in the order that wastes the
// least time. Each trophy in trophies.json carries its stage number.
const STAGES = [
  {
    n: 1,
    title: 'First steps in Leonida',
    blurb: 'Play the opening chapters, learn the map, and grab the easy open-world trophies. Try every activity once — Master of None pops early.',
  },
  {
    n: 2,
    title: 'The story, start to finish',
    blurb: 'Chapters 3 and 4, the named missions and the finale. Every hidden story trophy lives here — just keep playing the main missions.',
  },
  {
    n: 3,
    title: 'Strangers of Leonida',
    blurb: 'Eight stranger strands, each ending in a final mission. Andy, Kenton, Billy, Randy, Tyrone, Bret and two more — finish all eight for Strangers & Freaks.',
  },
  {
    n: 4,
    title: 'Collectibles and the map',
    blurb: 'WAiNK at 100 spots, 100 vehicles, card sets, meditation spots, garages and every region of Leonida. Work region by region so nothing is missed.',
  },
  {
    n: 5,
    title: 'Activities and mastery',
    blurb: '250 stunts, gold at every shooting range, drone races, 20 race wins, fishing, the arcade, 50 challenges, robberies and the money trophies. Chip away at it between story beats.',
  },
  {
    n: 6,
    title: 'The Platinum',
    blurb: '100% completion for A Long Road, then Vice Got a Price! pops the moment the 54th trophy lands. One playthrough is enough.',
  },
];

const KIND_LABELS = {
  story: 'Story',
  collectibles: 'Collectibles',
  activities: 'Activities',
  platinum: 'Platinum',
};

// ---------------------------------------------------------------- state
let allTrophies = [];
let earned = new Set();
let kindFilter = 'all';
let stageFilter = 0; // 0 = no stage filter
let searchText = '';
let spoilerMode = false;
let earnedOnly = false;

const $ = (id) => document.getElementById(id);

function loadEarned() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((x) => typeof x === 'string'));
  } catch (_) {
    return new Set();
  }
}

function saveEarned() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify([...earned].sort()));
  } catch (_) {
    // Private mode or a full store: the page still works, it just forgets.
  }
}

// ---------------------------------------------------------------- render
function gradeCountsHtml() {
  const grades = ['platinum', 'gold', 'silver', 'bronze'];
  return grades
    .map((g) => {
      const total = allTrophies.filter((t) => t.grade === g).length;
      const got = allTrophies.filter((t) => t.grade === g && earned.has(t.name)).length;
      const label = g[0].toUpperCase() + g.slice(1);
      return `<span><b>${got}</b>/${total} ${label}</span>`;
    })
    .join('');
}

function renderProgress() {
  const total = allTrophies.length;
  const got = allTrophies.filter((t) => earned.has(t.name)).length;
  const pct = total ? Math.round((got / total) * 100) : 0;
  $('earnedCount').textContent = String(got);
  $('progressFill').style.width = pct + '%';
  $('progressLabel').textContent =
    got === total ? 'Platinum earned — Leonida Legend!' : pct + '% to the Platinum';
  $('gradeCounts').innerHTML = gradeCountsHtml();
}

function renderRoadmap() {
  const missable = allTrophies.filter((t) => t.missable);
  $('missableNote').innerHTML =
    '<strong>Watch out for one trophy:</strong> ' +
    missable.map((t) => t.name).join(', ') +
    ' is the only trophy reported as possibly missable. Keep a manual save at the start of each chapter and meditate at every spot you find as you go.';
  $('stages').innerHTML = STAGES.map((s) => {
    const inStage = allTrophies.filter((t) => t.stage === s.n);
    const got = inStage.filter((t) => earned.has(t.name)).length;
    const active = stageFilter === s.n ? ' style="border-color: var(--accent)"' : '';
    return (
      `<li class="stage" data-stage="${s.n}"${active} role="button" tabindex="0" aria-label="Stage ${s.n}: ${s.title}">` +
      `<span class="stage-num">${s.n}</span>` +
      `<h3>${s.title}</h3>` +
      `<p>${s.blurb}</p>` +
      `<p class="stage-meta">${got}/${inStage.length} earned &middot; click to filter</p>` +
      `</li>`
    );
  }).join('');
  document.querySelectorAll('.stage').forEach((el) => {
    const go = () => {
      const n = Number(el.dataset.stage);
      stageFilter = stageFilter === n ? 0 : n;
      renderAll();
    };
    el.addEventListener('click', go);
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
  });
}

function trophyMatches(t) {
  if (kindFilter === 'missable' && !t.missable) return false;
  if (kindFilter === 'hidden' && !t.hidden) return false;
  if (kindFilter !== 'all' && kindFilter !== 'missable' && kindFilter !== 'hidden' && t.kind !== kindFilter) return false;
  if (stageFilter && t.stage !== stageFilter) return false;
  if (earnedOnly && !earned.has(t.name)) return false;
  if (searchText) {
    const hay = (t.name + ' ' + t.description + ' ' + t.guide + ' ' + t.source).toLowerCase();
    if (!hay.includes(searchText)) return false;
  }
  return true;
}

function cardHtml(t) {
  const isEarned = earned.has(t.name);
  const masked = spoilerMode && t.hidden && !isEarned;
  const name = masked ? 'Hidden trophy' : t.name;
  const official = masked ? 'Story trophy — hidden until earned.' : t.description;
  const guide = masked
    ? 'Turn spoiler mode off, or earn this trophy, to see its guide.'
    : t.guide;
  const gradeClass = 'grade grade-' + t.grade;
  const tags = [];
  tags.push(`<span class="tag">${KIND_LABELS[t.kind] || t.kind}</span>`);
  tags.push(`<span class="tag">Stage ${t.stage}</span>`);
  if (t.hidden) tags.push('<span class="tag hidden-tag">Hidden</span>');
  if (t.missable) tags.push('<span class="tag missable">Possibly missable</span>');
  const unconfirmed = /unconfirmed/i.test(t.source)
    ? ' <span class="unconfirmed">(method not publicly confirmed yet)</span>'
    : '';
  return (
    `<article class="card${isEarned ? ' earned' : ''}" data-name="${t.name.replace(/"/g, '&quot;')}">` +
    `<div class="card-head">` +
    `<input type="checkbox" class="card-check" ${isEarned ? 'checked' : ''} aria-label="Mark ${t.name.replace(/"/g, '')} as earned">` +
    `<div class="card-title"><h3>${name}</h3><p class="official">${official}</p></div>` +
    `<span class="${gradeClass}">${t.grade}</span>` +
    `</div>` +
    `<p class="guide">${guide}${unconfirmed}</p>` +
    `<div class="card-meta">${tags.join('')}</div>` +
    `<p class="card-source">Source: <strong>${t.source}</strong></p>` +
    `</article>`
  );
}

function renderList() {
  const shown = allTrophies.filter(trophyMatches);
  const stage = stageFilter ? STAGES.find((s) => s.n === stageFilter) : null;
  $('listHeading').textContent = stage
    ? `Stage ${stage.n} — ${stage.title} (click the stage again to clear)`
    : kindFilter === 'all'
      ? 'All trophies'
      : kindFilter === 'missable'
        ? 'Possibly missable trophies'
        : kindFilter === 'hidden'
          ? 'Hidden trophies'
          : `${KIND_LABELS[kindFilter] || kindFilter} trophies`;
  $('resultCount').textContent = `Showing ${shown.length} of ${allTrophies.length} trophies` +
    (earned.size ? ` · ${earned.size} earned` : '');
  $('trophyGrid').innerHTML = shown.map(cardHtml).join('');
  $('emptyState').hidden = shown.length > 0;
  document.querySelectorAll('.card-check').forEach((box) => {
    box.addEventListener('change', () => {
      const card = box.closest('.card');
      const name = card.dataset.name;
      if (box.checked) earned.add(name); else earned.delete(name);
      saveEarned();
      renderAll();
    });
  });
}

function renderAll() {
  renderProgress();
  renderRoadmap();
  renderList();
}

// ---------------------------------------------------------------- export / import
function exportProgress() {
  const payload = {
    game: 'Grand Theft Auto VI',
    guide: 'Leonida Legend',
    exportedAt: new Date().toISOString(),
    earned: [...earned].sort(),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'leonida-legend-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
}

function importProgress(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result));
      const names = Array.isArray(parsed) ? parsed : parsed.earned;
      if (!Array.isArray(names)) throw new Error('no list found');
      const known = new Set(allTrophies.map((t) => t.name));
      const kept = names.filter((n) => typeof n === 'string' && known.has(n));
      earned = new Set(kept);
      saveEarned();
      renderAll();
      alert(`Imported ${kept.length} earned trophies.`);
    } catch (e) {
      alert('That file does not look like a Leonida Legend progress export.');
    }
  };
  reader.readAsText(file);
}

// ---------------------------------------------------------------- wire up
function wireToolbar() {
  $('search').addEventListener('input', (e) => {
    searchText = e.target.value.trim().toLowerCase();
    renderList();
  });
  $('kindChips').addEventListener('click', (e) => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    kindFilter = btn.dataset.kind;
    document.querySelectorAll('.chip').forEach((c) => c.classList.toggle('active', c === btn));
    renderList();
  });
  $('spoilerToggle').addEventListener('change', (e) => {
    spoilerMode = e.target.checked;
    renderList();
  });
  $('earnedOnly').addEventListener('change', (e) => {
    earnedOnly = e.target.checked;
    renderList();
  });
  $('exportBtn').addEventListener('click', exportProgress);
  $('importBtn').addEventListener('click', () => $('importFile').click());
  $('importFile').addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) importProgress(e.target.files[0]);
    e.target.value = '';
  });
  $('resetBtn').addEventListener('click', () => {
    if (confirm('Clear all earned trophies? This cannot be undone (export first if you want a backup).')) {
      earned = new Set();
      saveEarned();
      renderAll();
    }
  });
}

// ---------------------------------------------------------------- boot
fetch(DATA_URL)
  .then((r) => { if (!r.ok) throw new Error('trophy data not found'); return r.json(); })
  .then((data) => {
    allTrophies = data.trophies || [];
    earned = loadEarned();
    wireToolbar();
    renderAll();
  })
  .catch(() => {
    $('trophyGrid').innerHTML = '<p class="empty">Could not load the trophy data. Open this page from its own folder (app/index.html) with the data file beside it.</p>';
  });
