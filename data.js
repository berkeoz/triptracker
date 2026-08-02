// ---------------------------------------------------------------------------
// Trip data. Edit this file to update flights, plans, or agenda items.
// Dates are ISO "YYYY-MM-DD" strings, always interpreted as local trip dates.
//
// Each day in DAYS has:
//   date          "YYYY-MM-DD"
//   leg           id referencing LEGS (controls city label + color)
//   title         short summary shown on the hero card
//   staying       accommodation for that night, or null
//   stayingAddress  full street address of that accommodation, or null
//   going         where you're headed that day (travel days), or null
//   flight        { route, airline, conf, dep, arr, notes } or null
//   schedule      { morning: [...], lunch: [...], evening: [...] }
//   open          array of still-undecided items relevant to that day
// ---------------------------------------------------------------------------

const LEGS = [
  { id: "toronto-home", city: "Toronto", sub: "Home", color: "#7c6f64", tz: "America/Toronto", start: null, end: "2026-08-06" },
  { id: "amsterdam", city: "Amsterdam", sub: "Netherlands", color: "#f5a623", tz: "Europe/Amsterdam", start: "2026-08-07", end: "2026-08-13" },
  { id: "istanbul-1", city: "Istanbul", sub: "Stop 1", color: "#e0483e", tz: "Europe/Istanbul", start: "2026-08-13", end: "2026-08-14" },
  { id: "greece", city: "Samothraki", sub: "Greece", color: "#2f6fd6", tz: "Europe/Athens", start: "2026-08-14", end: "2026-08-17" },
  { id: "istanbul-2", city: "Istanbul", sub: "Stop 2", color: "#e0483e", tz: "Europe/Istanbul", start: "2026-08-17", end: "2026-09-06" },
  { id: "toronto-return", city: "Toronto", sub: "Home", color: "#7c6f64", tz: "America/Toronto", start: "2026-09-06", end: null },
];

const OPEN_ITEMS = [
  "Samothraki: day-by-day plans not decided",
  "Nafel, Melihcan, Ilayda: dates not set",
  "Shareable version of this plan for parents — not yet drafted",
];

const PREP_ITEMS = {
  "House closing (before Aug 6)": ["Electricity", "Water", "Terrace", "Cover the car"],
  "Baggage prep (before Aug 6)": ["Pack gifts (list finalized)", "Pack different bag types", "Bring some plastic bags"],
};

