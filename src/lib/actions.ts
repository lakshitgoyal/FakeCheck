'use server';

import { generateTamperReport, type GenerateTamperReportOutput } from '@/ai/flows/generate-tamper-report';
import axios from 'axios';

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

export async function analyzeUrl(url: string): Promise<GenerateTamperReportOutput | { error: string }> {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      maxContentLength: 200 * 1024 * 1024, // 200MB limit
    });
    
    const contentType = response.headers['content-type'];
    if (!contentType || (!contentType.startsWith('image/') && !contentType.startsWith('video/'))) {
      return { error: 'The URL does not point to a valid image or video file.' };
    }

    const buffer = Buffer.from(response.data, 'binary');
    const mediaDataUri = `data:${contentType};base64,${buffer.toString('base64')}`;
    
    return await performAnalysis(mediaDataUri);

  } catch (e: any) {
    console.error("URL Analysis failed:", e);

    if (e.code === 'ERR_BAD_REQUEST' || e.response?.status === 404) {
      return { error: 'Could not access the URL. Please check if it is correct and publicly accessible.' };
    }
    if (e.code === 'ERR_CONTENT_LENGTH_MISMATCH') {
      return { error: 'The file at the URL is too large to process.'}
    }

    return { error: 'An error occurred while fetching the media from the URL.' };
  }
}