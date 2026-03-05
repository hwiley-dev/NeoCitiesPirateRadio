const TILE_SIZE = 32;
const DEFAULT_LAYOUT_ID = "bay-loop";

const DEFAULT_COPY = {
  tag: "CYBER BAY LOOP // FRIEND-LOVING RENEGADE DIY TRANSMISSIONS",
  title: "NeoCities Pirate Radio: Bay Loop City",
  subtitle: "Trace a brighter 16-bit Bay Area overworld with moving fog, landmark beacons, and aerial terrain detail.",
  help: "Keyboard: Arrow Keys or WASD to move. Touch: hold the D-pad or drag on the map. Press M to toggle audio, X to stop, tap a signal row to track it, collect tapes on live signals, and play them from Walkman Deck.",
};

const DEFAULT_PALETTE = {
  roadDark: "#7e8f5c",
  roadLight: "#96a96f",
  roadInset: "#bfc799",
  roadLine: "#f6e7bf",
  roadGlow: "#6a7950",
  shoalDark: "#57b8c9",
  shoalLight: "#86d9e8",
  shoalGlow: "#f9efae",
  waterDark: "#2f84b8",
  waterLight: "#49a7d7",
  waterGlow: "#d9f4ff",
  waterSpark: "#f8ffff",
  coastBright: "#f2d6a3",
  coastShadow: "rgba(95, 73, 45, 0.34)",
  bridgeBase: "#93573b",
  bridgeDeck: "#be7b56",
  bridgeRail: "#ff6b5d",
  bridgeLight: "#ffe99c",
  hillBase: "#6a6441",
  hillShade: "#847a4f",
  hillGlow: "#c6b57b",
  buildingBase: "#565f6d",
  buildingFace: "#8c99ad",
  buildingWindowA: "#fff3a2",
  buildingWindowB: "#e8fdff",
  buildingWindowC: "#ffd29e",
  plazaGlow: "rgba(246, 228, 168, 0.38)",
  labelBg: "rgba(34, 44, 55, 0.74)",
  wrapTop: "rgba(255, 255, 255, 0.22)",
  wrapSide: "rgba(255, 205, 105, 0.22)",
  fogLight: "rgba(250, 255, 255, 0.76)",
  fogShadow: "rgba(150, 217, 246, 0.28)",
  treeDark: "#356142",
  treeLight: "#8dbe61",
  reedDark: "#4f7448",
  reedLight: "#f1ffab",
  landmarkOutline: "#1c313d",
  birdDark: "#263845",
  cityDark: "#6d737e",
  cityLight: "#9da4af",
  cityLine: "#d4d7dc",
  soilDark: "#7d6644",
  soilLight: "#9e8258",
  playerShadow: "rgba(4, 6, 15, 0.45)",
  playerSkin: "#fdf3c8",
  playerHair: "#ff5ea8",
  playerCoat: "#29d8ff",
  playerTrim: "#ffe56d",
  playerEye: "#18243f",
  playerShoe: "#fefefe",
};

const FALLBACK_LAYOUT_RAW = {
  version: 1,
  id: "bay-loop",
  name: "Bay Loop City",
  themeHref: "layouts/bay-loop/theme.css",
  blockedTiles: ["B", "~", "H"],
  viewport: { width: 24, height: 18 },
  spawn: { x: 20.5, y: 13.5 },
  copy: DEFAULT_COPY,
  districts: [
    { name: "North Peninsula", label: "SF", x1: 6, x2: 30, y1: 0, y2: 22, labelX: 16, labelY: 12, color: "#6ff8ff" },
    { name: "South Peninsula", label: "PEN", x1: 11, x2: 35, y1: 23, y2: 47, labelX: 20, labelY: 33, color: "#ff82cc" },
    { name: "East Bay North", label: "OAK", x1: 38, x2: 63, y1: 0, y2: 22, labelX: 46, labelY: 14, color: "#ffe56d" },
    { name: "East Bay South", label: "EBY", x1: 40, x2: 63, y1: 23, y2: 47, labelX: 49, labelY: 33, color: "#8effb7" },
    { name: "South Bay", label: "SJ", x1: 29, x2: 50, y1: 34, y2: 47, labelX: 35, labelY: 41, color: "#7cabff" },
  ],
  trafficLanes: [
    { row: 15.5, start: 13, end: 53, speed: 4.2, color: "#ffe56d", count: 12 },
    { row: 18.5, start: 12, end: 51, speed: -5.0, color: "#7dffbb", count: 12 },
    { row: 29.5, start: 15, end: 54, speed: 3.7, color: "#35d6ff", count: 12 },
    { row: 35.5, start: 18, end: 55, speed: -4.0, color: "#ff4fa3", count: 12 },
  ],
  landmarks: [
    {
      id: "golden-gate",
      name: "Golden Gate",
      shortLabel: "GG",
      kind: "bridge",
      axis: "vertical",
      x: 19.2,
      y: 2.0,
      color: "#ff6b5d",
      desc: "Fog drifts through the north strait where the Golden Gate spans from SF to the Marin headlands.",
    },
    {
      id: "sutro-tower",
      name: "Sutro Tower",
      shortLabel: "SUTRO",
      kind: "radio",
      x: 16.6,
      y: 11.2,
      color: "#fff09b",
      desc: "The west-side broadcast crown sits high above the city grid, blinking over the peninsula hills.",
    },
    {
      id: "salesforce-tower",
      name: "Salesforce Tower",
      shortLabel: "SF",
      kind: "tower",
      x: 23.8,
      y: 14.2,
      color: "#d9fbff",
      desc: "Downtown San Francisco rises here, anchored by a tall neon-glass spire over the bay edge.",
    },
    {
      id: "alcatraz",
      name: "Alcatraz",
      shortLabel: "ALC",
      kind: "island",
      x: 33.2,
      y: 10.8,
      color: "#ffe5b7",
      desc: "A small island silhouette sits between the bridge line and the Golden Gate approach.",
    },
    {
      id: "bay-bridge",
      name: "Bay Bridge",
      shortLabel: "BB",
      kind: "bridge",
      axis: "horizontal",
      x: 36.5,
      y: 15.4,
      color: "#ffd36a",
      desc: "The main bridge span throws traffic lights from San Francisco into Oakland across the central bay.",
    },
    {
      id: "port-oakland",
      name: "Port of Oakland",
      shortLabel: "PORT",
      kind: "port",
      x: 45.2,
      y: 18.4,
      color: "#79ffcf",
      desc: "Container cranes stack up on the Oakland waterfront with blinking yard lights and cargo rails.",
    },
    {
      id: "redwood-stand",
      name: "Peninsula Redwoods",
      shortLabel: "RED",
      kind: "grove",
      x: 18.2,
      y: 36.5,
      color: "#8fff8e",
      desc: "A tall grove marks the greener peninsula spine, swaying above the coastal neighborhoods.",
    },
    {
      id: "salt-ponds",
      name: "South Bay Salt Ponds",
      shortLabel: "SALT",
      kind: "pond",
      x: 39.4,
      y: 44.0,
      color: "#9ce7ff",
      desc: "Bright south-bay evaporation ponds and marsh water ripple in a broad geometric basin.",
    },
  ],
  aerialOverlay: {
    src: "assets/images/bay-aerial-overlay.svg",
    opacity: 0.28,
    blendMode: "multiply",
  },
  palette: DEFAULT_PALETTE,
  map: [
    "~~~~~~~~~~~~~~~~~~...~~~~~~~~~~~~~~~~~~~~~~~~~~~S.........HHHHHH",
    "~~~~~~~~~~~~~~~~~~~=~~~~~~~~~~~~~~~~~~~~~~~~~~S...........HHHHHH",
    "~~~~~~~~~~~~~~~~~~~=~~~~~~~~~~~~~~~~~~~~~~~~S.............HHHHHH",
    "~~~~~~~~~~~~~~~~~~~=~~~~~~~~~~~~~~~~~~~~~~~~S.............HHHHHH",
    "~~~~~~~~~~~~~~~......S~~~~~~~~~~~~~~~~~~~~~S..............HHHHHH",
    "~~~~~~~~~~~~~~~.......S~~~~~~~~~~~~~~~~~~~S...............HHHHHH",
    "~~~~~~~~~~~~~~S........S~~~~~~~~~~~~~~~~~~S...............HHHHHH",
    "~~~~~~~~~~~~~~S.........S~~~~~~~~~~~~~~~~S................HHHHHH",
    "~~~~~~~~~~~~~S...........S~~~~~~~~~~~~~~~S................HHHHHH",
    "~~~~~~~~~~~~~S...........S~~~~~~~~~~~~~~S.................HHHHHH",
    "~~~~~~~~~~~~S.....BB......S~~~~~~~~~~~~~S.............HHHHHHHHHH",
    "~~~~~~~~~~~~......BB......S~~~~~~~~~~~~~S.............HHHHHHHHHH",
    "~~~~~~~~~~~~.........P....SS~~~~~~~~~~~S..............HHHHHHHHHH",
    "~~~~~~~~~~~................SS~~~~~~~~~~S..............HHHHHHHHHH",
    "~~~~~~~~~~~............BB...SS~~~~~~~~SS....BB........HHHHHHHHHH",
    "~~~~~~~~~~~.................SS============P=BB........HHHHHHHHHH",
    "~~~~~~~~~~~..................S~~~~~~~~~SSBBS..........HHHHHHHHHH",
    "~~~~~~~~~~~...................S~~~~~~~~SS~SS..........HHHHHHHHHH",
    "~~~~~~~~~~~...........P.......S~~~~~~~~SS~S...........HHHHHHHHHH",
    "~~~~~~~~~~~...................S~~~~~~~~SS~SS..........HHHHHHHHHH",
    "~~~~~~~~~~~...................S~~~~~~~~~S~SS..........HHHHHHHHHH",
    "~~~~~~~~~~~...................S~~~~~~~~~S~SS..........HHHHHHHHHH",
    "~~~~~~~~~~~...................S~~~~~~~~~~SSS..........HHHHHHHHHH",
    "~~~~~~~~~~~....................S~~~~~~~~~S............HHHHHHHHHH",
    "~~~~~~~~~~~HHHH................S~~~~~~~~~~S...........HHHHHHHHHH",
    "~~~~~~~~~~~HHHH................S~~~~~~~~~~S...........HHHHHHHHHH",
    "~~~~~~~~~~~~HHHH...............S~~~~~~~~~~~S..........HHHHHHHHHH",
    "~~~~~~~~~~~~HHHH..............SS~~~~~~~~~~~S..........HHHHHHHHHH",
    "~~~~~~~~~~~~HHHH........P.....SS~~~~~~~~~~~~S.........HHHHHHHHHH",
    "~~~~~~~~~~~~~HHHH.............SS==============........HHHHHHHHHH",
    "~~~~~~~~~~~~~HHHH.............SS~~~~~~~~~~~~S.........HHHHHHHHHH",
    "~~~~~~~~~~~~~HHHH.........BB..SS~~~~~~~~~~~~~SP.......HHHHHHHHHH",
    "~~~~~~~~~~~~~HHHH.........BB..SS~~~~~~~~~~~~~S........HHHHHHHHHH",
    "~~~~~~~~~~~~~~HHHH.............S~~~~~~~~~~~~~S........HHHHHHHHHH",
    "~~~~~~~~~~~~~~HHHH...........BBSSSS~~~~~~~~~~SSS..........HHHHHH",
    "~~~~~~~~~~~~~~~HHHH.............S==============S..........HHHHHH",
    "~~~~~~~~~~~~~~~HHHH.............SSS~~~~~~~~~~SSS..........HHHHHH",
    "~~~~~~~~~~~~~~~~HHHH............SSS~~~~~~~~~~SSS..........HHHHHH",
    "~~~~~~~~~~~~~~~~HHHH........P...SSS~~~~~~~~~~SSSS.........HHHHHH",
    "~~~~~~~~~~~~~~~~~HHHH...........SSS~~~~~~~~~SSSSS.........HHHHHH",
    "~~~~~~~~~~~~~~~~~HHHH...........SSS~~~~~~~~~SSSS..........HHHHHH",
    "~~~~~~~~~~~~~~~~~~HHHH..........SSS~~~~~~~~~SSSSS.........HHHHHH",
    "~~~~~~~~~~~~~~~~~~HHHH..........SSS~~~~~~~~~SSSSS.........HHHHHH",
    "~~~~~~~~~~~~~~~~~~~HHHH..........SS~~~~~~~~~SSSSSS........HHHHHH",
    "~~~~~~~~~~~~~~~~~~~HHHH.........SSS~~~~~~~~~SSSSSS........HHHHHH",
    "~~~~~~~~~~~~~~~~~~~~HHHH.........SS~~~~~~~~~SSSSSS........HHHHHH",
    "~~~~~~~~~~~~~~~~~~~~HHHH.........SS~~~~~~~~~SSSSSSS.......HHHHHH",
    "~~~~~~~~~~~~~~~~~~.~~.............SS~~~~~~~~SSSSSSS.......HHHHHH",
  ],
};

