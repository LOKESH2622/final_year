import { NextRequest, NextResponse } from 'next/server';

/**
 * Text-to-Speech API Route
 * 
 * This route returns the text to be spoken by the browser's Web Speech API.
 * The actual speech synthesis happens on the client side for better compatibility
 * and to avoid server-side dependencies.
 * 
 * Benefits:
 * - No Python dependencies required
 * - Works in all modern browsers
 * - Supports multiple languages natively
 * - Better voice quality
 * - Instant response
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, language } = body;

    if (!text) {
      return NextResponse.json(
        { error: 'No text provided' },
        { status: 400 }
      );
    }

    // Return the text and language code for client-side speech synthesis
    const langCode = language === 'ta' ? 'ta-IN' : 'en-US';

    return NextResponse.json({
      success: true,
      text: text,
      language: langCode,
      message: 'Text ready for speech synthesis',
    });

  } catch (error) {
    console.error('Error in text-to-speech:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
