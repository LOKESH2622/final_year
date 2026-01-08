import { NextRequest, NextResponse } from 'next/server';
import { ComplaintDB } from '@/lib/database';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { complaint, transcribed_text, language, category } = body;

    if (!complaint || !transcribed_text) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const complaintId = uuidv4().split('-')[0].toUpperCase();

    const savedComplaint = ComplaintDB.saveComplaint({
      id: complaintId,
      complaint_text: complaint,
      transcribed_text: transcribed_text,
      language: language || 'en',
      category: category || 'Other',
      status: 'submitted',
    });

    return NextResponse.json({
      success: true,
      complaint_id: savedComplaint.id,
      message: 'Complaint submitted successfully',
      complaint: savedComplaint,
    });
  } catch (error) {
    console.error('Error submitting complaint:', error);
    return NextResponse.json(
      { error: 'Failed to submit complaint' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const complaint = ComplaintDB.getComplaintById(id);
      if (!complaint) {
        return NextResponse.json(
          { error: 'Complaint not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, complaint });
    }

    const complaints = ComplaintDB.getAllComplaints();
    return NextResponse.json({ success: true, complaints });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    return NextResponse.json(
      { error: 'Failed to fetch complaints' },
      { status: 500 }
    );
  }
}