const FALLBACK_CHANNELS = [
  {
    id: "dock",
    name: "Dockside Solder Net",
    tileX: 28,
    tileY: 15,
    color: "#4dff9f",
    desc: "Open hardware fixes and boat-borne radio mods.",
    audio: null,
  },
  {
    id: "rooftop",
    name: "Rooftop Dub Relay",
    tileX: 22,
    tileY: 18,
    color: "#f6bd60",
    desc: "Bass-heavy neighborhood broadcasts and sky-antenna jams.",
    audio: null,
  },
  {
    id: "freesoft",
    name: "Free Software Mast",
    tileX: 42,
    tileY: 15,
    color: "#83c5be",
    desc: "Tools, scripts, and shared code for independent stations.",
    audio: null,
  },
  {
    id: "basement",
    name: "Basement Tape Loop",
    tileX: 24,
    tileY: 28,
    color: "#ffafcc",
    desc: "Tape hiss, archival edits, and spoken zines.",
    audio: null,
  },
  {
    id: "street",
    name: "Street Mic Cipher",
    tileX: 46,
    tileY: 31,
    color: "#9bf6ff",
    desc: "Live stories, spoken word, and direct-action dispatches.",
    audio: null,
  },
];

function createDirectionalState() {
  return {
    up: false,
    down: false,
    left: false,
    right: false,
  };
}

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const coordsEl = document.getElementById("coords");
const sectorEl = document.getElementById("sector");
const signalEl = document.getElementById("signal");
const landmarkEl = document.getElementById("landmark");
const listEl = document.getElementById("channel-list");
const logEl = document.getElementById("log");
const radarCanvas = document.getElementById("radar");
const radarCtx = radarCanvas.getContext("2d");
radarCtx.imageSmoothingEnabled = false;
const audioToggleEl = document.getElementById("audio-toggle");
const audioStopEl = document.getElementById("audio-stop");
const nowPlayingEl = document.getElementById("now-playing");
const audioStatusEl = document.getElementById("audio-status");
const worldTagEl = document.getElementById("world-tag");
const worldTitleEl = document.getElementById("world-title");
const worldSubtagEl = document.getElementById("world-subtag");
const worldHelpEl = document.getElementById("world-help");
const layoutThemeEl = document.getElementById("layout-theme");
const signalProgressEl = document.getElementById("signal-progress");
const dossierStateEl = document.getElementById("dossier-state");
const dossierNameEl = document.getElementById("dossier-name");
const dossierDescEl = document.getElementById("dossier-desc");
const dossierMetaPrimaryEl = document.getElementById("dossier-meta-primary");
const dossierMetaSecondaryEl = document.getElementById("dossier-meta-secondary");
const dossierCreditEl = document.getElementById("dossier-credit");
const walkmanCountEl = document.getElementById("walkman-count");
const walkmanCopyEl = document.getElementById("walkman-copy");
const walkmanListEl = document.getElementById("walkman-list");
const attractEl = document.getElementById("attract-screen");
const attractCopyEl = document.getElementById("attract-copy");
const attractStatusEl = document.getElementById("attract-status");
const enterWorldEl = document.getElementById("enter-world");
const enterWorldAudioEl = document.getElementById("enter-world-audio");
const touchAudioToggleEl = document.getElementById("touch-audio-toggle");
const touchAudioStopEl = document.getElementById("touch-audio-stop");
const touchClearTrackEl = document.getElementById("touch-clear-track");

const touchButtons = [...document.querySelectorAll(".touch-pad button[data-key]")];

const state = {
  layoutId: resolveRequestedLayoutId(),
  layout: null,
  x: 0,
  y: 0,
  cameraX: 0,
  cameraY: 0,
  radius: 0.28,
  speed: 3.9,
  unlocked: new Set(),
  discoveredLandmarks: new Set(),
  collectedTapeIds: new Set(),
  keyboardKeys: createDirectionalState(),
  touchKeys: createDirectionalState(),
  dragKeys: createDirectionalState(),
  channels: [],
  channelsById: new Map(),
  activeChannelId: null,
  trackedChannelId: null,
  walkmanChannelId: null,
  playbackSource: null,
  tick: 0,
  facing: "right",
  moving: false,
  audioEnabled: false,
  audioLockedReason: null,
  currentAudio: null,
  audioRuntimeById: new Map(),
  audioBlockedWarned: false,
  playToken: 0,
  nowPlaying: "(none)",
  audioStatus: "idle",
  radarScale: 7,
  bootReady: false,
  worldStarted: false,
  loopStarted: false,
  dragPointerId: null,
  dragOriginX: 0,
  dragOriginY: 0,
  aerialOverlayImage: null,
  aerialOverlaySource: null,
  aerialOverlayFailed: false,
};

const aerialOverlayCache = new Map();

function resolveRequestedLayoutId() {
  const queryValue = new URLSearchParams(window.location.search).get("layout") || DEFAULT_LAYOUT_ID;
  return typeof queryValue === "string" && /^[a-z0-9-]+$/.test(queryValue) ? queryValue : DEFAULT_LAYOUT_ID;
}

function currentLayout() {
  return state.layout || FALLBACK_LAYOUT;
}

function mapWidth() {
  return currentLayout().mapWidth;
}

function mapHeight() {
  return currentLayout().mapHeight;
}

function wrapCoord(value, size) {
  return ((value % size) + size) % size;
}

function wrapTileIndex(value, size) {
  return ((value % size) + size) % size;
}

function shortestWrappedDelta(a, b, size) {
  let delta = a - b;
  if (delta > size / 2) delta -= size;
  if (delta < -size / 2) delta += size;
  return delta;
}

function setDirectionalKey(target, key, isDown) {
  if (key === "arrowup" || key === "w") target.up = isDown;
  if (key === "arrowdown" || key === "s") target.down = isDown;
  if (key === "arrowleft" || key === "a") target.left = isDown;
  if (key === "arrowright" || key === "d") target.right = isDown;
}

function resetDirectionalState(target) {
  target.up = false;
  target.down = false;
  target.left = false;
  target.right = false;
}

function startWorld({ armAudio = false } = {}) {
  if (!state.bootReady || state.worldStarted) {
    return;
  }

  state.worldStarted = true;
  document.body.classList.add("world-started");
  attractEl.setAttribute("aria-hidden", "true");
  pushLog(armAudio ? "Operator entered Bay Loop with audio armed." : "Operator entered Bay Loop.");

  if (armAudio) {
    enableAudio(true);
  }

  canvas.focus();
  if (!state.loopStarted) {
    state.loopStarted = true;
    lastTs = performance.now();
    requestAnimationFrame(loop);
  }
}

function setAttractStatus(message, isReady = false) {
  attractStatusEl.textContent = message;
  enterWorldEl.disabled = !isReady;
  enterWorldAudioEl.disabled = !isReady;
}

function applyDragVector(dx, dy) {
  const threshold = 18;
  resetDirectionalState(state.dragKeys);

  if (dx <= -threshold) state.dragKeys.left = true;
  if (dx >= threshold) state.dragKeys.right = true;
  if (dy <= -threshold) state.dragKeys.up = true;
  if (dy >= threshold) state.dragKeys.down = true;
}

function stopDragSteering(pointerId) {
  if (state.dragPointerId !== pointerId) {
    return;
  }

  resetDirectionalState(state.dragKeys);
  state.dragPointerId = null;
  canvas.classList.remove("touch-dragging");
  if (canvas.hasPointerCapture(pointerId)) {
    canvas.releasePointerCapture(pointerId);
  }
}

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();

  if (!state.worldStarted) {
    if ((key === "enter" || key === " ") && state.bootReady) {
      event.preventDefault();
      startWorld();
    }
    if (key === "m" && state.bootReady) {
      event.preventDefault();
      startWorld({ armAudio: true });
    }
    return;
  }

  if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d"].includes(key)) {
    event.preventDefault();
    setDirectionalKey(state.keyboardKeys, key, true);
    return;
  }

  if (key === "m") {
    event.preventDefault();
    enableAudio(!state.audioEnabled);
    return;
  }

  if (key === "x") {
    event.preventDefault();
    cancelPendingAudio();
    stopCurrentAudio();
    if (state.audioEnabled && !state.audioLockedReason) {
      setNowPlaying("(stopped)");
      setAudioStatus("armed");
    }
  }
});

window.addEventListener("keyup", (event) => {
  if (!state.worldStarted) {
    return;
  }

  setDirectionalKey(state.keyboardKeys, event.key.toLowerCase(), false);
});

touchButtons.forEach((button) => {
  const key = button.dataset.key;

  const press = (event) => {
    event.preventDefault();
    button.classList.add("active");
    setDirectionalKey(state.touchKeys, key, true);
  };

  const release = (event) => {
    event.preventDefault();
    button.classList.remove("active");
    setDirectionalKey(state.touchKeys, key, false);
  };

  button.addEventListener("pointerdown", press);
  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);
  button.addEventListener("pointerleave", release);
});

canvas.addEventListener("pointerdown", (event) => {
  if (!state.worldStarted || event.pointerType === "mouse") {
    return;
  }

  event.preventDefault();
  state.dragPointerId = event.pointerId;
  state.dragOriginX = event.clientX;
  state.dragOriginY = event.clientY;
  resetDirectionalState(state.dragKeys);
  canvas.classList.add("touch-dragging");
  canvas.setPointerCapture(event.pointerId);
});

canvas.addEventListener("pointermove", (event) => {
  if (state.dragPointerId !== event.pointerId) {
    return;
  }

  event.preventDefault();
  applyDragVector(event.clientX - state.dragOriginX, event.clientY - state.dragOriginY);
});

canvas.addEventListener("pointerup", (event) => {
  stopDragSteering(event.pointerId);
});

canvas.addEventListener("pointercancel", (event) => {
  stopDragSteering(event.pointerId);
});

function pushLog(message) {
  const row = document.createElement("p");
  row.className = "log-line";
  const stamp = document.createElement("strong");
  stamp.textContent = `T+${String(Math.floor(state.tick)).padStart(3, "0")}`;
  row.append(stamp, document.createTextNode(` ${message}`));
  logEl.prepend(row);
}

function setNowPlaying(label) {
  state.nowPlaying = label;
  nowPlayingEl.textContent = `NOW PLAYING: ${label}`;
}

function setAudioStatus(status) {
  state.audioStatus = status;
  audioStatusEl.textContent = `AUDIO STATUS: ${status}`;
}

function getNowPlaying() {
  return state.nowPlaying;
}

function formatDuration(totalSeconds) {
  if (!Number.isInteger(totalSeconds) || totalSeconds <= 0) return "unknown length";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function channelStatus(channel) {
  const isUnlocked = state.unlocked.has(channel.id);
  if (!isUnlocked) return "LOCKED";
  return channel.audio ? "LIVE" : "QUIET";
}

function getTrackedChannel() {
  if (!state.trackedChannelId) return null;
  return getChannelById(state.trackedChannelId);
}

function getLandmarkById(landmarkId, layout = currentLayout()) {
  if (!landmarkId) return null;
  return layout.landmarks.find((landmark) => landmark.id === landmarkId) || null;
}

function renderAudioControls() {
  const locked = Boolean(state.audioLockedReason);
  audioToggleEl.disabled = locked;
  audioStopEl.disabled = !state.currentAudio;
  touchAudioToggleEl.disabled = locked;
  touchAudioStopEl.disabled = !state.currentAudio;

  if (locked) {
    audioToggleEl.classList.remove("active");
    touchAudioToggleEl.classList.remove("active");
    audioToggleEl.textContent = "Audio Unavailable";
    touchAudioToggleEl.textContent = "Unavailable";
    return;
  }

  audioToggleEl.classList.toggle("active", state.audioEnabled);
  touchAudioToggleEl.classList.toggle("active", state.audioEnabled);
  audioToggleEl.textContent = state.audioEnabled ? "Disable Audio" : "Enable Audio";
  touchAudioToggleEl.textContent = state.audioEnabled ? "Audio On" : "Audio Off";
}

function renderTrackingControls() {
  touchClearTrackEl.disabled = !state.trackedChannelId;
}

function cancelPendingAudio() {
  state.playToken += 1;
}

function clearAudioRuntimes() {
  cancelPendingAudio();
  state.audioRuntimeById.forEach((runtime) => {
    runtime.audio.pause();
    runtime.audio.src = "";
  });
  state.audioRuntimeById.clear();
  state.currentAudio = null;
  state.playbackSource = null;
  renderAudioControls();
  renderWalkmanDeck();
}

function stopCurrentAudio() {
  if (!state.currentAudio) {
    renderAudioControls();
    return;
  }

  state.currentAudio.pause();
  state.currentAudio.currentTime = 0;
  state.currentAudio = null;
  state.playbackSource = null;
  renderAudioControls();
  renderWalkmanDeck();
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isHexColor(value) {
  return typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value);
}

function isHttpUrl(value) {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_error) {
    return false;
  }
}

function stripMapRowGaps(row) {
  return typeof row === "string" ? row.replace(/\s+/g, "") : row;
}

function mapTile(x, y, layout = currentLayout()) {
  const wrappedX = wrapTileIndex(Math.floor(x), layout.mapWidth);
  const wrappedY = wrapTileIndex(Math.floor(y), layout.mapHeight);
  return layout.map[wrappedY][wrappedX];
}

function isWalkableTile(tile, layout = currentLayout()) {
  return !layout.blockedTileSet.has(tile);
}

function collides(nx, ny) {
  const r = state.radius;
  const points = [
    [nx - r, ny - r],
    [nx + r, ny - r],
    [nx - r, ny + r],
    [nx + r, ny + r],
  ];

  return points.some(([px, py]) => !isWalkableTile(mapTile(px, py)));
}

function normalizePalette(raw) {
  const palette = { ...DEFAULT_PALETTE };
  if (!isPlainObject(raw)) return palette;

  Object.entries(raw).forEach(([key, value]) => {
    if (typeof value === "string" && key in palette) {
      palette[key] = value;
    }
  });

  return palette;
}

