// ---------------------------------------------------------------------------
// Rendering logic for the trip tracker. Reads LEGS / DAYS / OPEN_ITEMS /
// PREP_ITEMS from data.js. No build step, no dependencies.
// ---------------------------------------------------------------------------

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function todayISO() {
  const d = new Date();
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d - tz).toISOString().slice(0, 10);
}

function findDay(iso) {
  return DAYS.find((d) => d.date === iso);
}

function findLeg(id) {
  return LEGS.find((l) => l.id === id);
}

function formatDateLabel(iso) {
  const d = new Date(iso + "T00:00:00");
  return `${DOW[d.getDay()]}, ${MONTH_NAMES[d.getMonth()].slice(0, 3)} ${d.getDate()}`;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ---------------- Local edit state (prep checklist + open items) ----------
// Stored in this browser's localStorage only — not synced anywhere. Each
// group tracks which default items were removed, which custom items were
// added, and (for the checklist) which items are checked off.

const STORAGE_KEY = "triptracker-edits-v1";

function loadEditState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    /* ignore corrupt storage */
  }
  return { prep: {}, openItems: { added: [], removed: [] } };
}

function saveEditState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(EDIT_STATE));
}

const EDIT_STATE = loadEditState();

function prepGroupState(heading) {
  if (!EDIT_STATE.prep[heading]) {
    EDIT_STATE.prep[heading] = { added: [], removed: [], checked: {} };
  }
  return EDIT_STATE.prep[heading];
}

function openItemsState() {
  if (!EDIT_STATE.openItems) EDIT_STATE.openItems = { added: [], removed: [] };
  return EDIT_STATE.openItems;
}

// ---------------- Hero ----------------

function renderHero() {
  const hero = document.getElementById("hero");
  const today = todayISO();
  const first = DAYS[0].date;
  const last = DAYS[DAYS.length - 1].date;

  if (today < first) {
    const days = Math.round((new Date(first) - new Date(today)) / 86400000);
    hero.innerHTML = `
      <div class="hero-eyebrow">Trip starts in ${days} day${days === 1 ? "" : "s"}</div>
      <div class="hero-city">Still in Toronto</div>
      <div class="hero-sub">Departure: Thu 6 Aug, 23:45 · Air Transat TS 376</div>
      <a class="hero-btn" href="#day-${first}">View departure day</a>
    `;
    return;
  }

  if (today > last) {
    hero.innerHTML = `
      <div class="hero-eyebrow">Trip complete</div>
      <div class="hero-city">Back in Toronto</div>
      <div class="hero-sub">Landed 6 Sep, 19:45 · YYZ</div>
    `;
    return;
  }

  const day = findDay(today);
  const leg = findLeg(day.leg);
  const flat = [...day.schedule.morning, ...day.schedule.lunch, ...day.schedule.evening].slice(0, 4);
  const items = flat.map((a) => `<li>${a}</li>`).join("");
  hero.innerHTML = `
    <div class="hero-eyebrow">Right now — ${formatDateLabel(today)}</div>
    <div class="hero-city">${leg.city}${leg.sub ? ` <span style="color:var(--muted);font-weight:400;font-size:1.1rem;">· ${leg.sub}</span>` : ""}</div>
    <div class="hero-sub">${day.title}${day.staying ? " · Staying: " + day.staying : ""}</div>
    ${day.going ? `<div class="hero-sub">${day.going}</div>` : ""}
    <ul class="hero-agenda">${items}</ul>
    <a class="hero-btn" href="#day-${today}">View full day</a>
  `;
}

// ---------------- Timeline ----------------

function renderTimeline() {
  const el = document.getElementById("timeline");
  const today = todayISO();
  el.innerHTML = "";
  LEGS.forEach((leg) => {
    const start = leg.start || DAYS[0].date;
    const end = leg.end || DAYS[DAYS.length - 1].date;
    const isCurrent = today >= start && today <= end;
    const btn = document.createElement("button");
    btn.className = "timeline-item" + (isCurrent ? " current" : "");
    btn.innerHTML = `
      <span class="dot" style="background:${leg.color}"></span>
      <div class="city">${leg.city}</div>
      <div class="sub">${leg.sub}</div>
      <div class="range">${formatRange(start, end)}</div>
    `;
    btn.addEventListener("click", () => jumpTo(firstDayOfLeg(leg.id)));
    el.appendChild(btn);
  });
}

