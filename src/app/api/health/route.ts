import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'Speech-to-Text Complaint System (Next.js)',
    version: '2.0.0',
    features: [
      'Audio Recording',
      'Speech-to-Text (Tamil & English)',
      'AI-Powered Complaint Generation',
      'Text-to-Speech Verification',
      'Database Storage',
    ],
    ai_provider: process.env.GROQ_API_KEY ? 'Groq Llama 3.3 70B' : 'Template-based',
    timestamp: new Date().toISOString(),
    message: 'Backend is running correctly',
  });
}
