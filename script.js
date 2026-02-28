const TILE_SIZE = 32;
const DEFAULT_LAYOUT_ID = "bay-loop";

const DEFAULT_COPY = {
  tag: "CYBER BAY LOOP // FRIEND-LOVING RENEGADE DIY TRANSMISSIONS",
  title: "NeoCities Pirate Radio: Bay Loop City",
  subtitle: "Walk a neon Bay Area city map to unlock rogue channels and trigger transmissions.",
  help: "Keyboard: Arrow Keys or WASD to move. Press M to toggle audio. Press X to stop. Cross any edge to loop around the city.",
};

const DEFAULT_PALETTE = {
  roadDark: "#0a1024",
  roadLight: "#0c1530",
  roadInset: "#101c3c",
  roadLine: "#6ff8ff",
  waterDark: "#04162a",
  waterLight: "#0a2748",
  waterGlow: "#37d8ff",
  bridgeBase: "#111738",
  bridgeDeck: "#1a2756",
  bridgeRail: "#ff4fa3",
  bridgeLight: "#ffe56d",
  buildingBase: "#1a0f36",
  buildingFace: "#332061",
  buildingWindowA: "#ffe56d",
  buildingWindowB: "#6ff8ff",
  buildingWindowC: "#ff84cf",
  plazaGlow: "rgba(255, 79, 163, 0.28)",
  labelBg: "rgba(6, 10, 22, 0.85)",
  wrapTop: "rgba(111, 248, 255, 0.18)",
  wrapSide: "rgba(255, 79, 163, 0.18)",
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
  blockedTiles: ["B", "~"],
  viewport: { width: 20, height: 14 },
  spawn: { x: 2.5, y: 7.5 },
  copy: DEFAULT_COPY,
  districts: [
    { name: "Sunset Marina", label: "SF", x1: 0, x2: 9, y1: 0, y2: 8, labelX: 1, labelY: 1, color: "#6ff8ff" },
    { name: "Mission Neon", label: "MSN", x1: 0, x2: 11, y1: 9, y2: 15, labelX: 1, labelY: 12, color: "#ff82cc" },
    { name: "Oakland Arcology", label: "OAK", x1: 16, x2: 31, y1: 0, y2: 11, labelX: 19, labelY: 2, color: "#ffe56d" },
    { name: "Berkeley Patch", label: "BKY", x1: 16, x2: 31, y1: 12, y2: 15, labelX: 19, labelY: 13, color: "#8effb7" },
    { name: "South Bay Loop", label: "SJ", x1: 8, x2: 31, y1: 16, y2: 21, labelX: 19, labelY: 18, color: "#7cabff" },
  ],
  trafficLanes: [
    { row: 0.5, start: 0, end: 32, speed: 4.2, color: "#ffe56d", count: 8 },
    { row: 7.5, start: 0, end: 32, speed: -5.1, color: "#7dffbb", count: 8 },
    { row: 14.5, start: 0, end: 32, speed: 3.7, color: "#35d6ff", count: 8 },
    { row: 21.5, start: 0, end: 32, speed: -4.0, color: "#ff4fa3", count: 8 },
  ],
  palette: DEFAULT_PALETTE,
  map: [
    "........ ........ ........ ........",
    ".BBB..P. ...~~~~. ...P..BB B.......",
    ".B.P..P. ...~~~~. ...P..P. B.......",
    ".B....== =..~~~~. ..===... .B......",
    ".BBB..== =..~~~~. ..===..B BB......",
    "...P..== =..~~~~. ..===..P ........",
    "......== =..~~~~. ..===... ........",
    "======.= =..~~~~. ..==.=== ========",
    "......== =..~~~~. ..===... ..P.....",
    "...P..== =..~~~~. ..===..P ..BBB...",
    ".BBB..== =..~~~~. ..===... .B.P....",
    ".B.P..== =..~~~~. ..===..B BB......",
    ".B....== =..~~~~. ..===... ..P.....",
    ".BBB..P. ...~~~~. ...P..BB B.......",
    "........ ..P~~~~P ........ ..P.....",
    ".BBB..P. ...~~~~. ...P..BB B.......",
    ".B.P.... ...====. .......P .B......",
    ".B....P. ........ ..P..... .B......",
    ".BBB.... ..P..... ..P..... BBB.....",
    "...P..BB B...P..P ....BBB. .P......",
    "......B. P....... ........ P.B.....",
    "........ ........ ........ ........",
  ],
};

