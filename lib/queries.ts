import { getDb } from './db';

// Create a new session
export function createSession(sessionId: string) {
  const db = getDb();
  const stmt = db.prepare('INSERT INTO logo_sessions (session_id) VALUES (?)');
  stmt.run(sessionId);
}

// Check if session exists
export function sessionExists(sessionId: string) {
  const db = getDb();
  const stmt = db.prepare('SELECT 1 FROM logo_sessions WHERE session_id = ?');
  return !!stmt.get(sessionId);
}

// Add prompt to history
export function addPromptToHistory(sessionId: string, promptText: string, appliedPresets: any) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO prompt_history (session_id, prompt_text, applied_presets)
    VALUES (?, ?, ?)
  `);
  stmt.run(sessionId, promptText, JSON.stringify(appliedPresets));
}

// Get all prompt history for a session
export function getPromptHistory(sessionId: string) {
  const db = getDb();
  const stmt = db.prepare(`
    SELECT * FROM prompt_history WHERE session_id = ? ORDER BY timestamp ASC
  `);
  return stmt.all(sessionId) as Array<{
    id: number;
    session_id: string;
    prompt_text: string;
    applied_presets: string;
    timestamp: string;
  }>;
}

// Add a generated logo record
export function addGeneratedLogo(sessionId: string, imagePath: string, styleMetadata: any) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO generated_logos (session_id, image_path, style_metadata)
    VALUES (?, ?, ?)
  `);
  stmt.run(sessionId, imagePath, JSON.stringify(styleMetadata));
}

// Get latest generated logo for a session
export function getLatestLogo(sessionId: string) {
  const db = getDb();
  const stmt = db.prepare(`
    SELECT * FROM generated_logos WHERE session_id = ? ORDER BY created_at DESC LIMIT 1
  `);
  return stmt.get(sessionId) as {
    id: number;
    session_id: string;
    image_path: string;
    style_metadata: string;
    created_at: string;
  } | undefined;
}