function normalizeDistrict(raw, index, layout, errors) {
  if (!isPlainObject(raw)) {
    errors.push(`districts[${index}] is not an object`);
    return null;
  }

  const requiredInts = ["x1", "x2", "y1", "y2", "labelX", "labelY"];
  requiredInts.forEach((key) => {
    if (!Number.isInteger(raw[key])) {
      errors.push(`districts[${index}].${key} must be an integer`);
    }
  });

  if (typeof raw.name !== "string" || raw.name.trim().length < 2) {
    errors.push(`districts[${index}].name must be a string`);
  }

  if (typeof raw.label !== "string" || raw.label.trim().length < 1) {
    errors.push(`districts[${index}].label must be a string`);
  }

  if (!isHexColor(raw.color)) {
    errors.push(`districts[${index}].color must be #RRGGBB`);
  }

  if (
    Number.isInteger(raw.x1) &&
    Number.isInteger(raw.x2) &&
    Number.isInteger(raw.y1) &&
    Number.isInteger(raw.y2) &&
    (raw.x1 < 0 || raw.x2 >= layout.mapWidth || raw.y1 < 0 || raw.y2 >= layout.mapHeight || raw.x1 > raw.x2 || raw.y1 > raw.y2)
  ) {
    errors.push(`districts[${index}] bounds are outside map limits`);
  }

  if (errors.length > 0) {
    return null;
  }

  return {
    name: raw.name,
    label: raw.label,
    x1: raw.x1,
    x2: raw.x2,
    y1: raw.y1,
    y2: raw.y2,
    labelX: raw.labelX,
    labelY: raw.labelY,
    color: raw.color,
  };
}

function normalizeTrafficLane(raw, index, layout, errors) {
  if (!isPlainObject(raw)) {
    errors.push(`trafficLanes[${index}] is not an object`);
    return null;
  }

  if (typeof raw.row !== "number") {
    errors.push(`trafficLanes[${index}].row must be a number`);
  }

  if (!Number.isFinite(raw.start) || !Number.isFinite(raw.end) || raw.end <= raw.start) {
    errors.push(`trafficLanes[${index}] start/end must define a positive span`);
  }

  if (!Number.isFinite(raw.speed)) {
    errors.push(`trafficLanes[${index}].speed must be numeric`);
  }

  if (!Number.isInteger(raw.count) || raw.count <= 0) {
    errors.push(`trafficLanes[${index}].count must be a positive integer`);
  }

  if (typeof raw.color !== "string" || raw.color.trim().length < 3) {
    errors.push(`trafficLanes[${index}].color must be a string`);
  }

  if (errors.length > 0) {
    return null;
  }

  const row = wrapCoord(raw.row, layout.mapHeight);
  return {
    row,
    start: raw.start,
    end: raw.end,
    speed: raw.speed,
    color: raw.color,
    count: raw.count,
  };
}

function normalizeAerialOverlay(raw, errors) {
  if (raw === undefined || raw === null) {
    return null;
  }

  if (!isPlainObject(raw)) {
    errors.push("aerialOverlay must be an object");
    return null;
  }

  const startErrors = errors.length;
  const src = typeof raw.src === "string" ? raw.src.trim() : "";
  const opacity = Number.isFinite(raw.opacity) ? raw.opacity : 0.28;
  const blendMode = typeof raw.blendMode === "string" ? raw.blendMode.trim() : "multiply";
  const allowedBlendModes = new Set(["normal", "multiply", "screen", "overlay", "soft-light", "hard-light"]);

  if (src.length < 3) {
    errors.push("aerialOverlay.src must be a non-empty path");
  }

  if (opacity < 0 || opacity > 1) {
    errors.push("aerialOverlay.opacity must be between 0 and 1");
  }

  if (!allowedBlendModes.has(blendMode)) {
    errors.push("aerialOverlay.blendMode must be one of normal, multiply, screen, overlay, soft-light, hard-light");
  }

  if (startErrors !== errors.length) {
    return null;
  }

  return {
    src,
    opacity,
    blendMode,
  };
}

function normalizeLandmark(raw, index, layout, ids, errors) {
  const startErrors = errors.length;

  if (!isPlainObject(raw)) {
    errors.push(`landmarks[${index}] is not an object`);
    return null;
  }

  const id = raw.id;
  const name = raw.name;
  const shortLabel = raw.shortLabel;
  const kind = raw.kind;
  const axis = raw.axis;
  const x = raw.x;
  const y = raw.y;
  const color = raw.color;
  const desc = raw.desc;

  if (typeof id !== "string" || !/^[a-z0-9-]+$/.test(id)) {
    errors.push(`landmarks[${index}].id must contain only lowercase letters, numbers, and dashes`);
  } else if (ids.has(id)) {
    errors.push(`landmarks[${index}].id is duplicated (${id})`);
  }

  if (typeof name !== "string" || name.trim().length < 2) {
    errors.push(`landmarks[${index}].name must be a non-empty string`);
  }

  if (typeof shortLabel !== "string" || shortLabel.trim().length < 1 || shortLabel.trim().length > 6) {
    errors.push(`landmarks[${index}].shortLabel must be 1-6 characters`);
  }

  if (typeof kind !== "string" || kind.trim().length < 2) {
    errors.push(`landmarks[${index}].kind must be a string`);
  }

  if (axis !== undefined && axis !== "horizontal" && axis !== "vertical") {
    errors.push(`landmarks[${index}].axis must be either horizontal or vertical`);
  }

  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    errors.push(`landmarks[${index}].x and .y must be numeric`);
  } else if (x < 0 || x >= layout.mapWidth || y < 0 || y >= layout.mapHeight) {
    errors.push(`landmarks[${index}] coordinates are outside map bounds`);
  }

  if (!isHexColor(color)) {
    errors.push(`landmarks[${index}].color must be #RRGGBB`);
  }

  if (typeof desc !== "string" || desc.trim().length < 6) {
    errors.push(`landmarks[${index}].desc must be a meaningful string`);
  }

  if (startErrors !== errors.length) {
    return null;
  }

  ids.add(id);

  return {
    id,
    name: name.trim(),
    shortLabel: shortLabel.trim().toUpperCase(),
    kind: kind.trim(),
    axis: axis === "vertical" ? "vertical" : axis === "horizontal" ? "horizontal" : null,
    x,
    y,
    color,
    desc: desc.trim(),
  };
}

function normalizeLayout(raw) {
  const errors = [];

  if (!isPlainObject(raw)) {
    throw new Error("Layout root must be an object");
  }

  if (raw.version !== 1) {
    errors.push("Layout version must be 1");
  }

  const id = typeof raw.id === "string" && /^[a-z0-9-]+$/.test(raw.id) ? raw.id : null;
  if (!id) {
    errors.push("Layout id must contain only lowercase letters, numbers, and dashes");
  }

  const name = typeof raw.name === "string" && raw.name.trim().length > 1 ? raw.name.trim() : null;
  if (!name) {
    errors.push("Layout name must be a string");
  }

  if (!Array.isArray(raw.map) || raw.map.length === 0) {
    errors.push("Layout map must be a non-empty array");
  }

  const normalizedMap = Array.isArray(raw.map) ? raw.map.map(stripMapRowGaps) : [];
  const mapWidthValue = normalizedMap[0] ? normalizedMap[0].length : 0;

  normalizedMap.forEach((row, index) => {
    if (typeof row !== "string" || row.length === 0) {
      errors.push(`map[${index}] must be a non-empty string`);
      return;
    }

    if (row.length !== mapWidthValue) {
      errors.push(`map[${index}] length does not match row 0`);
    }

    if (!/^[.=~BPSH]+$/.test(row)) {
      errors.push(`map[${index}] contains unsupported tile characters`);
    }
  });

  const blockedTiles = Array.isArray(raw.blockedTiles) && raw.blockedTiles.length > 0
    ? raw.blockedTiles.filter((tile) => typeof tile === "string" && tile.length === 1)
    : ["B", "~", "H"];

  if (!isPlainObject(raw.viewport) || !Number.isInteger(raw.viewport.width) || !Number.isInteger(raw.viewport.height)) {
    errors.push("Layout viewport must include integer width and height");
  }

  const viewport = {
    width: raw.viewport?.width,
    height: raw.viewport?.height,
  };

  if (Number.isInteger(viewport.width) && Number.isInteger(viewport.height) && mapWidthValue > 0 && normalizedMap.length > 0) {
    if (viewport.width <= 0 || viewport.height <= 0 || viewport.width > mapWidthValue || viewport.height > normalizedMap.length) {
      errors.push("Layout viewport must fit within the map bounds");
    }
  }

  if (!isPlainObject(raw.spawn) || typeof raw.spawn.x !== "number" || typeof raw.spawn.y !== "number") {
    errors.push("Layout spawn must include numeric x and y");
  }

  const palette = normalizePalette(raw.palette);
  const copy = {
    tag: typeof raw.copy?.tag === "string" ? raw.copy.tag : DEFAULT_COPY.tag,
    title: typeof raw.copy?.title === "string" ? raw.copy.title : DEFAULT_COPY.title,
    subtitle: typeof raw.copy?.subtitle === "string" ? raw.copy.subtitle : DEFAULT_COPY.subtitle,
    help: typeof raw.copy?.help === "string" ? raw.copy.help : DEFAULT_COPY.help,
  };

  const layout = {
    version: 1,
    id: id || DEFAULT_LAYOUT_ID,
    name: name || DEFAULT_COPY.title,
    themeHref: typeof raw.themeHref === "string" && raw.themeHref.trim() ? raw.themeHref : `layouts/${id || DEFAULT_LAYOUT_ID}/theme.css`,
    map: normalizedMap,
    mapWidth: mapWidthValue,
    mapHeight: normalizedMap.length,
    blockedTiles,
    blockedTileSet: new Set(blockedTiles),
    viewport,
    spawn: { x: raw.spawn?.x, y: raw.spawn?.y },
    copy,
    districts: [],
    trafficLanes: [],
    landmarks: [],
    aerialOverlay: null,
    palette,
  };

  if (typeof layout.spawn.x === "number" && typeof layout.spawn.y === "number" && layout.mapWidth > 0 && layout.mapHeight > 0) {
    if (!isWalkableTile(mapTile(layout.spawn.x, layout.spawn.y, layout), layout)) {
      errors.push("Layout spawn must land on a walkable tile");
    }
  }

  if (Array.isArray(raw.districts)) {
    raw.districts.forEach((district, index) => {
      const startingErrors = errors.length;
      const normalized = normalizeDistrict(district, index, layout, errors);
      if (normalized && startingErrors === errors.length) {
        layout.districts.push(normalized);
      }
    });
  }

  if (Array.isArray(raw.trafficLanes)) {
    raw.trafficLanes.forEach((lane, index) => {
      const startingErrors = errors.length;
      const normalized = normalizeTrafficLane(lane, index, layout, errors);
      if (normalized && startingErrors === errors.length) {
        layout.trafficLanes.push(normalized);
      }
    });
  }

  if (Array.isArray(raw.landmarks)) {
    const ids = new Set();
    raw.landmarks.forEach((landmark, index) => {
      const startingErrors = errors.length;
      const normalized = normalizeLandmark(landmark, index, layout, ids, errors);
      if (normalized && startingErrors === errors.length) {
        layout.landmarks.push(normalized);
      }
    });
  }

  layout.aerialOverlay = normalizeAerialOverlay(raw.aerialOverlay, errors);

  if (errors.length > 0) {
    throw new Error(errors.join(" | "));
  }

  return layout;
}

const FALLBACK_LAYOUT = normalizeLayout(FALLBACK_LAYOUT_RAW);

