// ====== CONFIG ======
const TWITCH_CHANNEL = "alveussanctuary"; // set to "uxfestival" on show day

// ====== Build Twitch URLs with required parent domains ======
const parentMeta = Array.from(document.querySelectorAll('meta[name="twitch-parent"]'));
const parents = parentMeta.length ? parentMeta.map(m => m.content) : [location.hostname];

function buildPlayerUrl(channel){
  const params = new URLSearchParams({
    channel,
    autoplay: "true",
    muted: "true",
    playsinline: "true",
    parent: parents[0]
  });
  parents.slice(1).forEach(p => params.append("parent", p));
  return `https://player.twitch.tv/?${params.toString()}`;
}

function buildChatUrl(channel){
  const params = new URLSearchParams({ parent: parents[0] });
  parents.slice(1).forEach(p => params.append("parent", p));
  return `https://www.twitch.tv/embed/${channel}/chat?darkpopout&${params.toString()}`;
}

document.getElementById("twitchPlayer").src = buildPlayerUrl(TWITCH_CHANNEL);
document.getElementById("twitchChat").src   = buildChatUrl(TWITCH_CHANNEL);

// ====== HUD clock (topline) ======
function two(n){ return String(n).padStart(2, "0"); }
function updateHudClock(){
  const d = new Date();
  const t = `${two(d.getHours())}:${two(d.getMinutes())}:${two(d.getSeconds())}`;
  const el = document.getElementById("hudClock");
  if (el) el.textContent = t;
}
updateHudClock();
setInterval(updateHudClock, 1000);

// ====== Fake Telemetry (aesthetic only) ======
const elBit  = document.getElementById("statBitrate");
const elSrc  = document.getElementById("statSource");
const elFps  = document.getElementById("statFps");
const elLat  = document.getElementById("statLatency");
const elPing = document.getElementById("statPing");
const elCpu  = document.getElementById("statCpu");

// Source is the iframe size (approx “source” feel)
function updateSourceDims(){
  const iframe = document.getElementById("twitchPlayer");
  if (!iframe) return;
  const rect = iframe.getBoundingClientRect();
  elSrc.textContent = `${Math.round(rect.width)}×${Math.round(rect.height)}`;
}

// Random walk helper
function randWalk(v, min, max, step){
  const n = v + (Math.random() * 2 - 1) * step;
  return Math.min(max, Math.max(min, n));
}

let bitrate = 6200; // kbps
let fps = 60;
let latency = 3.2; // sec
let ping = 38;     // ms
let cpu = 21;      // %

function updateTelemetry(){
  bitrate = randWalk(bitrate, 3500, 8500, 220);
  fps     = Math.round(randWalk(fps, 24, 60, 2));
  latency = Math.max(1.2, Math.min(6.0, latency + (Math.random() * 0.6 - 0.3)));
  ping    = Math.round(randWalk(ping, 10, 80, 6));
  cpu     = Math.round(randWalk(cpu, 8, 72, 3));

  if (elBit)  elBit.textContent  = `${Math.round(bitrate)} kbps`;
  if (elFps)  elFps.textContent  = `${fps} fps`;
  if (elLat)  elLat.textContent  = `${latency.toFixed(1)} s`;
  if (elPing) elPing.textContent = `${ping} ms`;
  if (elCpu)  elCpu.textContent  = `${cpu}%`;
  updateSourceDims();
}
updateTelemetry();
setInterval(updateTelemetry, 1200);
window.addEventListener("resize", updateSourceDims);

// ====== Panels (Support / Shop) ======
const modalSupport = document.getElementById("modalSupport");
const modalShop = document.getElementById("modalShop");

function openModal(m){
  m.hidden = false;
  document.body.classList.add("modal-open");
}
function closeModal(m){
  m.hidden = true;
  document.body.classList.remove("modal-open");
}

document.querySelectorAll('.panel[data-panel="support"]').forEach(btn=>{
  btn.addEventListener("click", ()=> openModal(modalSupport));
});
document.querySelectorAll('.panel[data-panel="shop"]').forEach(btn=>{
  btn.addEventListener("click", ()=> openModal(modalShop));
});
document.querySelectorAll("[data-close]").forEach(btn=>{
  btn.addEventListener("click", (e)=>{
    const m = e.currentTarget.closest(".modal");
    if (m) closeModal(m);
  });
});
document.querySelectorAll(".modal").forEach(m=>{
  m.addEventListener("click", (e)=>{ if (e.target === m) closeModal(m); });
});
