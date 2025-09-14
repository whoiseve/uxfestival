// Channel to show (set to "uxfestival" on show day)
const TWITCH_CHANNEL = "madsy";

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

// Modals
const modalSupport = document.getElementById("modalSupport");
const modalShop = document.getElementById("modalShop");
function openModal(m){ m.hidden=false; document.body.classList.add("modal-open"); }
function closeModal(m){ m.hidden=true;  document.body.classList.remove("modal-open"); }
document.querySelectorAll('.panel[data-panel="support"]').forEach(b=>b.addEventListener("click",()=>openModal(modalSupport)));
document.querySelectorAll('.panel[data-panel="shop"]').forEach(b=>b.addEventListener("click",()=>openModal(modalShop)));
document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",(e)=>{ const m=e.currentTarget.closest(".modal"); if(m) closeModal(m); }));
document.querySelectorAll(".modal").forEach(m=>m.addEventListener("click",(e)=>{ if(e.target===m) closeModal(m); }));