async function loadLayoutManifest() {
  const response = await fetch(`layouts/${state.layoutId}/layout.json`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Layout fetch failed (${response.status})`);
  }
  const data = await response.json();
  return normalizeLayout(data);
}

function applyLayoutChrome(layout) {
  document.body.dataset.layout = layout.id;

  if (layoutThemeEl) {
    layoutThemeEl.href = layout.themeHref;
  }

  worldTagEl.textContent = layout.copy.tag;
  worldTitleEl.textContent = layout.copy.title;
  worldSubtagEl.textContent = layout.copy.subtitle;
  worldHelpEl.textContent = layout.copy.help;
  document.title = layout.copy.title;
}

function syncRadarCanvas(layout) {
  const maxScale = 8;
  const minScale = 2;
  const widthScale = Math.floor(224 / layout.mapWidth);
  const heightScale = Math.floor(154 / layout.mapHeight);
  state.radarScale = Math.max(minScale, Math.min(maxScale, widthScale, heightScale));
  radarCanvas.width = layout.mapWidth * state.radarScale;
  radarCanvas.height = layout.mapHeight * state.radarScale;
}

function prepareAerialOverlay(layout) {
  state.aerialOverlayImage = null;
  state.aerialOverlaySource = null;
  state.aerialOverlayFailed = false;

  const overlay = layout.aerialOverlay;
  if (!overlay) {
    return;
  }

  if (aerialOverlayCache.has(overlay.src)) {
    state.aerialOverlayImage = aerialOverlayCache.get(overlay.src);
    state.aerialOverlaySource = overlay.src;
    return;
  }

  const image = new Image();
  image.decoding = "async";
  image.addEventListener("load", () => {
    aerialOverlayCache.set(overlay.src, image);
    if (currentLayout().aerialOverlay?.src === overlay.src) {
      state.aerialOverlayImage = image;
      state.aerialOverlaySource = overlay.src;
      draw();
    }
  });
  image.addEventListener("error", () => {
    if (!state.aerialOverlayFailed && currentLayout().aerialOverlay?.src === overlay.src) {
      state.aerialOverlayFailed = true;
      pushLog(`Aerial overlay failed to load: ${overlay.src}`);
    }
  });
  image.src = overlay.src;
}

function setLayout(layout) {
  state.layout = layout;
  state.unlocked.clear();
  state.discoveredLandmarks.clear();
  state.activeChannelId = null;
  state.trackedChannelId = null;
  state.x = wrapCoord(layout.spawn.x, layout.mapWidth);
  state.y = wrapCoord(layout.spawn.y, layout.mapHeight);
  state.cameraX = state.x;
  state.cameraY = state.y;

  canvas.width = layout.viewport.width * TILE_SIZE;
  canvas.height = layout.viewport.height * TILE_SIZE;

  applyLayoutChrome(layout);
  syncRadarCanvas(layout);
  prepareAerialOverlay(layout);
}

async function initLayout() {
  try {
    const layout = await loadLayoutManifest();
    setLayout(layout);
    pushLog(`Loaded layout ${layout.name} (${layout.id}). Camera follow engaged.`);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    setLayout(FALLBACK_LAYOUT);
    pushLog(`Layout failed: ${reason}`);
    pushLog(`Running built-in fallback layout: ${FALLBACK_LAYOUT.name}.`);
  }
}

function normalizeChannel(raw, index, ids, errors) {
  const layout = currentLayout();
  const startErrors = errors.length;

  if (!isPlainObject(raw)) {
    errors.push(`channels[${index}] is not an object`);
    return null;
  }

  const id = raw.id;
  const name = raw.name;
  const tileX = raw.tileX;
  const tileY = raw.tileY;
  const color = raw.color;
  const desc = raw.desc;
  const audio = raw.audio;

  if (typeof id !== "string" || id.length < 2) {
    errors.push(`channels[${index}].id must be a non-empty string`);
  } else if (!/^[a-z0-9-]+$/.test(id)) {
    errors.push(`channels[${index}].id must contain only lowercase letters, numbers, and dashes`);
  } else if (ids.has(id)) {
    errors.push(`channels[${index}].id is duplicated (${id})`);
  }

  if (typeof name !== "string" || name.trim().length < 2) {
    errors.push(`channels[${index}].name must be a non-empty string`);
  }

  if (!Number.isInteger(tileX) || !Number.isInteger(tileY)) {
    errors.push(`channels[${index}] tileX/tileY must be integers`);
  } else if (tileX < 0 || tileX >= layout.mapWidth || tileY < 0 || tileY >= layout.mapHeight) {
    errors.push(`channels[${index}] tile coordinates are outside map bounds`);
  } else if (!isWalkableTile(mapTile(tileX, tileY, layout), layout)) {
    errors.push(`channels[${index}] tile coordinates point to a blocked tile`);
  }

  if (!isHexColor(color)) {
    errors.push(`channels[${index}].color must be #RRGGBB`);
  }

  if (typeof desc !== "string" || desc.trim().length < 4) {
    errors.push(`channels[${index}].desc must be a meaningful string`);
  }

  let normalizedAudio = null;
  if (audio !== null) {
    if (!isPlainObject(audio)) {
      errors.push(`channels[${index}].audio must be either null or an object`);
    } else {
      if (!isHttpUrl(audio.primaryUrl)) {
        errors.push(`channels[${index}].audio.primaryUrl must be an http/https URL`);
      }

      if (!isHttpUrl(audio.fallbackUrl)) {
        errors.push(`channels[${index}].audio.fallbackUrl must be an http/https URL`);
      }

      if (typeof audio.license !== "string" || audio.license.trim().length < 3) {
        errors.push(`channels[${index}].audio.license must be a string`);
      }

      if (typeof audio.attribution !== "string" || audio.attribution.trim().length < 3) {
        errors.push(`channels[${index}].audio.attribution must be a string`);
      }

      if (!Number.isInteger(audio.durationSec) || audio.durationSec <= 0) {
        errors.push(`channels[${index}].audio.durationSec must be a positive integer`);
      }

      normalizedAudio = {
        primaryUrl: audio.primaryUrl,
        fallbackUrl: audio.fallbackUrl,
        license: audio.license,
        attribution: audio.attribution,
        durationSec: audio.durationSec,
      };
    }
  }

  if (startErrors !== errors.length) {
    return null;
  }

  ids.add(id);

  return {
    id,
    name,
    tileX,
    tileY,
    color,
    desc,
    audio: normalizedAudio,
  };
}

function validateChannelsManifest(raw) {
  const errors = [];

  if (!isPlainObject(raw)) {
    throw new Error("Manifest root must be an object");
  }

  if (raw.version !== 1) {
    errors.push("Manifest version must be 1");
  }

  if (!Array.isArray(raw.channels) || raw.channels.length === 0) {
    errors.push("Manifest channels must be a non-empty array");
  }

  const ids = new Set();
  const channels = [];

  if (Array.isArray(raw.channels)) {
    raw.channels.forEach((channel, index) => {
      const normalized = normalizeChannel(channel, index, ids, errors);
      if (normalized) {
        channels.push(normalized);
      }
    });
  }

  if (errors.length > 0) {
    throw new Error(errors.join(" | "));
  }

  return {
    version: 1,
    channels,
  };
}

async function loadChannelsManifest() {
  const response = await fetch("channels.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Manifest fetch failed (${response.status})`);
  }
  const data = await response.json();
  return validateChannelsManifest(data);
}

function setChannels(channels) {
  state.channels = channels;
  state.channelsById = new Map(channels.map((channel) => [channel.id, channel]));
  state.unlocked.clear();
  state.collectedTapeIds.clear();
  state.activeChannelId = null;
  state.trackedChannelId = null;
  state.walkmanChannelId = null;
  state.playbackSource = null;
  clearAudioRuntimes();
  renderChannels();
  renderWalkmanDeck();
  renderTrackingControls();
}

async function initChannels() {
  try {
    const manifest = await loadChannelsManifest();
    setChannels(manifest.channels);
    state.audioLockedReason = null;
    pushLog(`Loaded ${manifest.channels.length} signals from channels.json (v${manifest.version}).`);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    state.audioLockedReason = "manifest unavailable";
    setChannels(FALLBACK_CHANNELS.map((channel) => ({ ...channel })));
    pushLog(`Manifest failed: ${reason}`);
    pushLog("Running in silent fallback mode. Fix channels.json to restore streaming audio.");
  }
}

function getChannelById(channelId) {
  if (!channelId) return null;
  return state.channelsById.get(channelId) || null;
}

function collectedTapeChannels() {
  return state.channels.filter((channel) => channel.audio && state.collectedTapeIds.has(channel.id));
}

function activeWalkmanChannel() {
  const channel = getChannelById(state.walkmanChannelId);
  if (!channel || !state.collectedTapeIds.has(channel.id) || !channel.audio) {
    return null;
  }
  return channel;
}

function isWalkmanPlaybackActive() {
  return state.playbackSource === "walkman" && Boolean(state.currentAudio) && Boolean(activeWalkmanChannel());
}

function renderWalkmanDeck() {
  const totalLive = state.channels.filter((channel) => Boolean(channel.audio)).length;
  const collected = collectedTapeChannels();
  walkmanCountEl.textContent = `TAPES ${collected.length}/${totalLive}`;
  walkmanListEl.innerHTML = "";

  if (collected.length === 0) {
    walkmanCopyEl.textContent = "Find and unlock live signals to collect cassettes.";
    return;
  }

  const selected = activeWalkmanChannel();
  walkmanCopyEl.textContent = selected
    ? isWalkmanPlaybackActive()
      ? `PLAYING: ${selected.name}`
      : `DECK LOADED: ${selected.name}`
    : "Select a tape to load your Walkman.";

  collected.forEach((channel) => {
    const li = document.createElement("li");
    const selectedTape = state.walkmanChannelId === channel.id;
    const playingTape = selectedTape && isWalkmanPlaybackActive();
    li.className = playingTape ? "playing" : selectedTape ? "loaded" : "idle";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "walkman-button";
    button.dataset.channelId = channel.id;
    button.setAttribute("aria-pressed", String(selectedTape));
    button.title = selectedTape ? "Stop this tape" : `Load ${channel.name}`;

    const name = document.createElement("span");
    name.className = "name";
    name.textContent = channel.name;

    const status = document.createElement("span");
    status.className = "status";
    status.textContent = playingTape ? "PLAYING" : selectedTape ? "LOADED" : "READY";

    button.append(name, status);
    li.appendChild(button);
    walkmanListEl.appendChild(li);
  });
}

function landmarkMetrics(landmark) {
  const layout = currentLayout();
  const dx = shortestWrappedDelta(landmark.x, state.x, layout.mapWidth);
  const dy = shortestWrappedDelta(landmark.y, state.y, layout.mapHeight);

  return {
    distance: Math.hypot(dx, dy),
    direction: describeDirection(dx, dy),
    sector: findDistrictName(landmark.x, landmark.y).toUpperCase(),
  };
}

function nearestLandmark(maxDistance = Infinity) {
  let best = null;

  currentLayout().landmarks.forEach((landmark) => {
    const metrics = landmarkMetrics(landmark);
    if (metrics.distance > maxDistance) {
      return;
    }
    if (!best || metrics.distance < best.distance) {
      best = { landmark, ...metrics };
    }
  });

  return best;
}

function discoverLandmark(landmark) {
  if (state.discoveredLandmarks.has(landmark.id)) {
    return;
  }

  state.discoveredLandmarks.add(landmark.id);
  pushLog(`Landmark sighted: ${landmark.name}. ${landmark.desc}`);
}

function findActiveChannel() {
  for (const channel of state.channels) {
    const dx = shortestWrappedDelta(state.x, channel.tileX + 0.5, mapWidth());
    const dy = shortestWrappedDelta(state.y, channel.tileY + 0.5, mapHeight());
    const dist = Math.hypot(dx, dy);
    if (dist <= 0.9) return channel;
  }
  return null;
}

function ensureRuntime(channel) {
  if (state.audioRuntimeById.has(channel.id)) {
    return state.audioRuntimeById.get(channel.id);
  }

  const audio = new Audio();
  audio.loop = true;
  audio.preload = "none";
  audio.volume = 0.82;

  const runtime = {
    channelId: channel.id,
    audio,
    lastGoodUrl: null,
  };

  state.audioRuntimeById.set(channel.id, runtime);
  return runtime;
}

function buildCandidateUrls(channel, runtime) {
  const urls = [...new Set([channel.audio?.primaryUrl, channel.audio?.fallbackUrl].filter(Boolean))];
  if (!runtime.lastGoodUrl || !urls.includes(runtime.lastGoodUrl)) {
    return urls;
  }
  return [runtime.lastGoodUrl, ...urls.filter((url) => url !== runtime.lastGoodUrl)];
}

function playCandidateUrl(audio, url, timeoutMs) {
  return new Promise((resolve, reject) => {
    let settled = false;

    const cleanup = () => {
      audio.removeEventListener("error", onError);
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("canplay", onCanPlay);
      clearTimeout(timerId);
    };

    const fail = (error) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(error instanceof Error ? error : new Error(String(error)));
    };

    const succeed = () => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve();
    };

    const onError = () => fail(new Error("media_error"));
    const onPlaying = () => succeed();
    const onCanPlay = () => {
      const promise = audio.play();
      if (promise && typeof promise.then === "function") {
        promise.then(succeed).catch(fail);
      } else {
        succeed();
      }
    };

    const timerId = setTimeout(() => fail(new Error("timeout")), timeoutMs);

    audio.addEventListener("error", onError);
    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("canplay", onCanPlay);

    audio.src = url;
    audio.load();
  });
}

async function playChannelAudio(channel, source = "zone") {
  if (!state.audioEnabled || state.audioLockedReason || !channel || !channel.audio) {
    return;
  }

  const runtime = ensureRuntime(channel);
  cancelPendingAudio();
  const playToken = state.playToken;

  stopCurrentAudio();
  setNowPlaying(`${channel.name} (loading)`);
  setAudioStatus("loading");

  const candidates = buildCandidateUrls(channel, runtime);
  for (const url of candidates) {
    try {
      await playCandidateUrl(runtime.audio, url, 8500);

      if (playToken !== state.playToken) {
        return;
      }

      runtime.lastGoodUrl = url;
      state.currentAudio = runtime.audio;
      state.playbackSource = source;
      renderAudioControls();

      const sourceLabel = url === channel.audio.primaryUrl ? "primary" : "fallback";
      setNowPlaying(channel.name);
      setAudioStatus(`live (${sourceLabel})`);
      renderWalkmanDeck();
      return;
    } catch (error) {
      if (playToken !== state.playToken) {
        return;
      }

      if (error && error.name === "NotAllowedError") {
        setNowPlaying("(audio blocked)");
        setAudioStatus("blocked by browser");
        if (!state.audioBlockedWarned) {
          state.audioBlockedWarned = true;
          pushLog('Audio blocked by browser policy. Use "Enable Audio" after page interaction.');
        }
        renderWalkmanDeck();
        return;
      }
    }
  }

  if (playToken !== state.playToken) {
    return;
  }

  setNowPlaying("(missing audio)");
  setAudioStatus("error");
  pushLog(`Audio failed for ${channel.name}. Check primary/fallback URLs in channels.json.`);
  renderWalkmanDeck();
}

