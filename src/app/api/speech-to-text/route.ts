import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

/**
 * Speech-to-Text API Route
 * 
 * NOTE: This is a simplified version for demo purposes.
 * Browser's Web Speech API should be used on the client side for better results.
 * 
 * For production, integrate with:
 * - Google Cloud Speech-to-Text API
 * - Azure Speech Services
 * - AWS Transcribe
 * - Or use browser's native SpeechRecognition API (client-side)
 */

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Create uploads directory
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const { mkdir } = await import('fs/promises');
    await mkdir(uploadsDir, { recursive: true });

    // Save uploaded file temporarily
    const bytes = await audioFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const filename = `${uuidv4()}.webm`;
    const filePath = path.join(uploadsDir, filename);
    await writeFile(filePath, buffer);

    // For demo: Return a message to use browser's speech recognition
    // In production, you would integrate with a speech recognition service here
    
    console.log(`Audio file saved: ${filename}`);
    
    // Clean up the file after processing
    setTimeout(async () => {
      try {
        await unlink(filePath);
      } catch (err) {
        console.error('Error cleaning up audio file:', err);
      }
    }, 60000); // Delete after 1 minute

    return NextResponse.json({
      success: true,
      text: 'Please use the browser\'s built-in speech recognition for better accuracy. Click the microphone button and speak your complaint.',
      language: 'en',
      note: 'This demo uses client-side speech recognition. For production, integrate with Google Cloud Speech-to-Text or similar services.'
    });

  } catch (error) {
    console.error('Error in speech-to-text:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
