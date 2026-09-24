import Database from "better-sqlite3";
import { app } from "electron";
import path from "node:path";

const dbPath = path.join(
  app.getPath("userData"),
  "tracker.db"
);

const db = new Database(dbPath);
console.log("Database:", dbPath);

const createTrackingSessionsTable = db.prepare(`
  CREATE TABLE IF NOT EXISTS tracking_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    started_at TEXT NOT NULL,
    stopped_at TEXT NOT NULL,
    duration_seconds INTEGER NOT NULL,
    created_at TEXT NOT NULL
  )
`);

createTrackingSessionsTable.run();
console.log("Tracking sessions table ready");
export default db;