const DAYS = [
  {
    date: "2026-08-01",
    leg: "toronto-home",
    title: "5 days until departure",
    staying: "Home",
    going: null,
    flight: null,
    schedule: { morning: ["No fixed plans yet"], lunch: [], evening: [] },
    open: [],
  },
  {
    date: "2026-08-02",
    leg: "toronto-home",
    title: "4 days until departure",
    staying: "Home",
    going: null,
    flight: null,
    schedule: { morning: ["No fixed plans yet"], lunch: [], evening: [] },
    open: [],
  },
  {
    date: "2026-08-03",
    leg: "toronto-home",
    title: "3 days until departure",
    staying: "Home",
    going: null,
    flight: null,
    schedule: { morning: ["No fixed plans yet"], lunch: [], evening: [] },
    open: [],
  },
  {
    date: "2026-08-04",
    leg: "toronto-home",
    title: "2 days until departure",
    staying: "Home",
    going: null,
    flight: null,
    schedule: { morning: ["No fixed plans yet"], lunch: [], evening: [] },
    open: [],
  },
  {
    date: "2026-08-05",
    leg: "toronto-home",
    title: "1 day until departure",
    staying: "Home",
    going: null,
    flight: null,
    schedule: { morning: ["No fixed plans yet"], lunch: [], evening: [] },
    open: [],
  },
  {
    date: "2026-08-06",
    leg: "toronto-home",
    title: "Departure day",
    staying: null,
    going: "Flying overnight to Amsterdam",
    flight: {
      route: "Toronto → Amsterdam",
      airline: "Air Transat TS 376",
      conf: "TVEZA9",
      dep: "Depart Thu 6 Aug, 23:45 · YYZ, Terminal 3",
      arr: "Arrive Fri 7 Aug, 13:10 · AMS",
      notes: "Non-stop, Economy, A321LR",
    },
    schedule: {
      morning: ["Finish house-closing checklist (electricity, water, terrace, cover the car)"],
      lunch: ["Final packing & last errands"],
      evening: ["Head to Toronto Pearson (YYZ), Terminal 3", "Flight TS 376 departs 23:45"],
    },
    open: [],
  },
  {
    date: "2026-08-07",
    leg: "amsterdam",
    title: "Arrive in Amsterdam",
    staying: "Hotel nhow",
    stayingAddress: "Europaboulevard 2b, 1078 Amsterdam",
    going: "Arriving in Amsterdam from Toronto",
    flight: null,
    schedule: {
      morning: ["In flight — landing 13:10"],
      lunch: ["Arrive AMS 13:10 (Air Transat TS 376)", "Meet Seyhmus at the airport", "Check in at Hotel nhow"],
      evening: [],
    },
    open: [],
  },
  {
    date: "2026-08-08",
    leg: "amsterdam",
    title: "Grachtenfestival + dinner",
    staying: "Hotel nhow",
    stayingAddress: "Europaboulevard 2b, 1078 Amsterdam",
    going: null,
    flight: null,
    schedule: {
      morning: [],
      lunch: ["14:00 — Grachtenfestival: HarmonEast Ensemble"],
      evening: ["20:15 — Dinner reservation, 4 people"],
    },
    open: [],
  },
  {
    date: "2026-08-09",
    leg: "amsterdam",
    title: "Dinner at The Lobby Nesplein",
    staying: "Hotel nhow",
    stayingAddress: "Europaboulevard 2b, 1078 Amsterdam",
    going: null,
    flight: null,
    schedule: {
      morning: [],
      lunch: [],
      evening: ["19:00 — The Lobby Nesplein, dinner for 4, Nes 49"],
    },
    open: [],
  },
  {
    date: "2026-08-10",
    leg: "amsterdam",
    title: "Open day",
    staying: "Hotel nhow",
    stayingAddress: "Europaboulevard 2b, 1078 Amsterdam",
    going: null,
    flight: null,
    schedule: {
      morning: ["No fixed plans yet"],
      lunch: [],
      evening: ["Idea: see Nafel, Melihcan, Ilayda, and others (not yet scheduled)"],
    },
    open: ["Nafel, Melihcan, Ilayda: dates not set"],
  },
  {
    date: "2026-08-11",
    leg: "amsterdam",
    title: "Open day",
    staying: "Hotel nhow",
    stayingAddress: "Europaboulevard 2b, 1078 Amsterdam",
    going: null,
    flight: null,
    schedule: { morning: ["No fixed plans yet"], lunch: [], evening: [] },
    open: [],
  },
  {
    date: "2026-08-12",
    leg: "amsterdam",
    title: "Open day",
    staying: "Hotel nhow",
    stayingAddress: "Europaboulevard 2b, 1078 Amsterdam",
    going: null,
    flight: null,
    schedule: { morning: ["No fixed plans yet"], lunch: [], evening: [] },
    open: [],
  },
  {
    date: "2026-08-13",
    leg: "istanbul-1",
    title: "Amsterdam → Istanbul",
    staying: "Acıbadem, Istanbul",
    stayingAddress: null,
    going: "Flying to Istanbul (Sabiha Gökçen)",
    flight: {
      route: "Amsterdam → Istanbul (Sabiha Gökçen)",
      airline: "Pegasus PC 1258",
      conf: "21QUY3",
      dep: "Depart 13 Aug, 18:30 · AMS",
      arr: "Arrive 13 Aug, 22:55 · SAW",
      notes: "3h25m · online check-in opens 6 Aug",
    },
    schedule: {
      morning: ["Check out of Hotel nhow"],
      lunch: ["Free time / finish packing"],
      evening: ["Flight PC 1258 departs AMS 18:30, arrives SAW 22:55"],
    },
    open: [],
  },
  {
    date: "2026-08-14",
    leg: "greece",
    title: "Istanbul → Samothraki",
    staying: "Kirkos Apartments",
    stayingAddress: "Kamariotissa, 68002, Samothraki, Greece",
    going: "Traveling to Samothraki",
    flight: null,
    schedule: {
      morning: ["Travel to Samothraki"],
      lunch: [],
      evening: ["Arrive and settle into Kirkos Apartments"],
    },
    open: ["Samothraki: day-by-day plans not decided"],
  },
  {
    date: "2026-08-15",
    leg: "greece",
    title: "Samothraki",
    staying: "Kirkos Apartments",
    stayingAddress: "Kamariotissa, 68002, Samothraki, Greece",
    going: null,
    flight: null,
    schedule: { morning: ["Plans TBD"], lunch: ["Plans TBD"], evening: ["Plans TBD"] },
    open: [],
  },
  {
    date: "2026-08-16",
    leg: "greece",
    title: "Samothraki",
    staying: "Kirkos Apartments",
    stayingAddress: "Kamariotissa, 68002, Samothraki, Greece",
    going: null,
    flight: null,
    schedule: { morning: ["Plans TBD"], lunch: ["Plans TBD"], evening: ["Plans TBD"] },
    open: [],
  },
  {
    date: "2026-08-17",
    leg: "istanbul-2",
    title: "Samothraki → Istanbul",
    staying: "Acıbadem, Istanbul",
    stayingAddress: null,
    going: "Returning to Istanbul",
    flight: null,
    schedule: {
      morning: ["Check out of Kirkos Apartments"],
      lunch: ["Travel back to Istanbul"],
      evening: ["Settle in for the rest of the Istanbul stay"],
    },
    open: [],
  },
  {
    date: "2026-08-18",
    leg: "istanbul-2",
    title: "Istanbul — career prep begins",
    staying: "Acıbadem, Istanbul",
    stayingAddress: null,
    going: null,
    flight: null,
    schedule: {
      morning: ["Start career change prep plan"],
      lunch: ["Work on Claude AI Certification"],
      evening: ["Watch: youtube.com/watch?v=kY9z4hiH4nk"],
    },
    open: [],
  },
];

