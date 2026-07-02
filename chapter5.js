/* ============================================
   chapter5.js — Generative Type · Reactive Inputs
   ============================================ */

document.addEventListener('touchmove', function(e) { e.preventDefault(); }, { passive: false });

const CHAPTER_ID = 5;

document.getElementById("btn-complete").addEventListener("click", () => markComplete(CHAPTER_ID));
renderDots(CHAPTER_ID);

/* ── Config ─────────────────────────────────── */
// EMA factors: higher = faster response, lower = smoother (less jitter)
const AUDIO_ALPHA = 0.12;
const FACE_ALPHA  = 0.07;  // slightly higher to compensate for 100ms detection interval

// Normalized inter-landmark distance thresholds (fraction of video width).
// BlazeFace landmark[0]=rightEye, [1]=leftEye, [2]=nose, [3]=mouth
// At ~1m: combined metric ≈ 0.05–0.07; at ~30cm: ≈ 0.20–0.25
const FACE_FAR   = 0.05;
const FACE_CLOSE = 0.22;

// Font size range (px): far = large type, close = small type
const SIZE_FAR   = 96;
const SIZE_CLOSE = 26;

/* ── State ──────────────────────────────────── */
let audioOn  = false;
let distOn   = false;
let audioInf = 70;
let distInf  = 60;
let smoothAudio = 0;   // EMA-smoothed mic RMS [0–1]
let smoothDist  = 0;   // EMA-smoothed proximity [0–1], 0=far, 1=close

/* ── DOM refs ────────────────────────────────── */
const textEl      = document.getElementById("ch5-text");
const switchAudio = document.getElementById("switch-audio");
const switchDist  = document.getElementById("switch-dist");
const toggleAudio = document.getElementById("toggle-audio");
const toggleDist  = document.getElementById("toggle-dist");
const audioInfRow = document.getElementById("audio-influence-row");
const distInfRow  = document.getElementById("dist-influence-row");
const videoEl     = document.getElementById("ch5-cam");
const faceCanvas  = document.getElementById("ch5-facecanvas");
const faceCtx     = faceCanvas.getContext("2d");
const camPreview  = document.getElementById("ch5-cam-preview");
const stageLabel  = document.getElementById("ch5-stage-label");
const stageEl     = document.getElementById("ch5-stage");

/* ── Slider builder ──────────────────────────── */
function buildSlider(container, min, max, value, onchange) {
  const track = document.createElement("div");
  track.className = "slider-track";
  const fill  = document.createElement("div");
  fill.className = "slider-fill";
  const thumb = document.createElement("div");
  thumb.className = "slider-thumb";
  const input = document.createElement("input");
  input.type = "range"; input.className = "slider-native";
  input.min = min; input.max = max; input.step = 1; input.value = value;
  const pct = ((value - min) / (max - min)) * 100;
  fill.style.width = pct + "%";
  thumb.style.left = pct + "%";
  input.addEventListener("input", () => {
    const v = parseFloat(input.value);
    const p = ((v - min) / (max - min)) * 100;
    fill.style.width = p + "%";
    thumb.style.left = p + "%";
    onchange(v);
  });
  track.appendChild(fill);
  track.appendChild(thumb);
  track.appendChild(input);
  container.appendChild(track);
}

buildSlider(document.getElementById("audio-inf-slider"), 0, 100, audioInf, v => {
  audioInf = v;
  document.getElementById("audio-inf-val").textContent = v + "%";
});
buildSlider(document.getElementById("dist-inf-slider"), 0, 100, distInf, v => {
  distInf = v;
  document.getElementById("dist-inf-val").textContent = v + "%";
});

/* ── Status text helpers ─────────────────────── */
function setAudioStatus(msg) { document.getElementById("audio-status").textContent = msg; }
function setDistStatus(msg)  { document.getElementById("dist-status").textContent = msg; }

function updateStageLabel() {
  if (audioOn && distOn)  { stageLabel.textContent = "BÜHNE · Mikrofon + Gesichtserkennung aktiv"; return; }
  if (audioOn)            { stageLabel.textContent = "BÜHNE · Mikrofon aktiv"; return; }
  if (distOn)             { stageLabel.textContent = "BÜHNE · Bewege dich vor der Kamera"; return; }
  stageLabel.textContent = "BÜHNE · Eingaben aktivieren, um zu beginnen";
}