const FALLBACK_CHANNELS = [
  {
    id: "dock",
    name: "Dockside Solder Net",
    tileX: 4,
    tileY: 5,
    color: "#4dff9f",
    desc: "Open hardware fixes and boat-borne radio mods.",
    audio: null,
  },
  {
    id: "rooftop",
    name: "Rooftop Dub Relay",
    tileX: 6,
    tileY: 2,
    color: "#f6bd60",
    desc: "Bass-heavy neighborhood broadcasts and sky-antenna jams.",
    audio: null,
  },
  {
    id: "freesoft",
    name: "Free Software Mast",
    tileX: 23,
    tileY: 9,
    color: "#83c5be",
    desc: "Tools, scripts, and shared code for independent stations.",
    audio: null,
  },
  {
    id: "basement",
    name: "Basement Tape Loop",
    tileX: 6,
    tileY: 17,
    color: "#ffafcc",
    desc: "Tape hiss, archival edits, and spoken zines.",
    audio: null,
  },
  {
    id: "street",
    name: "Street Mic Cipher",
    tileX: 23,
    tileY: 16,
    color: "#9bf6ff",
    desc: "Live stories, spoken word, and direct-action dispatches.",
    audio: null,
  },
];

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const coordsEl = document.getElementById("coords");
const sectorEl = document.getElementById("sector");
const signalEl = document.getElementById("signal");
const listEl = document.getElementById("channel-list");
const logEl = document.getElementById("log");
const audioToggleEl = document.getElementById("audio-toggle");
const audioStopEl = document.getElementById("audio-stop");
const nowPlayingEl = document.getElementById("now-playing");
const audioStatusEl = document.getElementById("audio-status");
const worldTagEl = document.getElementById("world-tag");
const worldTitleEl = document.getElementById("world-title");
const worldSubtagEl = document.getElementById("world-subtag");
const worldHelpEl = document.getElementById("world-help");
const layoutThemeEl = document.getElementById("layout-theme");

const touchButtons = [...document.querySelectorAll(".touch-controls button")];

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
  keys: {
    up: false,
    down: false,
    left: false,
    right: false,
  },
  channels: [],
  channelsById: new Map(),
  activeChannelId: null,
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
};

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

function setKey(key, isDown) {
  if (key === "arrowup" || key === "w") state.keys.up = isDown;
  if (key === "arrowdown" || key === "s") state.keys.down = isDown;
  if (key === "arrowleft" || key === "a") state.keys.left = isDown;
  if (key === "arrowright" || key === "d") state.keys.right = isDown;
}

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();

  if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d"].includes(key)) {
    event.preventDefault();
    setKey(key, true);
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
  setKey(event.key.toLowerCase(), false);
});

touchButtons.forEach((button) => {
  const key = button.dataset.key;

  const press = () => {
    button.classList.add("active");
    setKey(key, true);
  };

  const release = () => {
    button.classList.remove("active");
    setKey(key, false);
  };

  button.addEventListener("pointerdown", press);
  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);
  button.addEventListener("pointerleave", release);
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

function renderAudioControls() {
  const locked = Boolean(state.audioLockedReason);
  audioToggleEl.disabled = locked;
  audioStopEl.disabled = !state.currentAudio;

  if (locked) {
    audioToggleEl.classList.remove("active");
    audioToggleEl.textContent = "Audio Unavailable";
    return;
  }

  audioToggleEl.classList.toggle("active", state.audioEnabled);
  audioToggleEl.textContent = state.audioEnabled ? "Disable Audio" : "Enable Audio";
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
  renderAudioControls();
}

function stopCurrentAudio() {
  if (!state.currentAudio) {
    renderAudioControls();
    return;
  }

  state.currentAudio.pause();
  state.currentAudio.currentTime = 0;
  state.currentAudio = null;
  renderAudioControls();
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

    if (!/^[.=~BP]+$/.test(row)) {
      errors.push(`map[${index}] contains unsupported tile characters`);
    }
  });

  const blockedTiles = Array.isArray(raw.blockedTiles) && raw.blockedTiles.length > 0
    ? raw.blockedTiles.filter((tile) => typeof tile === "string" && tile.length === 1)
    : ["B", "~"];

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

