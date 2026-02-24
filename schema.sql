CREATE TABLE IF NOT EXISTS logo_sessions (
    session_id TEXT PRIMARY KEY,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS prompt_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    prompt_text TEXT NOT NULL,
    applied_presets TEXT DEFAULT '{}',
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(session_id) REFERENCES logo_sessions(session_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS generated_logos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    image_path TEXT NOT NULL,
    style_metadata TEXT DEFAULT '{}',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(session_id) REFERENCES logo_sessions(session_id) ON DELETE CASCADE
);
