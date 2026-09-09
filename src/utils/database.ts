import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database.db');
const db = new sqlite3.Database(dbPath);

const runAsync = promisify(db.run.bind(db));
const getAsync = promisify(db.get.bind(db));
const allAsync = promisify(db.all.bind(db));

export async function initializeDatabase() {
  const schema = `
    CREATE TABLE IF NOT EXISTS guild_config (
      guild_id TEXT PRIMARY KEY,
      staff_role_id TEXT,
      trainer_role_id TEXT,
      moderator_role_id TEXT,
      senior_mod_role_id TEXT,
      admin_role_id TEXT,
      management_role_id TEXT,
      log_channel_id TEXT,
      training_channel_id TEXT,
      application_channel_id TEXT,
      session_channel_id TEXT,
      ssu_channel_id TEXT,
      bolo_channel_id TEXT,
      ticket_category_id TEXT,
      welcome_channel_id TEXT,
      goodbye_channel_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS cases (
      case_id TEXT PRIMARY KEY,
      guild_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      staff_id TEXT NOT NULL,
      type TEXT NOT NULL,
      reason TEXT NOT NULL,
      additional_details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS infractions (
      case_id TEXT PRIMARY KEY,
      guild_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      staff_id TEXT NOT NULL,
      punishment TEXT NOT NULL,
      reason TEXT NOT NULL,
      additional_details TEXT,
      duration TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS training_records (
      training_id TEXT PRIMARY KEY,
      guild_id TEXT NOT NULL,
      trainee_id TEXT NOT NULL,
      trainer_id TEXT NOT NULL,
      result_status TEXT NOT NULL,
      patrol_performance INTEGER NOT NULL,
      moderation_ability INTEGER NOT NULL,
      grammar_usage INTEGER NOT NULL,
      professionalism INTEGER NOT NULL,
      scene_handling INTEGER NOT NULL,
      total_score REAL NOT NULL,
      average_score REAL NOT NULL,
      percentage REAL NOT NULL,
      additional_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS bolos (
      bolo_id TEXT PRIMARY KEY,
      guild_id TEXT NOT NULL,
      subject TEXT NOT NULL,
      location TEXT NOT NULL,
      reason TEXT NOT NULL,
      created_by TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      removed_by TEXT,
      removed_at DATETIME,
      status TEXT DEFAULT 'ACTIVE'
    );

    CREATE TABLE IF NOT EXISTS tickets (
      ticket_id TEXT PRIMARY KEY,
      guild_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      channel_id TEXT NOT NULL,
      subject TEXT NOT NULL,
      status TEXT DEFAULT 'open',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      closed_at DATETIME,
      closed_by TEXT
    );

    CREATE TABLE IF NOT EXISTS dm_templates (
      template_id TEXT PRIMARY KEY,
      guild_id TEXT NOT NULL,
      type TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS predefined_reasons (
      reason_id TEXT PRIMARY KEY,
      guild_id TEXT NOT NULL,
      category TEXT NOT NULL,
      reason TEXT NOT NULL,
      enabled INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS permissions (
      permission_id TEXT PRIMARY KEY,
      guild_id TEXT NOT NULL,
      command_name TEXT NOT NULL,
      role_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS staff_notes (
      note_id TEXT PRIMARY KEY,
      guild_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      author_id TEXT NOT NULL,
      notes TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS staff_reports (
      report_id TEXT PRIMARY KEY,
      guild_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      author_id TEXT NOT NULL,
      reason TEXT NOT NULL,
      additional_details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS staff_commendations (
      commendation_id TEXT PRIMARY KEY,
      guild_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      author_id TEXT NOT NULL,
      reason TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS loa (
      loa_id TEXT PRIMARY KEY,
      guild_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      reason TEXT NOT NULL,
      start_date DATETIME NOT NULL,
      end_date DATETIME,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS session_records (
      session_id TEXT PRIMARY KEY,
      guild_id TEXT NOT NULL,
      staff_members TEXT,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      ended_at DATETIME
    );

    CREATE TABLE IF NOT EXISTS applications (
      application_id TEXT PRIMARY KEY,
      guild_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      application_type TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      reviewed_at DATETIME,
      reviewed_by TEXT
    );

    CREATE TABLE IF NOT EXISTS command_cooldowns (
      cooldown_id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      command_name TEXT NOT NULL,
      expires_at DATETIME NOT NULL
    );
  `;

  return new Promise((resolve, reject) => {
    db.exec(schema, (err) => {
      if (err) reject(err);
      else resolve(true);
    });
  });
}

export { db, runAsync, getAsync, allAsync };