function firstDayOfLeg(legId) {
  const d = DAYS.find((d) => d.leg === legId);
  return d ? d.date : DAYS[0].date;
}

function formatRange(startIso, endIso) {
  const s = new Date(startIso + "T00:00:00");
  const e = new Date(endIso + "T00:00:00");
  const fmt = (d) => `${MONTH_NAMES[d.getMonth()].slice(0, 3)} ${d.getDate()}`;
  return `${fmt(s)} – ${fmt(e)}`;
}

// ---------------- Calendar ----------------

function renderCalendars() {
  const el = document.getElementById("calendars");
  el.innerHTML = "";
  el.appendChild(renderMonth(2026, 7)); // August (0-indexed)
  el.appendChild(renderMonth(2026, 8)); // September
}

function renderMonth(year, monthIndex) {
  const today = todayISO();
  const container = document.createElement("div");
  container.className = "month";

  const firstOfMonth = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const startOffset = firstOfMonth.getDay();

  let html = `<h3>${MONTH_NAMES[monthIndex]} ${year}</h3><div class="month-grid">`;
  DOW.forEach((d) => (html += `<div class="dow">${d}</div>`));
  for (let i = 0; i < startOffset; i++) html += `<div class="day-cell empty"></div>`;

  for (let day = 1; day <= daysInMonth; day++) {
    const iso = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const entry = findDay(iso);
    const leg = entry ? findLeg(entry.leg) : null;
    const classes = ["day-cell"];
    if (iso === today) classes.push("today");
    if (leg) classes.push("has-leg");
    const style = leg ? `style="background:${leg.color}"` : "";
    html += `<button class="${classes.join(" ")}" ${style} data-date="${iso}" ${entry ? "" : "disabled"}>${day}</button>`;
  }

  html += `</div>`;
  container.innerHTML = html;

  container.querySelectorAll(".day-cell[data-date]").forEach((cell) => {
    cell.addEventListener("click", () => jumpTo(cell.dataset.date));
  });

  return container;
}

// ---------------- Prep checklist (editable) ----------------

function renderPrep() {
  const el = document.getElementById("prep");
  el.innerHTML = "";

  Object.entries(PREP_ITEMS).forEach(([heading, defaults]) => {
    const gState = prepGroupState(heading);
    const items = defaults
      .filter((t) => !gState.removed.includes(t))
      .map((t) => ({ text: t, custom: false }))
      .concat(gState.added.map((t) => ({ text: t, custom: true })));

    const panel = document.createElement("div");
    panel.className = "panel";

    const rows = items
      .map((item) => {
        const checked = !!gState.checked[item.text];
        return `
          <li class="check-item${checked ? " checked" : ""}" data-heading="${escapeHtml(heading)}" data-text="${escapeHtml(item.text)}" data-custom="${item.custom}">
            <label>
              <input type="checkbox" ${checked ? "checked" : ""} />
              <span>${escapeHtml(item.text)}</span>
            </label>
            <button type="button" class="remove-btn" title="Remove">×</button>
          </li>`;
      })
      .join("");

    panel.innerHTML = `
      <strong>${heading}</strong>
      <ul class="checklist">${rows || `<li class="empty">Nothing here.</li>`}</ul>
      <form class="add-row" data-heading="${escapeHtml(heading)}">
        <input type="text" placeholder="Add item…" maxlength="200" />
        <button type="submit">Add</button>
      </form>
    `;
    el.appendChild(panel);
  });

  el.querySelectorAll(".check-item input[type=checkbox]").forEach((cb) => {
    cb.addEventListener("change", () => {
      const li = cb.closest(".check-item");
      const gState = prepGroupState(li.dataset.heading);
      gState.checked[li.dataset.text] = cb.checked;
      li.classList.toggle("checked", cb.checked);
      saveEditState();
    });
  });

  el.querySelectorAll(".check-item .remove-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const li = btn.closest(".check-item");
      const gState = prepGroupState(li.dataset.heading);
      const text = li.dataset.text;
      if (li.dataset.custom === "true") {
        gState.added = gState.added.filter((t) => t !== text);
      } else if (!gState.removed.includes(text)) {
        gState.removed.push(text);
      }
      delete gState.checked[text];
      saveEditState();
      renderPrep();
    });
  });

  el.querySelectorAll(".add-row").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector("input");
      const text = input.value.trim();
      if (!text) return;
      prepGroupState(form.dataset.heading).added.push(text);
      saveEditState();
      renderPrep();
    });
  });
}

