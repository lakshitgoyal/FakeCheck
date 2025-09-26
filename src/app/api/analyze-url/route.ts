import { NextRequest, NextResponse } from 'next/server';
import { performAnalysis } from '@/lib/actions';
import axios from 'axios';

// Helper to get MIME type from URL extension
function getMimeTypeFromUrl(url: string): string | null {
    const extension = url.split('.').pop()?.toLowerCase();
    if (!extension) return null;

    const mimeTypes: { [key: string]: string } = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'webp': 'image/webp',
        'mp4': 'video/mp4',
        'webm': 'video/webm',
        'mkv': 'video/x-matroska',
        'mp3': 'audio/mpeg',
        'wav': 'audio/wav',
        'ogg': 'audio/ogg',
    };

    return mimeTypes[extension] || null;
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'A valid URL must be provided.' }, { status: 400 });
    }

    // Optional: Basic security check for the URL
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return NextResponse.json({ error: 'Invalid URL format.' }, { status: 400 });
    }

    // Fetch the media file from the external URL
    const response = await axios.get(url, {
      responseType: 'arraybuffer', // Fetch as raw binary data
      timeout: 10000, // 10 second timeout
    });

    // Check content type from headers first
    let contentType = response.headers['content-type'];

    // If header is missing or generic, try to infer from URL
    if (!contentType || contentType.includes('text/html') || contentType.includes('application/octet-stream')) {
        const inferredMime = getMimeTypeFromUrl(url);
        if (inferredMime) {
            contentType = inferredMime;
        }
    }
    
    // Final check
    if (!contentType || (!contentType.startsWith('image/') && !contentType.startsWith('video/') && !contentType.startsWith('audio/'))) {
      return NextResponse.json({ error: `The URL does not point to a valid media file. Content-Type received: ${contentType}` }, { status: 400 });
    }

    // Convert the downloaded file to a base64 data URI
    const mediaBuffer = Buffer.from(response.data, 'binary');
    const mediaDataUri = `data:${contentType};base64,${mediaBuffer.toString('base64')}`;

    // Perform the analysis using the existing server action
    const analysisResult = await performAnalysis(mediaDataUri);

    if ('error' in analysisResult) {
      // The analysis itself failed
      return NextResponse.json({ error: analysisResult.error }, { status: 500 });
    }

    // Return the successful analysis result
    return NextResponse.json(analysisResult);

  } catch (error: any) {
    console.error('Error in analyze-url route:', error);

    let errorMessage = 'An unknown error occurred while fetching or processing the URL.';
    let statusCode = 500;

    if (axios.isAxiosError(error)) {
        if (error.response) {
            errorMessage = `Failed to fetch from URL. Server responded with status: ${error.response.status}`;
            statusCode = 400;
        } else if (error.request) {
            errorMessage = 'Failed to fetch from URL. The request was made but no response was received.';
            statusCode = 400;
        }
    } else {
        errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
