import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dbDir, 'complaints.db');

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS complaints (
    id TEXT PRIMARY KEY,
    complaint_text TEXT NOT NULL,
    transcribed_text TEXT NOT NULL,
    audio_path TEXT,
    language TEXT NOT NULL,
    category TEXT,
    status TEXT DEFAULT 'submitted',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export interface Complaint {
  id: string;
  complaint_text: string;
  transcribed_text: string;
  audio_path?: string;
  language: string;
  category?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export class ComplaintDB {
  static saveComplaint(data: Omit<Complaint, 'created_at' | 'updated_at'>): Complaint {
    const stmt = db.prepare(`
      INSERT INTO complaints (id, complaint_text, transcribed_text, audio_path, language, category, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      data.id,
      data.complaint_text,
      data.transcribed_text,
      data.audio_path || null,
      data.language,
      data.category || null,
      data.status
    );

    return this.getComplaintById(data.id)!;
  }

  static getComplaintById(id: string): Complaint | undefined {
    const stmt = db.prepare('SELECT * FROM complaints WHERE id = ?');
    return stmt.get(id) as Complaint | undefined;
  }

  static getAllComplaints(): Complaint[] {
    const stmt = db.prepare('SELECT * FROM complaints ORDER BY created_at DESC');
    return stmt.all() as Complaint[];
  }

  static updateComplaintStatus(id: string, status: string): void {
    const stmt = db.prepare('UPDATE complaints SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    stmt.run(status, id);
  }
}

export default db;