// ---------------- Open items (editable) ----------------

function renderOpenItems() {
  const el = document.getElementById("open-items");
  const state = openItemsState();
  const items = OPEN_ITEMS.filter((t) => !state.removed.includes(t))
    .map((t) => ({ text: t, custom: false }))
    .concat(state.added.map((t) => ({ text: t, custom: true })));

  el.innerHTML =
    items
      .map(
        (item) => `
      <li data-text="${escapeHtml(item.text)}" data-custom="${item.custom}">
        <span>${escapeHtml(item.text)}</span>
        <button type="button" class="remove-btn" title="Remove">×</button>
      </li>`
      )
      .join("") || `<li class="empty">Nothing open right now.</li>`;

  el.querySelectorAll("li .remove-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const li = btn.closest("li");
      const text = li.dataset.text;
      if (li.dataset.custom === "true") {
        state.added = state.added.filter((t) => t !== text);
      } else if (!state.removed.includes(text)) {
        state.removed.push(text);
      }
      saveEditState();
      renderOpenItems();
    });
  });
}

document.getElementById("open-items-add").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = e.target.querySelector("input");
  const text = input.value.trim();
  if (!text) return;
  openItemsState().added.push(text);
  saveEditState();
  renderOpenItems();
});

// ---------------- Agenda ----------------

function renderAgenda() {
  const el = document.getElementById("agenda");
  el.innerHTML = "";
  DAYS.forEach((day) => {
    const leg = findLeg(day.leg);
    const card = document.createElement("div");
    card.className = "day-card";
    card.id = `day-${day.date}`;

    let flightHtml = "";
    if (day.flight) {
      flightHtml = `
        <div class="flight-box">
          <div class="route">✈ ${day.flight.route}</div>
          <div>${day.flight.airline} · Confirmation ${day.flight.conf}</div>
          <div>${day.flight.dep}</div>
          <div>${day.flight.arr}</div>
          <div>${day.flight.notes}</div>
        </div>
      `;
    }

    const openHtml = day.open.length
      ? `<div class="open-note">Open: ${day.open.join("; ")}</div>`
      : "";

    const slot = (label, items) =>
      items && items.length
        ? `<div class="slot"><h4>${label}</h4><ul class="agenda-list">${items.map((a) => `<li>${a}</li>`).join("")}</ul></div>`
        : "";

    card.innerHTML = `
      <div class="date-row">
        <span class="date-label">${formatDateLabel(day.date)}</span>
        <span class="badge" style="background:${leg.color}">${leg.city}</span>
      </div>
      <div class="title">${day.title}</div>
      <div class="location-row">
        ${day.staying ? `<div class="accommodation">Staying: ${day.staying}${day.stayingAddress ? ` <span class="address">— ${day.stayingAddress}</span>` : ""}</div>` : ""}
        ${day.going ? `<div class="going">→ ${day.going}</div>` : ""}
      </div>
      ${flightHtml}
      <div class="schedule">
        ${slot("Morning", day.schedule.morning)}
        ${slot("Lunch", day.schedule.lunch)}
        ${slot("Evening", day.schedule.evening)}
      </div>
      ${openHtml}
    `;
    el.appendChild(card);
  });
}

// ---------------- Navigation helpers ----------------

function jumpTo(iso) {
  const card = document.getElementById(`day-${iso}`);
  if (!card) return;
  card.scrollIntoView({ behavior: "smooth", block: "start" });
  card.classList.add("flash");
  setTimeout(() => card.classList.remove("flash"), 1400);
}

document.getElementById("jump-today").addEventListener("click", () => {
  const today = todayISO();
  const first = DAYS[0].date;
  const last = DAYS[DAYS.length - 1].date;
  const target = today < first ? first : today > last ? last : today;
  jumpTo(target);
});

// ---------------- Init ----------------

renderHero();
renderTimeline();
renderCalendars();
renderPrep();
renderOpenItems();
renderAgenda();