// Aug 19 – Sep 5: ongoing Istanbul stay, no fixed daily plans yet beyond the
// recurring career-prep work. Edit per day once plans firm up.
(function fillIstanbulStay() {
  const start = new Date("2026-08-19T00:00:00");
  const end = new Date("2026-09-05T00:00:00");
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const iso = d.toISOString().slice(0, 10);
    DAYS.push({
      date: iso,
      leg: "istanbul-2",
      title: "Istanbul",
      staying: "Acıbadem, Istanbul",
      stayingAddress: null,
      going: null,
      flight: null,
      schedule: {
        morning: ["Career change prep work"],
        lunch: ["Claude AI Certification study"],
        evening: ["Free time — plans TBD"],
      },
      open: [],
    });
  }
})();

DAYS.push({
  date: "2026-09-06",
  leg: "toronto-return",
  title: "Istanbul → Toronto (return home)",
  staying: null,
  going: "Flying home to Toronto",
  flight: {
    route: "Istanbul → Toronto",
    airline: "Air Transat TS 215",
    conf: "7WS3OZ",
    dep: "Depart Sun 6 Sep, 15:45 · IST",
    arr: "Arrive 6 Sep, 19:45 · YYZ",
    notes: "11h non-stop, Economy, A330-200",
  },
  schedule: {
    morning: ["Final morning in Istanbul, finish packing"],
    lunch: ["Head to IST airport", "Flight TS 215 departs 15:45"],
    evening: ["Arrive Toronto (YYZ) 19:45 — trip ends"],
  },
  open: [],
});

DAYS.sort((a, b) => (a.date < b.date ? -1 : 1));