function enableAudio(shouldEnable) {
  if (!shouldEnable) {
    state.audioEnabled = false;
    cancelPendingAudio();
    stopCurrentAudio();
    setNowPlaying("(muted)");
    setAudioStatus(state.audioLockedReason ? `disabled (${state.audioLockedReason})` : "idle");
    renderAudioControls();
    pushLog("Audio muted.");
    return false;
  }

  if (state.audioLockedReason) {
    state.audioEnabled = false;
    setAudioStatus(`disabled (${state.audioLockedReason})`);
    setNowPlaying("(unavailable)");
    renderAudioControls();
    pushLog(`Audio unavailable: ${state.audioLockedReason}.`);
    return false;
  }

  state.audioEnabled = true;
  setAudioStatus("armed");
  renderAudioControls();
  pushLog("Audio armed. Walkman tapes and live transmissions are now available.");

  const walkmanChannel = activeWalkmanChannel();
  if (walkmanChannel) {
    playChannelAudio(walkmanChannel, "walkman");
  } else {
    const active = getChannelById(state.activeChannelId);
    if (active && active.audio) {
      playChannelAudio(active, "zone");
    } else if (active) {
      setNowPlaying("(quiet zone)");
    } else {
      setNowPlaying("(standby)");
    }
  }

  renderWalkmanDeck();
  return true;
}

function playWalkmanTape(channelId) {
  const channel = getChannelById(channelId);
  if (!channel || !channel.audio || !state.collectedTapeIds.has(channel.id)) {
    return;
  }

  if (state.walkmanChannelId === channel.id && isWalkmanPlaybackActive()) {
    cancelPendingAudio();
    stopCurrentAudio();
    setAudioStatus(state.audioEnabled ? "armed" : "idle");
    setNowPlaying(state.audioEnabled ? "(walkman paused)" : "(muted)");
    pushLog(`Walkman paused: ${channel.name}.`);
    renderWalkmanDeck();
    return;
  }

  state.walkmanChannelId = channel.id;
  pushLog(`Walkman loaded: ${channel.name}.`);

  if (!state.audioEnabled) {
    setNowPlaying(`${channel.name} (walkman loaded)`);
    setAudioStatus(state.audioLockedReason ? `disabled (${state.audioLockedReason})` : "idle");
    renderWalkmanDeck();
    return;
  }

  if (state.audioLockedReason) {
    setNowPlaying("(unavailable)");
    setAudioStatus(`disabled (${state.audioLockedReason})`);
    renderWalkmanDeck();
    return;
  }

  playChannelAudio(channel, "walkman").finally(() => {
    renderWalkmanDeck();
  });
}

function collectTape(channel) {
  if (!channel.audio || state.collectedTapeIds.has(channel.id)) {
    return;
  }

  state.collectedTapeIds.add(channel.id);
  pushLog(`Tape acquired: ${channel.name}. Added to Walkman deck.`);
  renderWalkmanDeck();
}

function setActiveChannel(channelId) {
  state.activeChannelId = channelId;
  renderChannels();

  const active = getChannelById(channelId);
  const walkmanChannel = activeWalkmanChannel();
  if (walkmanChannel) {
    if (state.audioLockedReason) {
      setNowPlaying("(unavailable)");
      setAudioStatus(`disabled (${state.audioLockedReason})`);
      return;
    }

    if (!state.audioEnabled) {
      setNowPlaying(`${walkmanChannel.name} (walkman loaded)`);
      setAudioStatus("idle");
      return;
    }

    if (!isWalkmanPlaybackActive()) {
      playChannelAudio(walkmanChannel, "walkman");
    }
    return;
  }

  if (!active) {
    cancelPendingAudio();
    stopCurrentAudio();
    setNowPlaying(state.audioEnabled ? "(standby)" : state.audioLockedReason ? "(unavailable)" : "(muted)");
    setAudioStatus(state.audioLockedReason ? `disabled (${state.audioLockedReason})` : state.audioEnabled ? "armed" : "idle");
    return;
  }

  if (!active.audio) {
    cancelPendingAudio();
    stopCurrentAudio();
    setNowPlaying(state.audioEnabled ? "(quiet zone)" : "(muted)");
    setAudioStatus(state.audioLockedReason ? `disabled (${state.audioLockedReason})` : state.audioEnabled ? "armed" : "idle");
    return;
  }

  if (state.audioLockedReason) {
    cancelPendingAudio();
    stopCurrentAudio();
    setNowPlaying("(unavailable)");
    setAudioStatus(`disabled (${state.audioLockedReason})`);
    return;
  }

  if (!state.audioEnabled) {
    cancelPendingAudio();
    stopCurrentAudio();
    setNowPlaying("(muted)");
    setAudioStatus("idle");
    return;
  }

  playChannelAudio(active, "zone");
}

function unlock(channel) {
  state.unlocked.add(channel.id);
  pushLog(`Signal unlocked: ${channel.name}. ${channel.desc}`);
  collectTape(channel);
  renderChannels();
  renderWalkmanDeck();
}

function describeDirection(dx, dy) {
  const threshold = 0.35;
  const vertical = dy <= -threshold ? "N" : dy >= threshold ? "S" : "";
  const horizontal = dx <= -threshold ? "W" : dx >= threshold ? "E" : "";
  return vertical || horizontal ? `${vertical}${horizontal}` : "HERE";
}

function trackingMetrics(channel) {
  const layout = currentLayout();
  const targetX = channel.tileX + 0.5;
  const targetY = channel.tileY + 0.5;
  const dx = shortestWrappedDelta(targetX, state.x, layout.mapWidth);
  const dy = shortestWrappedDelta(targetY, state.y, layout.mapHeight);

  return {
    distance: Math.hypot(dx, dy),
    direction: describeDirection(dx, dy),
    sector: findDistrictName(targetX, targetY).toUpperCase(),
  };
}

function trackingStatusLabel(channel, isActiveFocus) {
  const status = channelStatus(channel);
  if (isActiveFocus) {
    return status === "LIVE" ? "TUNED LIVE" : status === "QUIET" ? "TUNED QUIET" : status;
  }
  return `TRACKING ${status}`;
}

function setTrackedChannel(channelId) {
  const nextChannelId = channelId && state.channelsById.has(channelId) ? channelId : null;

  if (state.trackedChannelId === nextChannelId) {
    if (!nextChannelId) {
      return;
    }

    state.trackedChannelId = null;
    pushLog("Tracking cleared. Free scan restored.");
  } else {
    state.trackedChannelId = nextChannelId;
    if (nextChannelId) {
      const tracked = getTrackedChannel();
      pushLog(`Tracking ${tracked.name}. Follow the radar pulse.`);
    }
  }

  renderChannels();
  renderTrackingControls();
  updateReadout(getChannelById(state.activeChannelId));
  draw();
}

function updateSignalDossier(activeChannel) {
  const layout = currentLayout();
  const sector = findDistrictName(state.x, state.y).toUpperCase();
  const coords = `${wrapCoord(state.x, layout.mapWidth).toFixed(1)}, ${wrapCoord(state.y, layout.mapHeight).toFixed(1)}`;
  const unlockedCount = state.unlocked.size;
  const trackedChannel = getTrackedChannel();
  const focusChannel = activeChannel || trackedChannel;
  const isActiveFocus = Boolean(activeChannel);
  const landmarkInfo = nearestLandmark(2.6);
  const audioLine = state.audioLockedReason
    ? `AUDIO: UNAVAILABLE (${state.audioLockedReason.toUpperCase()})`
    : `AUDIO: ${state.audioEnabled ? state.audioStatus.toUpperCase() : "MUTED"}`;

  signalProgressEl.textContent = `UNLOCKED ${unlockedCount}/${state.channels.length}`;
  dossierMetaPrimaryEl.textContent = `SECTOR: ${sector} // COORDS: ${coords}`;

  if (!focusChannel) {
    if (landmarkInfo) {
      dossierStateEl.textContent = state.discoveredLandmarks.has(landmarkInfo.landmark.id) ? "LANDMARK SIGHTED" : "VISUAL CONTACT";
      dossierNameEl.textContent = landmarkInfo.landmark.name;
      dossierDescEl.textContent = landmarkInfo.landmark.desc;
      dossierMetaSecondaryEl.textContent = `${audioLine} // LANDMARK: ${landmarkInfo.landmark.shortLabel} ${landmarkInfo.distance.toFixed(1)} TILES ${landmarkInfo.direction}`;
      dossierCreditEl.textContent = `REGION: ${landmarkInfo.sector} // BAY ICON DISCOVERY ${state.discoveredLandmarks.size}/${layout.landmarks.length}`;
      return;
    }

    dossierStateEl.textContent = "ROAMING STATIC";
    dossierNameEl.textContent = layout.name;
    dossierDescEl.textContent = layout.copy.subtitle;
    dossierMetaSecondaryEl.textContent = `${audioLine} // SCAN MODE: WRAP WORLD`;
    dossierCreditEl.textContent = `CREDITS: Move onto a signal marker or landmark icon to reveal more of the bay. ICONS ${state.discoveredLandmarks.size}/${layout.landmarks.length}`;
    return;
  }

  const isUnlocked = state.unlocked.has(focusChannel.id);
  const metrics = trackingMetrics(focusChannel);

  dossierStateEl.textContent = trackingStatusLabel(focusChannel, isActiveFocus);
  dossierNameEl.textContent = focusChannel.name;

  if (!isActiveFocus && !isUnlocked) {
    dossierDescEl.textContent = "Encrypted signal pinned on radar. Reach the marker on foot to decode its notes and credits.";
    dossierMetaSecondaryEl.textContent = `TRACK: ${metrics.distance.toFixed(1)} TILES ${metrics.direction} // TARGET SECTOR: ${metrics.sector}`;
    dossierCreditEl.textContent = "CREDITS: Hidden until unlocked.";
    return;
  }

  dossierDescEl.textContent = focusChannel.desc;

  if (!focusChannel.audio) {
    dossierMetaSecondaryEl.textContent = isActiveFocus
      ? `${audioLine} // SIGNAL TYPE: QUIET ZONE`
      : `TRACK: ${metrics.distance.toFixed(1)} TILES ${metrics.direction} // TARGET: QUIET ZONE`;
    dossierCreditEl.textContent = landmarkInfo ? `LANDMARK: ${landmarkInfo.landmark.name}` : "CREDITS: Off-air community relay point.";
    return;
  }

  dossierMetaSecondaryEl.textContent = isActiveFocus
    ? `${audioLine} // LENGTH: ${formatDuration(focusChannel.audio.durationSec)}`
    : `TRACK: ${metrics.distance.toFixed(1)} TILES ${metrics.direction} // LENGTH: ${formatDuration(focusChannel.audio.durationSec)}`;
  dossierCreditEl.textContent = landmarkInfo
    ? `CREDITS: ${focusChannel.audio.attribution} // NEAR ${landmarkInfo.landmark.name}`
    : `CREDITS: ${focusChannel.audio.attribution} // ${focusChannel.audio.license}`;
}

function renderChannels() {
  listEl.innerHTML = "";

  state.channels.forEach((channel) => {
    const li = document.createElement("li");
    const isUnlocked = state.unlocked.has(channel.id);
    const isActive = state.activeChannelId === channel.id;
    const isTracked = state.trackedChannelId === channel.id;
    const statusLabel = channelStatus(channel);
    const itemState = !isUnlocked ? "locked" : channel.audio ? "live" : "quiet";

    li.className = `${itemState}${isActive ? " active" : ""}${isTracked ? " tracked" : ""}`;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "channel-button";
    button.dataset.channelId = channel.id;
    button.setAttribute("aria-pressed", String(isTracked));
    button.title = isTracked ? "Clear tracked signal" : `Track ${channel.name}`;

    const name = document.createElement("span");
    name.className = "name";
    name.textContent = channel.name;

    const status = document.createElement("span");
    status.className = "status";
    status.textContent = statusLabel;

    button.append(name, status);
    li.appendChild(button);
    listEl.appendChild(li);
  });
}

function findDistrictName(x, y) {
  const layout = currentLayout();
  const wrappedX = wrapCoord(x, layout.mapWidth);
  const wrappedY = wrapCoord(y, layout.mapHeight);

  for (const district of layout.districts) {
    if (
      wrappedX >= district.x1 &&
      wrappedX <= district.x2 &&
      wrappedY >= district.y1 &&
      wrappedY <= district.y2
    ) {
      return district.name;
    }
  }

  return layout.name;
}

function updateReadout(channel) {
  const layout = currentLayout();
  const landmarkInfo = nearestLandmark(4.8);
  coordsEl.textContent = `POS ${wrapCoord(state.x, layout.mapWidth).toFixed(1)}, ${wrapCoord(state.y, layout.mapHeight).toFixed(1)}`;
  sectorEl.textContent = `SECTOR: ${findDistrictName(state.x, state.y).toUpperCase()}`;
  landmarkEl.textContent = landmarkInfo
    ? landmarkInfo.distance <= 1.4
      ? `LANDMARK: ${landmarkInfo.landmark.name.toUpperCase()}`
      : `LANDMARK: ${landmarkInfo.landmark.shortLabel} ${landmarkInfo.distance.toFixed(1)} ${landmarkInfo.direction}`
    : "LANDMARK: SCANNING";
  updateSignalDossier(channel);
  const trackedChannel = getTrackedChannel();

  if (!channel) {
    if (trackedChannel) {
      signalEl.textContent = `SIGNAL: TRACKING ${trackedChannel.name.toUpperCase()}`;
      return;
    }
    signalEl.textContent = `SIGNAL: ${layout.name.toUpperCase()} STATIC`;
    return;
  }

  if (!channel.audio) {
    signalEl.textContent = `SIGNAL: ${channel.name.toUpperCase()} (QUIET)`;
    return;
  }

  signalEl.textContent = `SIGNAL: ${channel.name.toUpperCase()}`;
}

