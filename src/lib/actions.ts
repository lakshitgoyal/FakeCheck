'use server';

import { generateTamperReport, type GenerateTamperReportOutput } from '@/ai/flows/generate-tamper-heatmaps';
import axios from 'axios';

type AnalyzeUrlSuccess = GenerateTamperReportOutput & { mediaDataUri: string };

function getContentTypeFromUrl(url: string, headers: any): string | null {
  // 1. Prefer the Content-Type header
  const headerContentType = headers['content-type'];
  if (headerContentType && (headerContentType.startsWith('image/') || headerContentType.startsWith('video/') || headerContentType.startsWith('audio/'))) {
    return headerContentType;
  }

  // 2. Fallback to file extension
  const extension = url.split('.').pop()?.toLowerCase().split('?')[0];
  const mimeMap: { [key: string]: string } = {
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

  if (extension && mimeMap[extension]) {
    return mimeMap[extension];
  }

  return headerContentType; // Return original header if no match, for error message
}


export async function performAnalysis(mediaDataUri: string): Promise<GenerateTamperReportOutput | { error: string }> {
  if (!mediaDataUri || typeof mediaDataUri !== 'string') {
    return { error: 'Invalid media data URI provided.' };
  }

  try {
    const result = await generateTamperReport({ mediaDataUri });
    return result;
  } catch (e) {
    console.error("Analysis failed:", e);
    return { error: 'An error occurred during AI analysis. Please try again.' };
  }
}

export async function analyzeUrl(url: string): Promise<AnalyzeUrlSuccess | { error: string }> {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      maxContentLength: 200 * 1024 * 1024, // 200MB limit
    });
    
    const contentType = getContentTypeFromUrl(url, response.headers);

    if (!contentType || (!contentType.startsWith('image/') && !contentType.startsWith('video/') && !contentType.startsWith('audio/'))) {
      return { error: 'The URL does not point to a valid image, video, or audio file.' };
    }

    const buffer = Buffer.from(response.data, 'binary');
    const mediaDataUri = `data:${contentType};base64,${buffer.toString('base64')}`;
    
    const analysisResult = await performAnalysis(mediaDataUri);
    if ('error' in analysisResult) {
      return analysisResult;
    }

    return { ...analysisResult, mediaDataUri };

  } catch (e: any) {
    console.error("URL Analysis failed:", e);

    if (e.code === 'ERR_BAD_REQUEST' || e.response?.status === 404) {
      return { error: 'Could not access the URL. Please check if it is correct and publicly accessible.' };
    }
    if (e.code === 'ERR_CONTENT_LENGTH_MISMATCH' || (e.message && e.message.includes('maxContentLength'))) {
      return { error: 'The file at the URL is too large to process.'}
    }

    return { error: 'An error occurred while fetching the media from the URL.' };
  }
}
