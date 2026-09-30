import db from "./database";

const createActivitySessionsTable = db.prepare(`
  CREATE TABLE IF NOT EXISTS activity_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    started_at TEXT NOT NULL,
    stopped_at TEXT NOT NULL,
    duration_seconds INTEGER NOT NULL,
    score INTEGER NOT NULL,
    mouse_activity INTEGER NOT NULL,
    keyboard_activity INTEGER NOT NULL,
    mouse_moves INTEGER NOT NULL,
    mouse_clicks INTEGER NOT NULL,
    keypresses INTEGER NOT NULL,
    created_at TEXT NOT NULL
  )
`);

createActivitySessionsTable.run();

export function saveActivitySession({
  startedAt,
  stoppedAt,
  durationSeconds,
  score,
  mouseActivity,
  keyboardActivity,
  mouseMoves,
  mouseClicks,
  keypresses,
}) {
  const createdAt = new Date().toISOString();

  const result = db
    .prepare(`
      INSERT INTO activity_sessions (
        started_at,
        stopped_at,
        duration_seconds,
        score,
        mouse_activity,
        keyboard_activity,
        mouse_moves,
        mouse_clicks,
        keypresses,
        created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .run(
      startedAt,
      stoppedAt,
      durationSeconds,
      score,
      mouseActivity,
      keyboardActivity,
      mouseMoves,
      mouseClicks,
      keypresses,
      createdAt
    );

  return {
    id: result.lastInsertRowid,
    startedAt,
    stoppedAt,
    durationSeconds,
    score,
    mouseActivity,
    keyboardActivity,
    mouseMoves,
    mouseClicks,
    keypresses,
    createdAt,
  };
}