function updatePlayer(dt) {
  let dx = 0;
  let dy = 0;

  if (state.keyboardKeys.left || state.touchKeys.left || state.dragKeys.left) dx -= 1;
  if (state.keyboardKeys.right || state.touchKeys.right || state.dragKeys.right) dx += 1;
  if (state.keyboardKeys.up || state.touchKeys.up || state.dragKeys.up) dy -= 1;
  if (state.keyboardKeys.down || state.touchKeys.down || state.dragKeys.down) dy += 1;

  state.moving = dx !== 0 || dy !== 0;

  if (state.moving) {
    const length = Math.hypot(dx, dy);
    dx /= length;
    dy /= length;
  }

  if (dx < 0) state.facing = "left";
  if (dx > 0) state.facing = "right";

  const move = state.speed * dt;
  const nx = wrapCoord(state.x + dx * move, mapWidth());
  const ny = wrapCoord(state.y + dy * move, mapHeight());

  if (!collides(nx, state.y)) state.x = nx;
  if (!collides(state.x, ny)) state.y = ny;
}

function updateCamera(dt) {
  const strength = 1 - Math.exp(-dt * 9);
  state.cameraX = wrapCoord(state.cameraX + shortestWrappedDelta(state.x, state.cameraX, mapWidth()) * strength, mapWidth());
  state.cameraY = wrapCoord(state.cameraY + shortestWrappedDelta(state.y, state.cameraY, mapHeight()) * strength, mapHeight());
}

function paletteValue(key) {
  const layoutPalette = currentLayout().palette || {};
  return layoutPalette[key] || DEFAULT_PALETTE[key];
}

function withAlpha(color, alpha) {
  const match = typeof color === "string" ? color.match(/^rgba?\(([^)]+)\)$/) : null;
  if (!match) return color;
  const parts = match[1].split(",").slice(0, 3).map((part) => part.trim());
  return `rgba(${parts.join(", ")}, ${alpha})`;
}

function worldToScreen(worldX, worldY) {
  const layout = currentLayout();
  return {
    x: (shortestWrappedDelta(worldX, state.cameraX, layout.mapWidth) + layout.viewport.width / 2) * TILE_SIZE,
    y: (shortestWrappedDelta(worldY, state.cameraY, layout.mapHeight) + layout.viewport.height / 2) * TILE_SIZE,
  };
}

function isVisible(px, py, width = TILE_SIZE, height = TILE_SIZE) {
  return px < canvas.width + width && py < canvas.height + height && px > -width && py > -height;
}

function adjacentTileCount(x, y, targetTiles, layout = currentLayout()) {
  let count = 0;

  for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
    for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
      if (offsetX === 0 && offsetY === 0) {
        continue;
      }

      if (targetTiles.includes(mapTile(x + offsetX, y + offsetY, layout))) {
        count += 1;
      }
    }
  }

  return count;
}

function drawRoadTile(px, py, x, y) {
  const layout = currentLayout();
  const urbanity = adjacentTileCount(x, y, ["B", "=", "P"], layout);
  const nearWater = adjacentTileCount(x, y, ["S", "~"], layout);
  const nearHills = adjacentTileCount(x, y, ["H"], layout);
  const pulse = Math.floor((state.tick * 8 + x * 5 + y * 3) % 14);

  const downtownBand =
    x >= Math.floor(layout.mapWidth * 0.25) &&
    x <= Math.floor(layout.mapWidth * 0.76) &&
    y >= Math.floor(layout.mapHeight * 0.16) &&
    y <= Math.floor(layout.mapHeight * 0.66);
  const urbanCore = urbanity >= 2 || (downtownBand && nearWater >= 2);
  const dryUpland = nearHills >= 2 || y >= Math.floor(layout.mapHeight * 0.62);

  if (urbanCore) {
    ctx.fillStyle = (x + y) % 2 ? paletteValue("cityDark") : paletteValue("cityLight");
    ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
    ctx.fillStyle = paletteValue("buildingFace");
    ctx.fillRect(px + 3, py + 3, TILE_SIZE - 6, TILE_SIZE - 6);
    ctx.fillStyle = paletteValue("cityLine");
    ctx.fillRect(px + 4, py + 15, TILE_SIZE - 8, 2);
    ctx.fillRect(px + 15, py + 4, 2, TILE_SIZE - 8);
    ctx.fillRect(px + 7 + pulse, py + 8, 4, 2);
    ctx.fillRect(px + 17, py + 20, 5, 2);
    return;
  }

  if (dryUpland) {
    ctx.fillStyle = (x + y) % 2 ? paletteValue("soilDark") : paletteValue("soilLight");
    ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
    ctx.fillStyle = paletteValue("coastBright");
    ctx.fillRect(px + 4, py + 8, TILE_SIZE - 8, 3);
    ctx.fillRect(px + 8, py + 18, TILE_SIZE - 14, 2);
    ctx.fillStyle = paletteValue("treeDark");
    ctx.fillRect(px + 6, py + 13, 3, 3);
    ctx.fillRect(px + 19, py + 10, 3, 3);
    ctx.fillStyle = paletteValue("treeLight");
    ctx.fillRect(px + 7, py + 12, 2, 1);
    ctx.fillRect(px + 20, py + 9, 2, 1);
    return;
  }

  ctx.fillStyle = (x + y) % 2 ? paletteValue("roadDark") : paletteValue("roadLight");
  ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = paletteValue("roadInset");
  ctx.fillRect(px + 4, py + 6, TILE_SIZE - 8, TILE_SIZE - 12);
  ctx.fillStyle = paletteValue("treeDark");
  ctx.fillRect(px + 6, py + 7, 3, 3);
  ctx.fillRect(px + 21, py + 10, 4, 3);
  ctx.fillRect(px + 12, py + 20, 3, 3);
  ctx.fillStyle = paletteValue("treeLight");
  ctx.fillRect(px + 7, py + 8, 2, 1);
  ctx.fillRect(px + 22, py + 11, 2, 1);
  ctx.fillRect(px + 13, py + 21, 2, 1);
  ctx.fillStyle = paletteValue("roadLine");
  if ((x + y) % 2) {
    ctx.fillRect(px + 9, py + 14, 13, 2);
    ctx.fillRect(px + 12 + (pulse % 5), py + 14, 3, 2);
  } else {
    ctx.fillRect(px + 14, py + 8, 2, 13);
    ctx.fillRect(px + 14, py + 11 + (pulse % 5), 2, 3);
  }
}

function drawShallowTile(px, py, x, y) {
  const layout = currentLayout();
  const sway = Math.sin(state.tick * 4.5 + x * 0.9 + y * 0.7) * 2;
  const marshy = y >= layout.mapHeight * 0.68 || adjacentTileCount(x, y, [".", "P", "H", "B"], layout) >= 4;
  ctx.fillStyle = (x + y) % 2 ? paletteValue("shoalDark") : paletteValue("shoalLight");
  ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = paletteValue("coastBright");
  ctx.fillRect(px + 3, py + 4, TILE_SIZE - 6, 5);
  ctx.fillStyle = paletteValue("waterGlow");
  ctx.fillRect(px + 4, py + 12, TILE_SIZE - 8, 2);
  ctx.fillRect(px + 7, py + 21, TILE_SIZE - 14, 2);
  ctx.fillStyle = paletteValue("shoalGlow");
  ctx.fillRect(px + 6, py + 8, 4, 4);
  ctx.fillRect(px + 18, py + 18, 6, 3);

  if (marshy) {
    ctx.fillStyle = paletteValue("reedDark");
    ctx.fillRect(px + 8 + Math.round(sway), py + 16, 1, 8);
    ctx.fillRect(px + 14 - Math.round(sway / 2), py + 15, 1, 9);
    ctx.fillRect(px + 20 + Math.round(sway / 3), py + 17, 1, 7);
    ctx.fillStyle = paletteValue("reedLight");
    ctx.fillRect(px + 7 + Math.round(sway), py + 15, 3, 2);
    ctx.fillRect(px + 13 - Math.round(sway / 2), py + 14, 3, 2);
    ctx.fillRect(px + 19 + Math.round(sway / 3), py + 16, 3, 2);
  }
}

function drawWaterTile(px, py, x, y) {
  ctx.fillStyle = paletteValue("waterDark");
  ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = (x + y) % 2 ? paletteValue("waterLight") : paletteValue("shoalDark");
  ctx.fillRect(px + 1, py + 1, TILE_SIZE - 2, TILE_SIZE - 2);
  const waveOffset = Math.floor((state.tick * 12 + x * 5 + y * 3) % 16);
  ctx.fillStyle = paletteValue("waterGlow");
  ctx.fillRect(px + 4, py + 7 + (waveOffset % 3), 10, 2);
  ctx.fillRect(px + 16, py + 18 - (waveOffset % 3), 8, 2);
  ctx.fillStyle = paletteValue("waterSpark");
  ctx.fillRect(px + 7 + (waveOffset % 6), py + 10, 2, 2);
  ctx.fillRect(px + 18 - (waveOffset % 5), py + 22, 2, 2);
}

function drawBridgeTile(px, py, x, y) {
  const layout = currentLayout();
  const north = mapTile(x, y - 1, layout) === "=";
  const south = mapTile(x, y + 1, layout) === "=";
  const west = mapTile(x - 1, y, layout) === "=";
  const east = mapTile(x + 1, y, layout) === "=";
  const vertical = (north || south) && !(west || east);
  const goldenGate = getLandmarkById("golden-gate", layout);
  const nearGoldenGate = Boolean(goldenGate)
    && Math.abs(shortestWrappedDelta(x + 0.5, goldenGate.x, layout.mapWidth)) <= 1.3
    && Math.abs(shortestWrappedDelta(y + 0.5, goldenGate.y, layout.mapHeight)) <= 2.8;
  const bridgeBaseColor = nearGoldenGate ? "#93483a" : paletteValue("bridgeBase");
  const bridgeDeckColor = nearGoldenGate ? "#c55e49" : paletteValue("bridgeDeck");
  const bridgeRailColor = nearGoldenGate ? "#ff6b5d" : paletteValue("bridgeRail");
  const bridgeLightColor = nearGoldenGate ? "#ffd8cd" : paletteValue("bridgeLight");

  ctx.fillStyle = bridgeBaseColor;
  ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = bridgeDeckColor;
  if (vertical) {
    ctx.fillRect(px + 4, py + 2, TILE_SIZE - 8, TILE_SIZE - 4);
  } else {
    ctx.fillRect(px + 2, py + 4, TILE_SIZE - 4, TILE_SIZE - 8);
  }
  ctx.fillStyle = bridgeRailColor;
  if (vertical) {
    ctx.fillRect(px + 4, py, 2, TILE_SIZE);
    ctx.fillRect(px + TILE_SIZE - 6, py, 2, TILE_SIZE);
    ctx.fillRect(px + 8, py + 6, 8, 1);
    ctx.fillRect(px + 9, py + 5, 6, 1);
    ctx.fillRect(px + 8, py + 18, 8, 1);
    ctx.fillRect(px + 9, py + 19, 6, 1);
    if (nearGoldenGate) {
      ctx.fillRect(px + 10, py + 3, 2, 3);
      ctx.fillRect(px + 20, py + 3, 2, 3);
      ctx.fillRect(px + 10, py + 23, 2, 3);
      ctx.fillRect(px + 20, py + 23, 2, 3);
    }
  } else {
    ctx.fillRect(px, py + 4, TILE_SIZE, 2);
    ctx.fillRect(px, py + TILE_SIZE - 6, TILE_SIZE, 2);
  }
  const light = Math.floor((state.tick * 10 + x * 4 + y * 2) % TILE_SIZE);
  ctx.fillStyle = bridgeLightColor;
  if (vertical) {
    ctx.fillRect(px + 14, py + light, 3, 5);
  } else {
    ctx.fillRect(px + light, py + 14, 5, 3);
  }
}

function drawHillTile(px, py, x, y) {
  ctx.fillStyle = paletteValue("soilDark");
  ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = paletteValue("hillBase");
  ctx.fillRect(px + 2, py + 8, TILE_SIZE - 4, TILE_SIZE - 10);
  ctx.fillRect(px + 6, py + 3, TILE_SIZE - 12, 7);
  ctx.fillStyle = paletteValue("hillShade");
  ctx.fillRect(px + 4, py + 13, TILE_SIZE - 8, 4);
  ctx.fillStyle = paletteValue("hillGlow");
  ctx.fillRect(px + 7, py + 6, 10, 2);
  ctx.fillRect(px + 14, py + 15, 7, 2);
  ctx.fillRect(px + 10, py + 22, 9, 2);
  ctx.fillStyle = paletteValue("treeDark");
  ctx.fillRect(px + 6, py + 18, 3, 3);
  ctx.fillRect(px + 20, py + 12, 3, 3);
  ctx.fillStyle = paletteValue("treeLight");
  ctx.fillRect(px + 7, py + 17, 2, 1);
  ctx.fillRect(px + 21, py + 11, 2, 1);
}

