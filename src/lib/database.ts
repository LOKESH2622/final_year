import path from 'path';
import fs from 'fs';

const dbDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dbDir, 'complaints.json');

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize complaints file if it doesn't exist
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify([]), 'utf-8');
}

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

// Helper functions to read/write complaints
function readComplaints(): Complaint[] {
  try {
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data) || [];
  } catch (error) {
    console.error('Error reading complaints file:', error);
    return [];
  }
}

function writeComplaints(complaints: Complaint[]): void {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(complaints, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing complaints file:', error);
  }
}

export class ComplaintDB {
  static saveComplaint(data: Omit<Complaint, 'created_at' | 'updated_at'>): Complaint {
    const now = new Date().toISOString();
    const complaint: Complaint = {
      ...data,
      created_at: now,
      updated_at: now,
    };

    const complaints = readComplaints();
    complaints.push(complaint);
    writeComplaints(complaints);

    return complaint;
  }

  static getComplaintById(id: string): Complaint | undefined {
    const complaints = readComplaints();
    return complaints.find(c => c.id === id);
  }

  static getAllComplaints(): Complaint[] {
    const complaints = readComplaints();
    return complaints.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  static updateComplaintStatus(id: string, status: string): void {
    const complaints = readComplaints();
    const complaint = complaints.find(c => c.id === id);
    if (complaint) {
      complaint.status = status;
      complaint.updated_at = new Date().toISOString();
      writeComplaints(complaints);
    }
  }
}