function updateDisplayText() {
  if (audioOn && distOn)  { textEl.textContent = "Schrift, die zuhört.\nSchrift, die zusieht."; return; }
  if (audioOn)            { textEl.textContent = "Schrift, die zuhört."; return; }
  if (distOn)             { textEl.textContent = "Schrift, die zusieht."; return; }
  textEl.textContent = "Schrift, die zuhört.";
}

/* ═══════════════════════════════════════════════
   MICROPHONE  (Web Audio API)
   ═══════════════════════════════════════════════ */
let audioCtx = null, analyser = null, micBuffer = null;

async function initMic() {
  try {
    setAudioStatus("verbinde…");
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const src = audioCtx.createMediaStreamSource(stream);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.4;
    src.connect(analyser);
    micBuffer = new Float32Array(analyser.fftSize);
    setAudioStatus("aktiv");
  } catch (e) {
    setAudioStatus(e.name === "NotAllowedError" ? "verweigert" : "Fehler");
    // Revert toggle without triggering initMic again
    audioOn = false;
    switchAudio.classList.remove("on");
    toggleAudio.classList.remove("on");
    audioInfRow.style.opacity = "0.4";
    updateStageLabel();
  }
}

function teardownMic() {
  if (audioCtx) {
    try { audioCtx.close(); } catch {}
    audioCtx = null; analyser = null; micBuffer = null;
  }
}

// Returns mic RMS amplitude in [0, 1]
function sampleRMS() {
  if (!analyser) return 0;
  analyser.getFloatTimeDomainData(micBuffer);
  let sum = 0;
  for (let i = 0; i < micBuffer.length; i++) sum += micBuffer[i] * micBuffer[i];
  // Multiply by ~14 to map typical speaking range (0.02–0.07) to 0.3–1
  return Math.min(1, Math.sqrt(sum / micBuffer.length) * 14);
}

/* ═══════════════════════════════════════════════
   CAMERA + BLAZEFACE  (face landmark detection)
   ═══════════════════════════════════════════════ */
let faceModel = null, camStream = null, faceLoopActive = false;
let faceRvfcHandle = null, inferenceRunning = false;

async function initCamera() {
  try {
    setDistStatus("Kamera startet…");

    if (typeof blazeface === "undefined") {
      setDistStatus("Modell nicht verfügbar");
      throw new Error("blazeface not loaded");
    }

    // Request front camera at low resolution (faster detection)
    camStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user", width: { ideal: 240 }, height: { ideal: 180 } },
      audio: false,
    });
    videoEl.srcObject = camStream;
    await new Promise(r => { videoEl.onloadedmetadata = r; });
    videoEl.play();

    // Set canvas dimensions once here — resetting them every frame is expensive
    faceCanvas.width  = videoEl.videoWidth  || 240;
    faceCanvas.height = videoEl.videoHeight || 180;

    setDistStatus("Modell lädt…");
    faceModel = await blazeface.load();

    setDistStatus("erkenne…");
    faceLoopActive = true;
    startFaceTracking();
  } catch (e) {
    const msg = e.name === "NotAllowedError" ? "verweigert" : (e.message.includes("unavailable") ? "nicht verfügbar" : "Fehler");
    setDistStatus(msg);
    distOn = false;
    switchDist.classList.remove("on");
    toggleDist.classList.remove("on");
    distInfRow.style.opacity = "0.4";
    updateStageLabel();
  }
}

function teardownCamera() {
  faceLoopActive = false;
  inferenceRunning = false;
  if (faceRvfcHandle !== null) {
    videoEl.cancelVideoFrameCallback(faceRvfcHandle);
    faceRvfcHandle = null;
  }
  if (camStream) { camStream.getTracks().forEach(t => t.stop()); camStream = null; }
  faceModel = null;
  camPreview.style.display = "none";
  faceCtx.clearRect(0, 0, faceCanvas.width, faceCanvas.height);
}