function drawCoastOutline(px, py, x, y, tile) {
  const layout = currentLayout();
  const north = mapTile(x, y - 1, layout) === "~";
  const south = mapTile(x, y + 1, layout) === "~";
  const west = mapTile(x - 1, y, layout) === "~";
  const east = mapTile(x + 1, y, layout) === "~";

  if (!north && !south && !west && !east) {
    return;
  }

  ctx.fillStyle = paletteValue("coastShadow");
  if (north) ctx.fillRect(px, py, TILE_SIZE, 4);
  if (south) ctx.fillRect(px, py + TILE_SIZE - 4, TILE_SIZE, 4);
  if (west) ctx.fillRect(px, py, 4, TILE_SIZE);
  if (east) ctx.fillRect(px + TILE_SIZE - 4, py, 4, TILE_SIZE);

  ctx.fillStyle = tile === "S" ? paletteValue("shoalGlow") : paletteValue("coastBright");
  if (north) ctx.fillRect(px + 1, py + 1, TILE_SIZE - 2, 2);
  if (south) ctx.fillRect(px + 1, py + TILE_SIZE - 3, TILE_SIZE - 2, 2);
  if (west) ctx.fillRect(px + 1, py + 1, 2, TILE_SIZE - 2);
  if (east) ctx.fillRect(px + TILE_SIZE - 3, py + 1, 2, TILE_SIZE - 2);

  if (north && west) ctx.fillRect(px + 1, py + 1, 4, 4);
  if (north && east) ctx.fillRect(px + TILE_SIZE - 5, py + 1, 4, 4);
  if (south && west) ctx.fillRect(px + 1, py + TILE_SIZE - 5, 4, 4);
  if (south && east) ctx.fillRect(px + TILE_SIZE - 5, py + TILE_SIZE - 5, 4, 4);
}

function drawBuildingTile(px, py, x, y) {
  ctx.fillStyle = paletteValue("buildingBase");
  ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = (x + y) % 2 ? paletteValue("buildingFace") : paletteValue("cityLight");
  ctx.fillRect(px + 3, py + 4, TILE_SIZE - 6, TILE_SIZE - 7);
  const pulse = Math.floor(state.tick * 4 + x + y) % 3;
  const windowColor = pulse === 0 ? paletteValue("buildingWindowA") : pulse === 1 ? paletteValue("buildingWindowB") : paletteValue("buildingWindowC");
  ctx.fillStyle = windowColor;
  ctx.fillRect(px + 7, py + 7, 4, 4);
  ctx.fillRect(px + 14, py + 12, 4, 4);
  ctx.fillRect(px + 10, py + 19, 4, 4);
  ctx.fillStyle = paletteValue("cityLine");
  ctx.fillRect(px + 12, py + 4, 6, 2);
  ctx.fillRect(px + 4, py + 3, TILE_SIZE - 8, 1);
}

function drawPlazaTile(px, py, x, y) {
  drawRoadTile(px, py, x, y);
  ctx.fillStyle = paletteValue("plazaGlow");
  ctx.fillRect(px + 5, py + 5, TILE_SIZE - 10, TILE_SIZE - 10);
  ctx.fillStyle = paletteValue("roadLine");
  ctx.fillRect(px + 14, py + 6, 4, TILE_SIZE - 12);
  ctx.fillRect(px + 6, py + 14, TILE_SIZE - 12, 4);
}

function drawFogCluster(worldX, worldY, widthTiles, heightTiles, driftPhase) {
  const px = Math.round(worldToScreen(worldX + Math.sin(state.tick * 0.08 + driftPhase) * 1.6, worldY + Math.cos(state.tick * 0.05 + driftPhase) * 0.45).x);
  const py = Math.round(worldToScreen(worldX, worldY).y);
  const width = Math.round(widthTiles * TILE_SIZE);
  const height = Math.round(heightTiles * TILE_SIZE);

  if (!isVisible(px - width / 2, py - height / 2, width, height)) {
    return;
  }

  ctx.fillStyle = paletteValue("fogShadow");
  ctx.fillRect(px - width / 2, py - height / 4, width, height / 2);
  ctx.fillRect(px - width * 0.35, py - height / 2, width * 0.45, height / 2);
  ctx.fillRect(px - width * 0.1, py - height * 0.58, width * 0.42, height / 2);
  ctx.fillStyle = paletteValue("fogLight");
  ctx.fillRect(px - width * 0.42, py - height * 0.18, width * 0.84, height * 0.3);
  ctx.fillRect(px - width * 0.22, py - height * 0.45, width * 0.4, height * 0.24);
}

function drawFogBanks() {
  const goldenGate = getLandmarkById("golden-gate");
  const saltPonds = getLandmarkById("salt-ponds");

  if (goldenGate) {
    drawFogCluster(goldenGate.x - 2.4, goldenGate.y + 1.5, 6.8, 2.4, 0.2);
    drawFogCluster(goldenGate.x + 5.2, goldenGate.y + 3.6, 5.2, 2.1, 1.4);
  }

  if (saltPonds) {
    drawFogCluster(saltPonds.x - 4.6, saltPonds.y - 1.2, 7.6, 2.5, 2.6);
  }
}

function drawBird(px, py) {
  ctx.fillRect(px, py, 3, 1);
  ctx.fillRect(px + 4, py, 3, 1);
  ctx.fillRect(px + 2, py + 1, 1, 1);
  ctx.fillRect(px + 4, py + 1, 1, 1);
}

function drawBirdFlocks() {
  const anchors = [
    { landmarkId: "golden-gate", spanX: 5.8, spanY: 1.4, speed: 0.38 },
    { landmarkId: "port-oakland", spanX: 4.4, spanY: 1.1, speed: 0.32 },
    { landmarkId: "salt-ponds", spanX: 6.2, spanY: 1.5, speed: 0.28 },
  ];

  ctx.save();
  ctx.fillStyle = paletteValue("birdDark");

  anchors.forEach((anchor, anchorIndex) => {
    const landmark = getLandmarkById(anchor.landmarkId);
    if (!landmark) {
      return;
    }

    for (let birdIndex = 0; birdIndex < 4; birdIndex += 1) {
      const phase = state.tick * anchor.speed + anchorIndex * 3 + birdIndex * 0.85;
      const worldX = landmark.x + Math.sin(phase) * anchor.spanX;
      const worldY = landmark.y - 1.7 + Math.cos(phase * 1.7) * anchor.spanY;
      const screen = worldToScreen(worldX, worldY);
      const px = Math.round(screen.x);
      const py = Math.round(screen.y);

      if (!isVisible(px, py, 7, 2)) {
        continue;
      }

      drawBird(px, py);
    }
  });

  ctx.restore();
}

function drawLandmarkIcon(landmark, px, py) {
  const blink = Math.floor(state.tick * 6) % 2 === 0;
  ctx.fillStyle = landmark.color;

  if (landmark.kind === "bridge") {
    if (landmark.axis === "vertical") {
      ctx.fillRect(px + 11, py + 1, 2, 22);
      ctx.fillRect(px + 6, py + 4, 3, 16);
      ctx.fillRect(px + 15, py + 4, 3, 16);
      ctx.fillRect(px + 8, py + 7, 8, 1);
      ctx.fillRect(px + 9, py + 6, 6, 1);
      ctx.fillRect(px + 8, py + 15, 8, 1);
      ctx.fillRect(px + 9, py + 16, 6, 1);
      ctx.fillStyle = "#ffd3cc";
      ctx.fillRect(px + 11, py + 8, 2, 2);
      ctx.fillRect(px + 11, py + 17, 2, 2);
      ctx.fillStyle = landmark.color;
    } else {
      ctx.fillRect(px + 2, py + 14, 20, 2);
      ctx.fillRect(px + 5, py + 7, 3, 8);
      ctx.fillRect(px + 16, py + 7, 3, 8);
      ctx.fillRect(px + 8, py + 10, 1, 4);
      ctx.fillRect(px + 15, py + 10, 1, 4);
    }
  } else if (landmark.kind === "tower") {
    ctx.fillRect(px + 9, py + 3, 6, 15);
    ctx.fillRect(px + 8, py + 2, 8, 2);
    if (blink) ctx.fillRect(px + 11, py, 2, 2);
  } else if (landmark.kind === "radio") {
    ctx.fillRect(px + 11, py + 4, 2, 13);
    ctx.fillRect(px + 7, py + 9, 10, 1);
    ctx.fillRect(px + 8, py + 13, 8, 1);
    if (blink) {
      ctx.fillRect(px + 6, py + 6, 2, 2);
      ctx.fillRect(px + 16, py + 6, 2, 2);
    }
  } else if (landmark.kind === "port") {
    ctx.fillRect(px + 4, py + 14, 16, 2);
    ctx.fillRect(px + 6, py + 7, 2, 7);
    ctx.fillRect(px + 14, py + 6, 2, 8);
    ctx.fillRect(px + 8, py + 7, 7, 2);
    ctx.fillRect(px + 16, py + 6, 5, 2);
  } else if (landmark.kind === "grove") {
    ctx.fillRect(px + 7, py + 8, 4, 4);
    ctx.fillRect(px + 12, py + 5, 5, 5);
    ctx.fillRect(px + 16, py + 9, 4, 4);
    ctx.fillRect(px + 9, py + 12, 2, 5);
    ctx.fillRect(px + 14, py + 10, 2, 7);
    ctx.fillRect(px + 18, py + 13, 2, 4);
  } else if (landmark.kind === "pond") {
    ctx.fillRect(px + 5, py + 12, 12, 5);
    ctx.fillRect(px + 9, py + 9, 8, 4);
    ctx.fillStyle = paletteValue("coastBright");
    ctx.fillRect(px + 8, py + 10, 9, 2);
    ctx.fillStyle = landmark.color;
  } else if (landmark.kind === "island") {
    ctx.fillRect(px + 6, py + 13, 12, 4);
    ctx.fillStyle = paletteValue("buildingFace");
    ctx.fillRect(px + 10, py + 8, 5, 5);
    ctx.fillStyle = landmark.color;
  } else {
    ctx.fillRect(px + 9, py + 7, 6, 6);
  }
}

function drawLandmarks() {
  const nearby = nearestLandmark(2.6);

  ctx.save();
  ctx.font = "7px 'Press Start 2P Local', monospace";
  ctx.textBaseline = "top";

  currentLayout().landmarks.forEach((landmark) => {
    const screen = worldToScreen(landmark.x, landmark.y);
    const px = Math.round(screen.x) - 12;
    const py = Math.round(screen.y) - 18;
    const highlight = nearby && nearby.landmark.id === landmark.id;
    const discovered = state.discoveredLandmarks.has(landmark.id);
    const width = landmark.shortLabel.length * 5 + 8;

    if (!isVisible(px, py, 24, 26)) {
      return;
    }

    ctx.fillStyle = paletteValue("landmarkOutline");
    ctx.fillRect(px + 1, py + 7, 22, 12);
    drawLandmarkIcon(landmark, px, py + 2);

    ctx.fillStyle = "rgba(15, 35, 53, 0.82)";
    ctx.fillRect(px - 1, py - 2, width, 9);
    ctx.fillStyle = highlight || discovered ? landmark.color : "#f6f7ff";
    ctx.fillText(landmark.shortLabel, px + 2, py);
  });

  ctx.restore();
}

function drawMap() {
  const layout = currentLayout();
  const left = state.cameraX - layout.viewport.width / 2;
  const top = state.cameraY - layout.viewport.height / 2;
  const startX = Math.floor(left) - 1;
  const endX = Math.ceil(left + layout.viewport.width) + 1;
  const startY = Math.floor(top) - 1;
  const endY = Math.ceil(top + layout.viewport.height) + 1;

  for (let worldY = startY; worldY <= endY; worldY += 1) {
    for (let worldX = startX; worldX <= endX; worldX += 1) {
      const wrappedX = wrapTileIndex(worldX, layout.mapWidth);
      const wrappedY = wrapTileIndex(worldY, layout.mapHeight);
      const tile = layout.map[wrappedY][wrappedX];
      const px = Math.round((worldX - left) * TILE_SIZE);
      const py = Math.round((worldY - top) * TILE_SIZE);

      if (tile === "~") {
        drawWaterTile(px, py, wrappedX, wrappedY);
      } else if (tile === "S") {
        drawShallowTile(px, py, wrappedX, wrappedY);
      } else if (tile === "B") {
        drawBuildingTile(px, py, wrappedX, wrappedY);
      } else if (tile === "H") {
        drawHillTile(px, py, wrappedX, wrappedY);
      } else if (tile === "=") {
        drawBridgeTile(px, py, wrappedX, wrappedY);
      } else if (tile === "P") {
        drawPlazaTile(px, py, wrappedX, wrappedY);
      } else {
        drawRoadTile(px, py, wrappedX, wrappedY);
      }

      if (tile !== "~" && tile !== "=") {
        drawCoastOutline(px, py, wrappedX, wrappedY, tile);
      }
    }
  }
}

function drawAerialOverlay() {
  const layout = currentLayout();
  const overlay = layout.aerialOverlay;
  const image = state.aerialOverlayImage;
  if (!overlay || !image || !image.complete || !image.naturalWidth || !image.naturalHeight) {
    return;
  }

  const worldWidthPx = layout.mapWidth * TILE_SIZE;
  const worldHeightPx = layout.mapHeight * TILE_SIZE;
  const worldLeft = (state.cameraX - layout.viewport.width / 2) * TILE_SIZE;
  const worldTop = (state.cameraY - layout.viewport.height / 2) * TILE_SIZE;
  const wrappedOffsetX = ((worldLeft % worldWidthPx) + worldWidthPx) % worldWidthPx;
  const wrappedOffsetY = ((worldTop % worldHeightPx) + worldHeightPx) % worldHeightPx;

  ctx.save();
  ctx.globalAlpha = overlay.opacity;
  ctx.globalCompositeOperation = overlay.blendMode;

  for (let drawY = -wrappedOffsetY; drawY < canvas.height; drawY += worldHeightPx) {
    for (let drawX = -wrappedOffsetX; drawX < canvas.width; drawX += worldWidthPx) {
      ctx.drawImage(image, drawX, drawY, worldWidthPx, worldHeightPx);
    }
  }

  ctx.restore();
}