function setLayout(layout) {
  state.layout = layout;
  state.unlocked.clear();
  state.activeChannelId = null;
  state.x = wrapCoord(layout.spawn.x, layout.mapWidth);
  state.y = wrapCoord(layout.spawn.y, layout.mapHeight);
  state.cameraX = state.x;
  state.cameraY = state.y;

  canvas.width = layout.viewport.width * TILE_SIZE;
  canvas.height = layout.viewport.height * TILE_SIZE;

  applyLayoutChrome(layout);
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
  state.activeChannelId = null;
  clearAudioRuntimes();
  renderChannels();
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

async function playChannelAudio(channel) {
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
      renderAudioControls();

      const sourceLabel = url === channel.audio.primaryUrl ? "primary" : "fallback";
      setNowPlaying(channel.name);
      setAudioStatus(`live (${sourceLabel})`);
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
  pushLog("Audio armed. Move through the city to hear transmissions.");

  const active = getChannelById(state.activeChannelId);
  if (active && active.audio) {
    playChannelAudio(active);
  } else if (active) {
    setNowPlaying("(quiet zone)");
  } else {
    setNowPlaying("(standby)");
  }

  return true;
}

function setActiveChannel(channelId) {
  state.activeChannelId = channelId;
  renderChannels();

  const active = getChannelById(channelId);
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

  playChannelAudio(active);
}

function unlock(channel) {
  state.unlocked.add(channel.id);
  pushLog(`Signal unlocked: ${channel.name}. ${channel.desc}`);
  renderChannels();
}

function renderChannels() {
  listEl.innerHTML = "";

  state.channels.forEach((channel) => {
    const li = document.createElement("li");
    const isUnlocked = state.unlocked.has(channel.id);
    const isActive = state.activeChannelId === channel.id;
    const isSilent = !channel.audio;

    li.className = `${isSilent ? "quiet" : isUnlocked ? "live" : "locked"}${isActive ? " active" : ""}`;

    const name = document.createElement("span");
    name.textContent = channel.name;

    const status = document.createElement("span");
    status.className = "status";
    status.textContent = isSilent ? "QUIET" : isUnlocked ? "LIVE" : "LOCKED";

    li.append(name, status);
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
  coordsEl.textContent = `POS ${wrapCoord(state.x, layout.mapWidth).toFixed(1)}, ${wrapCoord(state.y, layout.mapHeight).toFixed(1)}`;
  sectorEl.textContent = `SECTOR: ${findDistrictName(state.x, state.y).toUpperCase()}`;

  if (!channel) {
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

  if (state.keys.left) dx -= 1;
  if (state.keys.right) dx += 1;
  if (state.keys.up) dy -= 1;
  if (state.keys.down) dy += 1;

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

function drawRoadTile(px, py, x, y) {
  ctx.fillStyle = (x + y) % 2 ? paletteValue("roadDark") : paletteValue("roadLight");
  ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = paletteValue("roadInset");
  ctx.fillRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);
  const dash = Math.floor((state.tick * 8 + x * 3 + y * 2) % 16);
  ctx.fillStyle = paletteValue("roadLine");
  ctx.fillRect(px + dash, py + 15, 6, 2);
}

function drawWaterTile(px, py, x, y) {
  ctx.fillStyle = paletteValue("waterDark");
  ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = (x + y) % 2 ? paletteValue("waterLight") : paletteValue("roadInset");
  ctx.fillRect(px + 1, py + 1, TILE_SIZE - 2, TILE_SIZE - 2);
  const waveOffset = Math.floor((state.tick * 12 + x * 5 + y * 3) % 16);
  ctx.fillStyle = paletteValue("waterGlow");
  ctx.fillRect(px + 4, py + 7 + (waveOffset % 3), 10, 2);
  ctx.fillRect(px + 16, py + 18 - (waveOffset % 3), 8, 2);
}

function drawBridgeTile(px, py, x, y) {
  ctx.fillStyle = paletteValue("bridgeBase");
  ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = paletteValue("bridgeDeck");
  ctx.fillRect(px + 2, py + 4, TILE_SIZE - 4, TILE_SIZE - 8);
  ctx.fillStyle = paletteValue("bridgeRail");
  ctx.fillRect(px, py + 4, TILE_SIZE, 2);
  ctx.fillRect(px, py + TILE_SIZE - 6, TILE_SIZE, 2);
  const light = Math.floor((state.tick * 10 + x * 4 + y * 2) % TILE_SIZE);
  ctx.fillStyle = paletteValue("bridgeLight");
  ctx.fillRect(px + light, py + 14, 5, 3);
}

function drawBuildingTile(px, py, x, y) {
  ctx.fillStyle = paletteValue("buildingBase");
  ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = paletteValue("buildingFace");
  ctx.fillRect(px + 3, py + 3, TILE_SIZE - 6, TILE_SIZE - 6);
  const pulse = Math.floor(state.tick * 4 + x + y) % 3;
  const windowColor = pulse === 0 ? paletteValue("buildingWindowA") : pulse === 1 ? paletteValue("buildingWindowB") : paletteValue("buildingWindowC");
  ctx.fillStyle = windowColor;
  ctx.fillRect(px + 7, py + 7, 4, 4);
  ctx.fillRect(px + 14, py + 12, 4, 4);
  ctx.fillRect(px + 10, py + 19, 4, 4);
}

function drawPlazaTile(px, py, x, y) {
  drawRoadTile(px, py, x, y);
  ctx.fillStyle = paletteValue("plazaGlow");
  ctx.fillRect(px + 5, py + 5, TILE_SIZE - 10, TILE_SIZE - 10);
  ctx.fillStyle = "#7dffbb";
  ctx.fillRect(px + 14, py + 6, 4, TILE_SIZE - 12);
  ctx.fillRect(px + 6, py + 14, TILE_SIZE - 12, 4);
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
      } else if (tile === "B") {
        drawBuildingTile(px, py, wrappedX, wrappedY);
      } else if (tile === "=") {
        drawBridgeTile(px, py, wrappedX, wrappedY);
      } else if (tile === "P") {
        drawPlazaTile(px, py, wrappedX, wrappedY);
      } else {
        drawRoadTile(px, py, wrappedX, wrappedY);
      }
    }
  }
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
    const screen = worldToScreen(channel.tileX, channel.tileY);
    const px = Math.round(screen.x);
    const py = Math.round(screen.y);

    if (!isVisible(px, py)) {
      return;
    }

    ctx.fillStyle = isUnlocked ? `${channel.color}66` : "rgba(130, 140, 176, 0.35)";
    ctx.fillRect(px + 8, py + 8, TILE_SIZE - 16, TILE_SIZE - 16);

    ctx.strokeStyle = isActive ? channel.color : "rgba(255, 255, 255, 0.45)";
    ctx.lineWidth = isActive ? 3 : 2;
    ctx.strokeRect(px + 6 - pulse / 2, py + 6 - pulse / 2, TILE_SIZE - 12 + pulse, TILE_SIZE - 12 + pulse);

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

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap();
  drawTraffic();
  drawDistrictLabels();
  drawChannelMarkers();
  drawPlayer();
  drawWrapHint();
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

  updateReadout(active);
  draw();
  requestAnimationFrame(loop);
}

audioToggleEl.addEventListener("click", () => {
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

window.loadLayoutManifest = loadLayoutManifest;
window.loadChannelsManifest = loadChannelsManifest;
window.setActiveChannel = setActiveChannel;
window.enableAudio = enableAudio;
window.getNowPlaying = getNowPlaying;

async function init() {
  setNowPlaying("(muted)");
  setAudioStatus("loading world");
  renderAudioControls();

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
  requestAnimationFrame(loop);
}

init().catch((error) => {
  const reason = error instanceof Error ? error.message : String(error);
  pushLog(`Fatal startup error: ${reason}`);
  setAudioStatus("fatal error");
});
