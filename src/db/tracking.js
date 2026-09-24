import db from "./database";

export function saveTrackingSession({
  startedAt,
  stoppedAt,
  durationSeconds,
}) {
  const createdAt = new Date().toISOString();

  const statement = db.prepare(`
    INSERT INTO tracking_sessions (
      started_at,
      stopped_at,
      duration_seconds,
      created_at
    )
    VALUES (?, ?, ?, ?)
  `);

  const result = statement.run(
    startedAt,
    stoppedAt,
    durationSeconds,
    createdAt
  );

  return {
    id: result.lastInsertRowid,
    startedAt,
    stoppedAt,
    durationSeconds,
    createdAt,
  };
}

export function getTotalTrackingTime() {
  const result = db
    .prepare(`
      SELECT COALESCE(SUM(duration_seconds), 0) AS total_seconds
      FROM tracking_sessions
    `)
    .get();

  return result.total_seconds;
}

export function getTrackingSessions() {
  return db
    .prepare(`
      SELECT
        id,
        started_at,
        stopped_at,
        duration_seconds,
        created_at
      FROM tracking_sessions
      ORDER BY id DESC
    `)
    .all();
}