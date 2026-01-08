import { NextRequest, NextResponse } from 'next/server';
import { AIComplaintGenerator } from '@/lib/ai-complaint-generator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, transcribed_text, language } = body;
    const inputText = text || transcribed_text;

    if (!inputText) {
      return NextResponse.json(
        { error: 'No text provided' },
        { status: 400 }
      );
    }

    const generator = new AIComplaintGenerator();
    const result = await generator.generateComplaint(inputText, language || 'en');

    return NextResponse.json({
      success: true,
      complaint: result.complaint_text,
      category: result.category,
      details: result.details,
    });
  } catch (error) {
    console.error('Error generating complaint:', error);
    return NextResponse.json(
      { error: 'Failed to generate complaint' },
      { status: 500 }
    );
  }
}
