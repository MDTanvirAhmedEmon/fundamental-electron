import db from "./database";

const createAppSessionsTable = db.prepare(`
  CREATE TABLE IF NOT EXISTS app_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    app TEXT NOT NULL,
    title TEXT,
    started_at TEXT NOT NULL,
    stopped_at TEXT NOT NULL,
    duration_seconds INTEGER NOT NULL,
    created_at TEXT NOT NULL
  )
`);

createAppSessionsTable.run();

export function saveAppSession({
  app,
  title,
  startedAt,
  stoppedAt,
  durationSeconds,
}) {
  const createdAt = new Date().toISOString();

  const result = db
    .prepare(`
      INSERT INTO app_sessions (
        app,
        title,
        started_at,
        stopped_at,
        duration_seconds,
        created_at
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    .run(
      app,
      title,
      startedAt,
      stoppedAt,
      durationSeconds,
      createdAt
    );

  return {
    id: result.lastInsertRowid,
    app,
    title,
    startedAt,
    stoppedAt,
    durationSeconds,
    createdAt,
  };
};