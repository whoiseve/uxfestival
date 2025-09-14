// Channel to show (set to "uxfestival" on show day)
const TWITCH_CHANNEL = "shrimps247";

// Parents from <meta name="twitch-parent">
const parentMeta = Array.from(document.querySelectorAll('meta[name="twitch-parent"]'));
const parents = parentMeta.length ? parentMeta.map(m => m.content) : [location.hostname];

// Build & attach player + chat (no autoplay — let Twitch show its Play)
(function initEmbeds(){
  const player = document.getElementById("twitchPlayer");
  const chat   = document.getElementById("twitchChat");

  const p = new URLSearchParams({
    channel: TWITCH_CHANNEL,
    muted: "true",
    autoplay: "false",    // Brave-proof: user clicks Play
    playsinline: "true",
    parent: parents[0]
  });
  parents.slice(1).forEach(h => p.append("parent", h));
  player.src = `https://player.twitch.tv/?${p.toString()}`;

  const c = new URLSearchParams({ parent: parents[0] });
  parents.slice(1).forEach(h => c.append("parent", h));
  chat.src = `https://www.twitch.tv/embed/${TWITCH_CHANNEL}/chat?darkpopout&${c.toString()}`;
})();

// HUD clock
function two(n){ return String(n).padStart(2,"0"); }
function tickClock(){
  const d = new Date();
  const el = document.getElementById("hudClock");
  if (el) el.textContent = `${two(d.getHours())}:${two(d.getMinutes())}:${two(d.getSeconds())}`;
}
tickClock(); setInterval(tickClock, 1000);

// Fake telemetry
const elBit  = document.getElementById("statBitrate");
const elSrc  = document.getElementById("statSource");
const elFps  = document.getElementById("statFps");
const elLat  = document.getElementById("statLatency");
const elPing = document.getElementById("statPing");
const elCpu  = document.getElementById("statCpu");

function randWalk(v,min,max,step){ const n=v+(Math.random()*2-1)*step; return Math.min(max,Math.max(min,n)); }
function updateDims(){
  const r = document.getElementById("twitchPlayer")?.getBoundingClientRect();
  if (r && elSrc) elSrc.textContent = `${Math.round(r.width)}×${Math.round(r.height)}`;
}
let bitrate=6200,fps=60,latency=3.2,ping=38,cpu=21;
function updateStats(){
  bitrate = randWalk(bitrate,3500,8500,220);
  fps     = Math.round(randWalk(fps,24,60,2));
  latency = Math.max(1.2, Math.min(6.0, latency + (Math.random()*0.6-0.3)));
  ping    = Math.round(randWalk(ping,10,80,6));
  cpu     = Math.round(randWalk(cpu,8,72,3));

  if (elBit)  elBit.textContent  = `${Math.round(bitrate)} kbps`;
  if (elFps)  elFps.textContent  = `${fps} fps`;
  if (elLat)  elLat.textContent  = `${latency.toFixed(1)} s`;
  if (elPing) elPing.textContent = `${ping} ms`;
  if (elCpu)  elCpu.textContent  = `${cpu}%`;
  updateDims();
}
updateStats(); setInterval(updateStats, 1200);
window.addEventListener("resize", updateDims);