function drawTraffic() {
  currentLayout().trafficLanes.forEach((lane, laneIndex) => {
    const span = Math.max(1, lane.end - lane.start);
    for (let i = 0; i < lane.count; i += 1) {
      const base = ((state.tick * lane.speed + i * (span / lane.count)) % span + span) % span;
      const screen = worldToScreen(lane.start + base, lane.row);
      const px = Math.round(screen.x);
      const py = Math.round(screen.y);

      if (!isVisible(px, py, 10, 4)) {
        continue;
      }

      ctx.fillStyle = lane.color;
      ctx.fillRect(px, py, 6, 3);
      ctx.fillStyle = laneIndex % 2 === 0 ? "#ffffff" : "#ffe9ff";
      ctx.fillRect(px + 6, py, 2, 3);
    }
  });
}

function drawDistrictLabels() {
  ctx.save();
  ctx.font = "10px 'Press Start 2P Local', monospace";
  ctx.textBaseline = "top";

  currentLayout().districts.forEach((district) => {
    const screen = worldToScreen(district.labelX + 0.15, district.labelY + 0.15);
    const px = Math.round(screen.x);
    const py = Math.round(screen.y);
    const width = district.label.length * 7 + 6;

    if (!isVisible(px, py, width, 12)) {
      return;
    }

    ctx.fillStyle = paletteValue("labelBg");
    ctx.fillRect(px - 2, py - 2, width, 12);
    ctx.fillStyle = district.color;
    ctx.fillText(district.label, px, py);
  });

  ctx.restore();
}

function drawChannelMarkers() {
  const pulse = 0.8 + Math.sin(state.tick * 4.8) * 0.3;

  state.channels.forEach((channel) => {
    const isUnlocked = state.unlocked.has(channel.id);
    const isActive = state.activeChannelId === channel.id;
    const isTracked = state.trackedChannelId === channel.id;
    const screen = worldToScreen(channel.tileX, channel.tileY);
    const px = Math.round(screen.x);
    const py = Math.round(screen.y);

    if (!isVisible(px, py)) {
      return;
    }

    ctx.fillStyle = isUnlocked ? `${channel.color}66` : "rgba(130, 140, 176, 0.35)";
    ctx.fillRect(px + 8, py + 8, TILE_SIZE - 16, TILE_SIZE - 16);

    ctx.strokeStyle = isActive ? channel.color : isTracked ? "#ffe56d" : "rgba(255, 255, 255, 0.45)";
    ctx.lineWidth = isActive ? 3 : isTracked ? 2.5 : 2;
    ctx.strokeRect(px + 6 - pulse / 2, py + 6 - pulse / 2, TILE_SIZE - 12 + pulse, TILE_SIZE - 12 + pulse);

    if (isTracked && !isActive) {
      ctx.strokeStyle = "rgba(255, 79, 163, 0.75)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(px + 3 - pulse, py + 3 - pulse, TILE_SIZE - 6 + pulse * 2, TILE_SIZE - 6 + pulse * 2);
    }

    ctx.fillStyle = channel.color;
    ctx.fillRect(px + 14, py + 4, 4, 6);
    ctx.fillRect(px + 11, py + 10, 10, 3);
  });
}

function drawPlayer() {
  const screen = worldToScreen(state.x, state.y);
  const bob = state.moving ? Math.sin(state.tick * 16) * 1.2 : Math.sin(state.tick * 2.2) * 0.45;
  const body = 16;
  const left = Math.round(screen.x - body / 2);
  const top = Math.round(screen.y - body / 2 - bob);

  ctx.fillStyle = paletteValue("playerShadow");
  ctx.fillRect(left + 3, top + 15, 10, 3);

  ctx.fillStyle = paletteValue("playerSkin");
  ctx.fillRect(left + 3, top + 2, 10, 7);
  ctx.fillStyle = paletteValue("playerHair");
  ctx.fillRect(left + 2, top, 12, 4);
  ctx.fillStyle = paletteValue("playerCoat");
  ctx.fillRect(left + 1, top + 8, 14, 8);
  ctx.fillStyle = paletteValue("playerTrim");
  ctx.fillRect(left + 4, top + 9, 8, 3);
  ctx.fillStyle = paletteValue("playerEye");
  ctx.fillRect(left + (state.facing === "right" ? 9 : 5), top + 4, 2, 2);
  ctx.fillStyle = paletteValue("playerShoe");
  ctx.fillRect(left + 4, top + 16, 3, 3);
  ctx.fillRect(left + 10, top + 16, 3, 3);
}

function drawWrapHint() {
  const glow = 0.18 + Math.sin(state.tick * 3.2) * 0.05;
  ctx.fillStyle = withAlpha(paletteValue("wrapTop"), glow.toFixed(3));
  ctx.fillRect(0, 0, canvas.width, 4);
  ctx.fillRect(0, canvas.height - 4, canvas.width, 4);
  ctx.fillStyle = withAlpha(paletteValue("wrapSide"), glow.toFixed(3));
  ctx.fillRect(0, 0, 4, canvas.height);
  ctx.fillRect(canvas.width - 4, 0, 4, canvas.height);
}

function radarTileColor(tile, x, y) {
  if (tile === "~") return (x + y) % 2 ? paletteValue("waterLight") : paletteValue("waterDark");
  if (tile === "S") return (x + y) % 2 ? paletteValue("shoalLight") : paletteValue("shoalDark");
  if (tile === "H") return (x + y) % 2 ? paletteValue("hillShade") : paletteValue("hillBase");
  if (tile === "B") return paletteValue("buildingFace");
  if (tile === "=") return paletteValue("bridgeDeck");
  if (tile === "P") return paletteValue("plazaGlow");
  return (x + y) % 2 ? paletteValue("roadLight") : paletteValue("roadDark");
}

function drawRadar() {
  const layout = currentLayout();
  const scale = state.radarScale;

  radarCtx.clearRect(0, 0, radarCanvas.width, radarCanvas.height);

  for (let y = 0; y < layout.mapHeight; y += 1) {
    for (let x = 0; x < layout.mapWidth; x += 1) {
      radarCtx.fillStyle = radarTileColor(layout.map[y][x], x, y);
      radarCtx.fillRect(x * scale, y * scale, scale, scale);
    }
  }

  radarCtx.strokeStyle = "rgba(255, 255, 255, 0.16)";
  radarCtx.lineWidth = 1;
  radarCtx.strokeRect(0.5, 0.5, radarCanvas.width - 1, radarCanvas.height - 1);

  layout.landmarks.forEach((landmark) => {
    const px = Math.round(landmark.x * scale);
    const py = Math.round(landmark.y * scale);
    radarCtx.fillStyle = landmark.color;
    radarCtx.fillRect(px, py, Math.max(2, scale - 1), Math.max(2, scale - 1));
    radarCtx.strokeStyle = "rgba(15, 35, 53, 0.9)";
    radarCtx.lineWidth = 1;
    radarCtx.strokeRect(px - 0.5, py - 0.5, Math.max(2, scale - 1) + 1, Math.max(2, scale - 1) + 1);
  });

  state.channels.forEach((channel) => {
    const isUnlocked = state.unlocked.has(channel.id);
    const isActive = state.activeChannelId === channel.id;
    const isTracked = state.trackedChannelId === channel.id;
    const pad = Math.max(1, Math.floor(scale / 3));
    const size = Math.max(2, scale - pad * 2);
    const px = channel.tileX * scale + pad;
    const py = channel.tileY * scale + pad;

    radarCtx.fillStyle = isUnlocked ? channel.color : "rgba(122, 137, 180, 0.88)";
    radarCtx.fillRect(px, py, size, size);

    if (isTracked) {
      radarCtx.strokeStyle = "#ff4fa3";
      radarCtx.lineWidth = 1;
      radarCtx.strokeRect(channel.tileX * scale + 1.5, channel.tileY * scale + 1.5, Math.max(1, scale - 3), Math.max(1, scale - 3));
    }

    if (isActive) {
      radarCtx.strokeStyle = "#fff4a6";
      radarCtx.lineWidth = 1;
      radarCtx.strokeRect(channel.tileX * scale + 0.5, channel.tileY * scale + 0.5, scale - 1, scale - 1);
    }
  });

  const playerX = wrapCoord(state.x, layout.mapWidth) * scale;
  const playerY = wrapCoord(state.y, layout.mapHeight) * scale;
  const playerSize = Math.max(3, Math.floor(scale / 2));
  const playerOffset = Math.floor((scale - playerSize) / 2);

  radarCtx.fillStyle = "#ffffff";
  radarCtx.fillRect(Math.round(playerX + playerOffset), Math.round(playerY + playerOffset), playerSize, playerSize);
  radarCtx.strokeStyle = "#ff4fa3";
  radarCtx.lineWidth = 1;
  radarCtx.strokeRect(Math.round(playerX + playerOffset) - 0.5, Math.round(playerY + playerOffset) - 0.5, playerSize + 1, playerSize + 1);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap();
  drawAerialOverlay();
  drawTraffic();
  drawFogBanks();
  drawLandmarks();
  drawBirdFlocks();
  drawDistrictLabels();
  drawChannelMarkers();
  drawPlayer();
  drawWrapHint();
  drawRadar();
}

let lastTs = 0;
function loop(ts) {
  const dt = Math.min(0.05, (ts - lastTs) / 1000 || 0);
  lastTs = ts;
  state.tick += dt;

  updatePlayer(dt);
  updateCamera(dt);

  const active = findActiveChannel();
  const activeId = active ? active.id : null;

  if (activeId !== state.activeChannelId) {
    setActiveChannel(activeId);
  }

  if (active && !state.unlocked.has(active.id)) {
    unlock(active);
  }

  const landmarkInfo = nearestLandmark(1.3);
  if (landmarkInfo) {
    discoverLandmark(landmarkInfo.landmark);
  }

  updateReadout(active);
  draw();
  requestAnimationFrame(loop);
}

audioToggleEl.addEventListener("click", () => {
  enableAudio(!state.audioEnabled);
});

touchAudioToggleEl.addEventListener("click", () => {
  enableAudio(!state.audioEnabled);
});

audioStopEl.addEventListener("click", () => {
  cancelPendingAudio();
  stopCurrentAudio();
  if (state.audioEnabled && !state.audioLockedReason) {
    setNowPlaying("(stopped)");
    setAudioStatus("armed");
  }
});

touchAudioStopEl.addEventListener("click", () => {
  cancelPendingAudio();
  stopCurrentAudio();
  if (state.audioEnabled && !state.audioLockedReason) {
    setNowPlaying("(stopped)");
    setAudioStatus("armed");
  }
});

touchClearTrackEl.addEventListener("click", () => {
  setTrackedChannel(state.trackedChannelId);
});

listEl.addEventListener("click", (event) => {
  const target = event.target instanceof Element ? event.target : null;
  const button = target ? target.closest(".channel-button") : null;
  if (!button) {
    return;
  }

  setTrackedChannel(button.dataset.channelId);
});

walkmanListEl.addEventListener("click", (event) => {
  const target = event.target instanceof Element ? event.target : null;
  const button = target ? target.closest(".walkman-button") : null;
  if (!button) {
    return;
  }

  playWalkmanTape(button.dataset.channelId);
});

enterWorldEl.addEventListener("click", () => {
  startWorld();
});

enterWorldAudioEl.addEventListener("click", () => {
  startWorld({ armAudio: true });
});

window.loadLayoutManifest = loadLayoutManifest;
window.loadChannelsManifest = loadChannelsManifest;
window.setActiveChannel = setActiveChannel;
window.enableAudio = enableAudio;
window.getNowPlaying = getNowPlaying;

async function init() {
  setNowPlaying("(muted)");
  setAudioStatus("loading world");
  renderAudioControls();
  renderTrackingControls();
  setAttractStatus("LOADING WORLD...");

  if (window.location.protocol === "file:") {
    pushLog("Local tip: serve this folder over HTTP so layout and channel manifests can load.");
  }

  pushLog("Booting pirate radio world...");

  await initLayout();
  await initChannels();

  pushLog("Bay Loop now uses a modular layout manifest and a scrolling camera.");

  if (state.audioLockedReason) {
    setAudioStatus(`disabled (${state.audioLockedReason})`);
    setNowPlaying("(unavailable)");
  } else {
    setAudioStatus("idle");
    setNowPlaying("(muted)");
  }

  renderAudioControls();
  updateReadout(null);
  draw();
  state.bootReady = true;
  attractCopyEl.textContent = "World boot complete. Enter the city, track pirate signals, and sweep landmark icons across a brighter, higher-detail Bay overworld.";
  setAttractStatus("READY TO TRANSMIT // PRESS ENTER OR TAP A BUTTON", true);
}

init().catch((error) => {
  const reason = error instanceof Error ? error.message : String(error);
  pushLog(`Fatal startup error: ${reason}`);
  setAudioStatus("fatal error");
  attractCopyEl.textContent = "Boot failed before city entry. Reload after fixing the site files.";
  setAttractStatus("BOOT ERROR", false);
});