function ptDist([x1, y1], [x2, y2]) {
  const dx = x2 - x1, dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

// Shared landmark processing — called from both rVFC and fallback path
function processFacePreds(preds) {
  if (preds.length > 0) {
    const lm = preds[0].landmarks;
    const eyeMid     = [(lm[0][0] + lm[1][0]) / 2, (lm[0][1] + lm[1][1]) / 2];
    const eyeSpan    = ptDist(lm[0], lm[1]);
    const faceHeight = ptDist(eyeMid, lm[3]);
    const combined   = (eyeSpan + faceHeight) / 2;
    const rawNorm    = combined / (videoEl.videoWidth || 240);
    const clamped    = Math.max(0, Math.min(1, (rawNorm - FACE_FAR) / (FACE_CLOSE - FACE_FAR)));
    const nudge      = (clamped - smoothDist) * FACE_ALPHA;
    if (Math.abs(nudge) > 0.0008) smoothDist += nudge;
    setDistStatus("Gesicht erkannt");
    drawPreview(lm);
    camPreview.style.display = "block";
  } else {
    setDistStatus("kein Gesicht erkannt");
  }
}

// Start tracking — prefer requestVideoFrameCallback (iOS 15.4+), fall back to setTimeout
function startFaceTracking() {
  if ('requestVideoFrameCallback' in HTMLVideoElement.prototype) {
    faceRvfcHandle = videoEl.requestVideoFrameCallback(faceCallback);
  } else {
    faceLoop();
  }
}

// rVFC path: fires once per available camera frame (max = camera fps, typically 30)
async function faceCallback(_now, _meta) {
  if (!faceLoopActive) return;
  // Re-register immediately so we never miss a frame while inference is running
  faceRvfcHandle = videoEl.requestVideoFrameCallback(faceCallback);
  if (inferenceRunning || document.hidden || videoEl.readyState < 2 || !faceModel) return;
  inferenceRunning = true;
  try {
    processFacePreds(await faceModel.estimateFaces(videoEl, false));
  } catch (_) {}
  inferenceRunning = false;
}

// Fallback for iOS < 15.4 (no requestVideoFrameCallback support)
async function faceLoop() {
  if (!faceLoopActive) return;
  if (document.hidden) { setTimeout(faceLoop, 500); return; }
  if (videoEl.readyState >= 2 && faceModel) {
    try { processFacePreds(await faceModel.estimateFaces(videoEl, false)); } catch (_) {}
  }
  setTimeout(faceLoop, 60);
}

function drawPreview(lm) {
  if (!videoEl.videoWidth) return;
  faceCtx.clearRect(0, 0, faceCanvas.width, faceCanvas.height);

  // Draw mirrored camera feed (selfie mode)
  faceCtx.save();
  faceCtx.translate(faceCanvas.width, 0);
  faceCtx.scale(-1, 1);
  faceCtx.drawImage(videoEl, 0, 0);
  faceCtx.restore();

  const w = faceCanvas.width;

  // Connect eyes ↔ nose ↔ mouth
  const eyeMid = [w - (lm[0][0] + lm[1][0]) / 2, (lm[0][1] + lm[1][1]) / 2];
  faceCtx.strokeStyle = "rgba(251,213,48,0.6)";
  faceCtx.lineWidth = 1.5;
  faceCtx.beginPath();
  faceCtx.moveTo(w - lm[0][0], lm[0][1]);
  faceCtx.lineTo(w - lm[1][0], lm[1][1]);
  faceCtx.moveTo(eyeMid[0], eyeMid[1]);
  faceCtx.lineTo(w - lm[2][0], lm[2][1]);
  faceCtx.lineTo(w - lm[3][0], lm[3][1]);
  faceCtx.stroke();

  // Draw landmark dots (eyes=yellow, nose/mouth=red)
  const colors = ["#fbd530", "#fbd530", "#ff6853", "#ff6853", "rgba(246,245,240,.35)", "rgba(246,245,240,.35)"];
  lm.forEach(([x, y], i) => {
    faceCtx.beginPath();
    faceCtx.arc(w - x, y, 4, 0, Math.PI * 2);
    faceCtx.fillStyle = colors[i] || "rgba(246,245,240,.5)";
    faceCtx.fill();
  });
}

/* ── Toggle audio ────────────────────────────── */
function setAudio(on) {
  audioOn = on;
  switchAudio.classList.toggle("on", on);
  toggleAudio.classList.toggle("on", on);
  audioInfRow.style.opacity = on ? "1" : "0.4";
  if (on) {
    initMic();
  } else {
    teardownMic();
    smoothAudio = 0;
    setAudioStatus("aus");
  }
  updateStageLabel();
  updateDisplayText();
}

/* ── Toggle distance ─────────────────────────── */
function setDist(on) {
  distOn = on;
  switchDist.classList.toggle("on", on);
  toggleDist.classList.toggle("on", on);
  distInfRow.style.opacity = on ? "1" : "0.4";
  if (on) {
    initCamera();
  } else {
    teardownCamera();
    smoothDist = 0;
    setDistStatus("aus");
  }
  updateStageLabel();
  updateDisplayText();
}

toggleAudio.addEventListener("click", () => setAudio(!audioOn));
toggleDist.addEventListener("click",  () => setDist(!distOn));

// Re-register rVFC if iOS paused the video while the tab was hidden
document.addEventListener("visibilitychange", () => {
  if (!document.hidden && faceLoopActive && "requestVideoFrameCallback" in HTMLVideoElement.prototype) {
    if (faceRvfcHandle !== null) videoEl.cancelVideoFrameCallback(faceRvfcHandle);
    faceRvfcHandle = videoEl.requestVideoFrameCallback(faceCallback);
  }
});

/* ── Render loop ─────────────────────────────── */
let _lastRender = 0;
function render(ts) {
  requestAnimationFrame(render);
  // Cap at ~30fps — font-variation changes are imperceptible above that
  if (ts - _lastRender < 32) return;
  _lastRender = ts;

  // Sample and EMA-smooth mic RMS
  const rawRMS = audioOn ? sampleRMS() : 0;
  smoothAudio = smoothAudio * (1 - AUDIO_ALPHA) + rawRMS * AUDIO_ALPHA;

  // Influence-scaled values
  const aV = smoothAudio * (audioInf / 100);
  const dV = smoothDist  * (distInf  / 100);

  // Font size: far(smoothDist=0) → SIZE_FAR,  close(smoothDist→1) → SIZE_CLOSE
  const fontSize = distOn
    ? SIZE_FAR + (SIZE_CLOSE - SIZE_FAR) * smoothDist * (distInf / 100)
    : 80;

  // Weight:   quiet → 200,  loud → 900
  const weight = 200 + aV * 700;
  // Width:    far → wide(150%),  close → narrow(50%)
  const width  = 150 - dV * 100;
  // Slant:    loud → oblique
  const slant  = -aV * 10;
  // Tracking: far → open,  close → tight
  const tracking = (0.5 - smoothDist * 0.5) * 6 * (distInf / 100);

  textEl.style.fontSize = fontSize.toFixed(1) + "px";
  textEl.style.fontVariationSettings =
    `"wght" ${weight.toFixed(0)}, "wdth" ${width.toFixed(0)}, "slnt" ${slant.toFixed(1)}`;
  textEl.style.fontWeight    = weight.toFixed(0);
  textEl.style.fontStretch   = width.toFixed(0) + "%";
  textEl.style.letterSpacing = tracking.toFixed(2) + "px";
  textEl.style.fontStyle     = slant < -0.5 ? "oblique" : "normal";

  // Cap font-size so text never overflows the stage
  if (stageEl) {
    const availW = stageEl.clientWidth - 96;
    if (availW > 0 && textEl.scrollWidth > availW) {
      textEl.style.fontSize = Math.max(20, fontSize * availW / textEl.scrollWidth).toFixed(1) + "px";
    }
  }

  // Live value readouts
  document.getElementById("lv-wght").textContent = Math.round(weight);
  document.getElementById("lv-size").textContent = fontSize.toFixed(0) + "px";
  document.getElementById("lv-wdth").textContent = Math.round(width);
  document.getElementById("lv-slnt").textContent = slant.toFixed(1);

  // Signal bars
  const audioBarW = audioOn ? Math.round(smoothAudio * 100) : 0;
  const distBarW  = distOn  ? Math.round(smoothDist  * 100) : 0;
  document.getElementById("bar-audio").style.width      = audioBarW + "%";
  document.getElementById("bar-dist").style.width       = distBarW  + "%";
  document.getElementById("bar-audio").style.background = audioOn ? "#fbd530" : "rgba(246,245,240,0.3)";
  document.getElementById("bar-dist").style.background  = distOn  ? "#fbd530" : "rgba(246,245,240,0.3)";
  document.getElementById("audio-meter").style.width    = audioBarW + "%";
  document.getElementById("dist-meter").style.width     = distBarW  + "%";
}

requestAnimationFrame(render);