// ===== NODE box "live data" animation =====
// ===== NODE box "live data" animation (locations + TAG + numbers) =====
(function animateNodeBox(){
  const box = document.getElementById("nodeBox");
  if (!box) return;

  // ---------- CONFIG ----------
  const CFG = {
    numbersEveryMs: 40,          // how fast YYYY-like code changes (lower = faster)
    locChangeMinMs: 200,         // how often LOC-REG swaps
    locChangeMaxMs: 1200,
    tagChangeMinMs: 200,        // how often TAG (3 letters) swaps
    tagChangeMaxMs: 2600,

    // numeric segments (xxxx-xx-xx)
    segments: [
      { min: 1,    max: 9999, pad: 4 }, // xxxx
      { min: 0,    max: 99,   pad: 2 }, // xx
      { min: 0,    max: 99,   pad: 2 }  // xx
    ],

    usePools: true,              // use curated pools for LOC & TAG; set false for random letters
  };

  // pools (extend anytime)
  const cityCodes = [
    "VAN","NYC","TKO","LON","SFO","SYD","BER","TOR","HKG","AMS","DXB","PAR","ROM","MAD","BCN",
    "IST","ATH","CAI","DEL","BOM","SIN","KUL","MNL","BKK","HCM","OSA","SEL","TYO","LAX","SEA",
    "PDX","AUS","DAL","HOU","CHI","BOS","PHL","ATL","DEN","PHX","LAS","SLC","MSP","DTW","CLT",
    "RDU","YUL","YOW","YVR","YYZ","YEG","YHZ","WAW","PRG","VIE","ZRH","MUC","FRA","HAM","DUS",
    "MAN","EDI","GLA","DUB","OSL","ARN","HEL","CPH","RIX","VNO","SOF","BUH","BEG","LIS","BRU",
    "LUX","GVA","NCE","LYS","TPE","ICN","KIX","NRT","CTS","PVG","PEK","SZX","GIG","GRU","EZE"
  ];
  const regionCodes = [
    "US","CA","MX","BR","AR","CL","UK","IE","FR","DE","NL","BE","ES","PT","IT","CH","AT","DK",
    "NO","SE","FI","PL","CZ","HU","RO","BG","GR","TR","AE","SA","IL","EG","ZA","IN","CN","HK",
    "TW","JP","KR","SG","MY","TH","VN","PH","ID","AU","NZ"
  ];
  const tagPool = [
    "REV","SYS","UPG","BLD","OPS","PTC","DEP","SEC","TST","LOG",
    "MON","CAL","DRP","SYN","NET","CPU","GPU","MEM","IOP","TMP"
  ];

  // helpers
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randLetters = n => Array.from({length:n}, ()=>letters[Math.floor(Math.random()*letters.length)]).join("");
  const pad = (n, w) => String(n).padStart(w, "0");
  const rint = (min, max) => Math.floor(Math.random()*(max-min+1)) + min;
  const nextDelay = (min, max) => performance.now() + rint(min, max);

  const makeLoc = () => CFG.usePools
    ? `${cityCodes[Math.floor(Math.random()*cityCodes.length)]}-${regionCodes[Math.floor(Math.random()*regionCodes.length)]}`
    : `${randLetters(3)}-${randLetters(2)}`;

  const makeTag = () => CFG.usePools
    ? tagPool[Math.floor(Math.random()*tagPool.length)]
    : randLetters(3);

  const makeNumberCode = () => {
    const [A,B,C] = CFG.segments;
    const a = pad(rint(A.min, A.max), A.pad);
    const b = pad(rint(B.min, B.max), B.pad);
    const c = pad(rint(C.min, C.max), C.pad);
    return `${a}-${b}-${c}`;
  };

  // rows (skip title)
  const rows = Array.from(box.querySelectorAll(".rail__meta"));

  const state = rows.map(el => {
    const txt = el.textContent.trim();
    const m = txt.match(/^([A-Z]{3}-[A-Z]{2})\s*•\s*([A-Z]{3})\s*([0-9\-]+)$/);
    return {
      el,
      loc: m ? m[1] : makeLoc(),
      tag: m ? m[2] : makeTag(),
      nextLocChange: nextDelay(CFG.locChangeMinMs, CFG.locChangeMaxMs),
      nextTagChange: nextDelay(CFG.tagChangeMinMs, CFG.tagChangeMaxMs),
    };
  });

  rows.forEach(el => el.style.fontVariantNumeric = "tabular-nums");

  setInterval(() => {
    const now = performance.now();
    state.forEach(s => {
      if (now >= s.nextLocChange) {
        s.loc = makeLoc();
        s.nextLocChange = nextDelay(CFG.locChangeMinMs, CFG.locChangeMaxMs);
      }
      if (now >= s.nextTagChange) {
        s.tag = makeTag();
        s.nextTagChange = nextDelay(CFG.tagChangeMinMs, CFG.tagChangeMaxMs);
      }

      const code = makeNumberCode();
      s.el.textContent = `${s.loc} • ${s.tag} ${code}`;

      // quick pulse
      s.el.classList.add("flash");
      setTimeout(()=>s.el.classList.remove("flash"), 70);
    });
  }, CFG.numbersEveryMs);
})();


