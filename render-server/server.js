// TechNeeds Live Server — real-time leaderboard relay
// Runs on Render. Keeps the latest leaderboard snapshot in memory and pushes
// it to every connected browser the moment it changes.

const http = require("http");
const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 10000;
const PUBLISH_KEY = process.env.PUBLISH_KEY || ""; // optional shared secret
const ALLOWED = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// Allow: anything in ALLOWED_ORIGINS, any *.vercel.app preview, and localhost.
function originAllowed(origin) {
  if (!origin) return true; // server-to-server / curl
  if (ALLOWED.length === 0) return true;
  if (ALLOWED.includes(origin)) return true;
  try {
    const host = new URL(origin).hostname;
    return host.endsWith(".vercel.app") || host === "localhost" || host === "127.0.0.1";
  } catch {
    return false;
  }
}

const corsOptions = {
  origin: (origin, cb) => cb(null, originAllowed(origin)),
  methods: ["GET", "POST"],
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json({ limit: "200kb" }));

const server = http.createServer(app);
const io = new Server(server, { cors: corsOptions });

// ── In-memory state ─────────────────────────────────────────────
let snapshot = null; // { rows: [...], updatedAt, source }
const MAX_ROWS = 500;

function sanitizeRows(rows) {
  if (!Array.isArray(rows)) return null;
  const clean = rows
    .filter((r) => r && typeof r === "object" && (typeof r.id === "string" || typeof r.id === "number"))
    .slice(0, MAX_ROWS);
  return clean.length || rows.length === 0 ? clean : null;
}

function diffRows(prevRows, nextRows) {
  if (!prevRows) return [];
  const prev = new Map(prevRows.map((r) => [String(r.id), r]));
  const changes = [];
  for (const r of nextRows) {
    const p = prev.get(String(r.id));
    const before = Number(p?.score ?? p?.totalScore ?? NaN);
    const after = Number(r.score ?? r.totalScore ?? NaN);
    if (Number.isFinite(before) && Number.isFinite(after) && before !== after) {
      changes.push({ id: r.id, name: r.name ?? r.enrollmentNo ?? "A mentee", from: before, to: after });
    }
  }
  return changes;
}

function publish(rows, source, key) {
  if (PUBLISH_KEY && key !== PUBLISH_KEY) return { ok: false, error: "bad key" };
  const clean = sanitizeRows(rows);
  if (!clean) return { ok: false, error: "rows must be an array of objects with an id" };
  const changes = diffRows(snapshot?.rows, clean);
  snapshot = { rows: clean, updatedAt: new Date().toISOString(), source: source || "unknown" };
  io.emit("leaderboard:snapshot", snapshot);
  if (changes.length) io.emit("leaderboard:changed", { changes, at: snapshot.updatedAt });
  return { ok: true, changes: changes.length };
}

// ── HTTP routes ─────────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({
    ok: true,
    service: "techneeds-live",
    viewers: io.engine.clientsCount,
    hasSnapshot: Boolean(snapshot),
    updatedAt: snapshot?.updatedAt ?? null,
    time: new Date().toISOString(),
  });
});

app.get("/leaderboard", (_req, res) => res.json(snapshot ?? { rows: [], updatedAt: null }));

app.post("/publish", (req, res) => {
  const result = publish(req.body?.rows, req.body?.source, req.body?.key);
  res.status(result.ok ? 200 : 400).json(result);
});

// ── Socket events ───────────────────────────────────────────────
function broadcastPresence() {
  io.emit("presence", { viewers: io.engine.clientsCount });
}

io.on("connection", (socket) => {
  socket.emit("leaderboard:snapshot", snapshot); // null if nothing yet
  broadcastPresence();

  socket.on("leaderboard:publish", (payload, ack) => {
    const result = publish(payload?.rows, payload?.source, payload?.key);
    if (typeof ack === "function") ack(result);
  });

  socket.on("disconnect", broadcastPresence);
});

server.listen(PORT, () => {
  console.log(`TechNeeds live server listening on ${PORT}`);
});
